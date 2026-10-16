import 'server-only'

import { randomUUID } from 'node:crypto'
import type { ClientSession } from 'mongodb'
import {
  attendanceCollections,
  inTransaction,
  isDuplicateKey,
  type AttendanceCollections,
  type AttendanceDoc,
  type CompletionSnapshot,
  type PackageDoc,
  type StudentDoc,
} from '@/data/attendance-db'
import { buildNotificationRows } from '@/data/attendance-mappers'
import {
  ID_PATTERN,
  PACKAGE_TARGET,
  classDateSchema,
  isCalendarDate,
  nameKey,
  type StudentInput,
  type StudentStatus,
} from '@/lib/attendance-rules'

type Result<T, E extends string> = ({ ok: true } & T) | { ok: false; error: E; message: string }

const fail = <E extends string>(error: E, message: string): { ok: false; error: E; message: string } => ({
  ok: false,
  error,
  message,
})

/** Thrown inside a transaction when a guarded write lost a race; the whole transaction re-runs. */
class PackageChanged extends Error {}

const MAX_ATTEMPTS = 5

/** Re-runs a transaction that lost a race (guarded update or unique-index clash). */
async function withRetries<T>(work: (session: ClientSession) => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await inTransaction(work)
    } catch (error) {
      const retryable = error instanceof PackageChanged || isDuplicateKey(error)
      if (!retryable || attempt >= MAX_ATTEMPTS) throw error
    }
  }
}

const validId = (id: string) => ID_PATTERN.test(id)

function isRealPastDate(value: string): boolean {
  return isCalendarDate(value) && classDateSchema().safeParse(value).success
}

/* ---------------------------------------------------------------- students */

function studentFields(input: StudentInput) {
  return {
    name: input.name,
    nameKey: nameKey(input.name),
    isMinor: input.isMinor,
    contactName: input.contactName,
    whatsapp: input.whatsapp,
    whatsappConsent: input.whatsappConsent,
    place: input.place,
    ...(input.batch ? { batch: input.batch } : {}),
  }
}

export async function createStudent(
  input: StudentInput,
  by: string,
): Promise<Result<{ id: string; sharedNumberWith: string[] }, 'duplicate_student'>> {
  const c = await attendanceCollections()
  const now = new Date()
  const doc: StudentDoc = {
    _id: randomUUID(),
    ...studentFields(input),
    ...(input.whatsappConsent ? { consentRecordedAt: now } : {}),
    status: 'active',
    createdAt: now,
    createdBy: by,
    updatedAt: now,
    updatedBy: by,
  }
  try {
    await c.students.insertOne(doc)
  } catch (error) {
    if (isDuplicateKey(error)) {
      return fail('duplicate_student', 'A student with this name and WhatsApp number already exists.')
    }
    throw error
  }
  const siblings = await c.students
    .find({ whatsapp: doc.whatsapp, _id: { $ne: doc._id } }, { projection: { name: 1 } })
    .toArray()
  return { ok: true, id: doc._id, sharedNumberWith: siblings.map((s) => s.name) }
}

export async function updateStudent(
  id: string,
  input: StudentInput,
  by: string,
): Promise<Result<object, 'not_found' | 'duplicate_student'>> {
  if (!validId(id)) return fail('not_found', 'Student not found.')
  const c = await attendanceCollections()
  const existing = await c.students.findOne({ _id: id })
  if (!existing) return fail('not_found', 'Student not found.')
  const now = new Date()
  const fields = studentFields(input)
  const unset: Record<string, ''> = {}
  if (!input.batch) unset.batch = ''
  const set: Record<string, unknown> = { ...fields, updatedAt: now, updatedBy: by }
  if (input.whatsappConsent && !existing.whatsappConsent) set.consentRecordedAt = now
  if (!input.whatsappConsent) unset.consentRecordedAt = ''
  try {
    await c.students.updateOne({ _id: id }, { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) })
  } catch (error) {
    if (isDuplicateKey(error)) {
      return fail('duplicate_student', 'A student with this name and WhatsApp number already exists.')
    }
    throw error
  }
  return { ok: true }
}

export async function setStudentStatus(id: string, status: StudentStatus, by: string): Promise<Result<object, 'not_found'>> {
  if (!validId(id)) return fail('not_found', 'Student not found.')
  const c = await attendanceCollections()
  const res = await c.students.updateOne({ _id: id }, { $set: { status, updatedAt: new Date(), updatedBy: by } })
  return res.matchedCount === 1 ? { ok: true } : fail('not_found', 'Student not found.')
}

/** DPDP erasure: the student, their packages, attendance and notifications. Irreversible. */
export async function eraseStudent(id: string, confirmName: string): Promise<Result<object, 'not_found' | 'name_mismatch'>> {
  if (!validId(id)) return fail('not_found', 'Student not found.')
  const c = await attendanceCollections()
  return inTransaction(async (session) => {
    const student = await c.students.findOne({ _id: id }, { session })
    if (!student) return fail('not_found', 'Student not found.')
    if (nameKey(confirmName) !== student.nameKey) {
      return fail('name_mismatch', 'The name typed does not match this student.')
    }
    await c.notifications.deleteMany({ studentId: id }, { session })
    await c.attendance.deleteMany({ studentId: id }, { session })
    await c.packages.deleteMany({ studentId: id }, { session })
    await c.students.deleteOne({ _id: id }, { session })
    return { ok: true as const }
  })
}

/* ---------------------------------------------------------------- packages */

export async function startPackage(
  studentId: string,
  by: string,
): Promise<Result<{ packageId: string; number: number }, 'not_found' | 'inactive_student' | 'active_package_exists'>> {
  if (!validId(studentId)) return fail('not_found', 'Student not found.')
  const c = await attendanceCollections()
  try {
    return await withRetries(async (session) => createPackage(c, studentId, by, session))
  } catch (error) {
    if (isDuplicateKey(error)) return fail('active_package_exists', 'This student already has an active package.')
    throw error
  }
}

async function createPackage(c: AttendanceCollections, studentId: string, by: string, session: ClientSession) {
  const student = await c.students.findOne({ _id: studentId }, { session })
  if (!student) return fail('not_found' as const, 'Student not found.')
  if (student.status !== 'active') return fail('inactive_student' as const, 'This student is inactive.')
  const active = await c.packages.findOne({ studentId, status: 'active' }, { session })
  if (active) return fail('active_package_exists' as const, `Package ${active.number} is still active.`)
  const latest = await c.packages.find({ studentId }, { session }).sort({ number: -1 }).limit(1).toArray()
  const number = (latest[0]?.number ?? 0) + 1
  const now = new Date()
  const pkg: PackageDoc = {
    _id: randomUUID(),
    studentId,
    number,
    target: PACKAGE_TARGET,
    status: 'active',
    attendedCount: 0,
    startedAt: now,
    startedBy: by,
    completionHistory: [],
    revision: 0,
    updatedAt: now,
  }
  await c.packages.insertOne(pkg, { session })
  return { ok: true as const, packageId: pkg._id, number }
}

type MarkResult = Result<
  { status: 'marked' | 'already_marked'; packageId: string; attended: number; target: number; completed: boolean },
  'not_found' | 'inactive_student' | 'no_active_package' | 'package_full' | 'date_in_other_package' | 'invalid_date'
>

export async function markAttendance(studentId: string, classDate: string, by: string): Promise<MarkResult> {
  if (!validId(studentId)) return fail('not_found', 'Student not found.')
  if (!isRealPastDate(classDate)) return fail('invalid_date', 'Choose a valid class date that is not in the future.')
  const c = await attendanceCollections()
  return withRetries<MarkResult>(async (session) => {
    const student = await c.students.findOne({ _id: studentId }, { session })
    if (!student) return fail('not_found', 'Student not found.')
    if (student.status !== 'active') return fail('inactive_student', 'This student is inactive.')
    const pkg = await c.packages.findOne({ studentId, status: 'active' }, { session })
    if (!pkg) return fail('no_active_package', 'This student has no active package.')

    const existing = await c.attendance.findOne({ studentId, classDate, status: 'attended' }, { session })
    if (existing) {
      if (existing.packageId === pkg._id) {
        const attended = await c.attendance.countDocuments({ packageId: pkg._id, status: 'attended' }, { session })
        return { ok: true, status: 'already_marked', packageId: pkg._id, attended, target: pkg.target, completed: false }
      }
      const other = await c.packages.findOne({ _id: existing.packageId }, { session })
      return fail('date_in_other_package', `That date is already counted in package ${other?.number ?? 'an earlier package'}.`)
    }

    const count = await c.attendance.countDocuments({ packageId: pkg._id, status: 'attended' }, { session })
    if (count >= pkg.target) return fail('package_full', 'This package already has all its classes.')

    const now = new Date()
    const record: AttendanceDoc = {
      _id: randomUUID(),
      studentId,
      packageId: pkg._id,
      classDate,
      status: 'attended',
      markedAt: now,
      markedBy: by,
      history: [{ at: now, by, action: 'marked' }],
    }
    await c.attendance.insertOne(record, { session })

    const next = count + 1
    const completes = next >= pkg.target
    let snapshot: CompletionSnapshot | undefined
    if (completes) {
      const rows = await c.attendance
        .find({ packageId: pkg._id, status: 'attended' }, { session })
        .sort({ classDate: 1 })
        .toArray()
      snapshot = {
        seq: pkg.completionHistory.length + 1,
        completedAt: now,
        completedBy: by,
        dates: rows.map((r) => r.classDate),
        attendanceIds: rows.map((r) => r._id),
      }
    }
    const res = await c.packages.updateOne(
      { _id: pkg._id, status: 'active', attendedCount: pkg.attendedCount },
      {
        $set: {
          attendedCount: next,
          updatedAt: now,
          ...(snapshot ? { status: 'completed' as const, completedAt: now, completion: snapshot, revision: 0 } : {}),
        },
      },
      { session },
    )
    if (res.matchedCount !== 1) throw new PackageChanged()

    if (snapshot) {
      const rows = buildNotificationRows({
        student,
        pkg,
        seq: snapshot.seq,
        revision: 0,
        dates: snapshot.dates,
        now,
        reopened: snapshot.seq > 1,
      })
      await c.notifications.insertMany(rows, { session })
    }
    return { ok: true, status: 'marked', packageId: pkg._id, attended: next, target: pkg.target, completed: completes }
  })
}

/* -------------------------------------------------------------- corrections */

export async function removeAttendance(
  attendanceId: string,
  reason: string,
  by: string,
): Promise<Result<{ attended: number }, 'not_found' | 'already_removed' | 'package_completed'>> {
  if (!validId(attendanceId)) return fail('not_found', 'Attendance record not found.')
  const c = await attendanceCollections()
  return withRetries(async (session) => {
    const record = await c.attendance.findOne({ _id: attendanceId }, { session })
    if (!record) return fail('not_found' as const, 'Attendance record not found.')
    if (record.status === 'removed') return fail('already_removed' as const, 'This class was already removed.')
    const pkg = await c.packages.findOne({ _id: record.packageId }, { session })
    if (!pkg) return fail('not_found' as const, 'Package not found.')
    if (pkg.status === 'completed') {
      return fail('package_completed' as const, 'This package is complete. Reopen it before removing a class.')
    }
    const now = new Date()
    const marked = await c.attendance.updateOne(
      { _id: attendanceId, status: 'attended' },
      { $set: { status: 'removed' }, $push: { history: { at: now, by, action: 'removed', reason } } },
      { session },
    )
    if (marked.matchedCount !== 1) throw new PackageChanged()
    const attended = await c.attendance.countDocuments({ packageId: pkg._id, status: 'attended' }, { session })
    const res = await c.packages.updateOne(
      { _id: pkg._id, status: 'active', attendedCount: pkg.attendedCount },
      { $set: { attendedCount: attended, updatedAt: now } },
      { session },
    )
    if (res.matchedCount !== 1) throw new PackageChanged()
    return { ok: true as const, attended }
  })
}

export async function changeAttendanceDate(
  attendanceId: string,
  newDate: string,
  reason: string,
  by: string,
): Promise<Result<{ amended: boolean }, 'not_found' | 'already_removed' | 'duplicate_date' | 'invalid_date'>> {
  if (!validId(attendanceId)) return fail('not_found', 'Attendance record not found.')
  if (!isRealPastDate(newDate)) return fail('invalid_date', 'Choose a valid class date that is not in the future.')
  const c = await attendanceCollections()
  try {
    return await withRetries(async (session) => {
      const record = await c.attendance.findOne({ _id: attendanceId }, { session })
      if (!record) return fail('not_found' as const, 'Attendance record not found.')
      if (record.status === 'removed') return fail('already_removed' as const, 'This class was removed.')
      if (record.classDate === newDate) return fail('duplicate_date' as const, 'The class is already on that date.')
      const clash = await c.attendance.findOne(
        { studentId: record.studentId, classDate: newDate, status: 'attended' },
        { session },
      )
      if (clash) return fail('duplicate_date' as const, 'Another class is already marked on that date.')
      const pkg = await c.packages.findOne({ _id: record.packageId }, { session })
      if (!pkg) return fail('not_found' as const, 'Package not found.')
      const now = new Date()
      await c.attendance.updateOne(
        { _id: attendanceId, status: 'attended' },
        {
          $set: { classDate: newDate },
          $push: { history: { at: now, by, action: 'date_changed', reason, from: record.classDate, to: newDate } },
        },
        { session },
      )
      const amended = pkg.status === 'completed'
      if (amended) await c.packages.updateOne({ _id: pkg._id }, { $set: { amendedAt: now, updatedAt: now } }, { session })
      return { ok: true as const, amended }
    })
  } catch (error) {
    if (isDuplicateKey(error)) return fail('duplicate_date', 'Another class is already marked on that date.')
    throw error
  }
}

export async function reopenPackage(
  packageId: string,
  reason: string,
  by: string,
): Promise<Result<object, 'not_found' | 'not_completed' | 'newer_package_active'>> {
  if (!validId(packageId)) return fail('not_found', 'Package not found.')
  const c = await attendanceCollections()
  try {
    return await withRetries(async (session) => {
      const pkg = await c.packages.findOne({ _id: packageId }, { session })
      if (!pkg) return fail('not_found' as const, 'Package not found.')
      if (pkg.status !== 'completed' || !pkg.completion) return fail('not_completed' as const, 'This package is not complete.')
      const other = await c.packages.findOne({ studentId: pkg.studentId, status: 'active' }, { session })
      if (other) {
        return fail('newer_package_active' as const, `Package ${other.number} is active. Only one package can be active.`)
      }
      const now = new Date()
      const res = await c.packages.updateOne(
        { _id: packageId, status: 'completed' },
        {
          $push: {
            completionHistory: { ...pkg.completion, reopenedAt: now, reopenedBy: by, reopenReason: reason },
          },
          $set: { status: 'active', revision: 0, updatedAt: now },
          $unset: { completion: '', completedAt: '', amendedAt: '' },
        },
        { session },
      )
      if (res.matchedCount !== 1) throw new PackageChanged()
      return { ok: true as const }
    })
  } catch (error) {
    if (isDuplicateKey(error)) return fail('newer_package_active', 'Another package is active. Only one package can be active.')
    throw error
  }
}

export async function sendCorrectedCalendar(
  packageId: string,
  by: string,
): Promise<Result<{ revision: number }, 'not_found' | 'not_amended'>> {
  if (!validId(packageId)) return fail('not_found', 'Package not found.')
  const c = await attendanceCollections()
  return withRetries(async (session) => {
    const pkg = await c.packages.findOne({ _id: packageId }, { session })
    if (!pkg) return fail('not_found' as const, 'Package not found.')
    if (pkg.status !== 'completed' || !pkg.completion || !pkg.amendedAt) {
      return fail('not_amended' as const, 'No class date has been changed since this package was completed.')
    }
    const student = await c.students.findOne({ _id: pkg.studentId }, { session })
    if (!student) return fail('not_found' as const, 'Student not found.')
    const attended = await c.attendance
      .find({ packageId, status: 'attended' }, { session })
      .sort({ classDate: 1 })
      .toArray()
    const now = new Date()
    const revision = pkg.revision + 1
    // The change is now sent on, so the "amended" flag is cleared with the bump.
    const res = await c.packages.updateOne(
      { _id: packageId, status: 'completed', revision: pkg.revision, amendedAt: { $exists: true } },
      { $set: { revision, updatedAt: now }, $unset: { amendedAt: '' } },
      { session },
    )
    if (res.matchedCount !== 1) throw new PackageChanged()
    const rows = buildNotificationRows({
      student,
      pkg,
      seq: pkg.completion.seq,
      revision,
      dates: attended.map((a) => a.classDate),
      now,
      reopened: false,
    }).map((row) => (row.status === 'pending' ? { ...row, manualBy: by } : row))
    await c.notifications.insertMany(rows, { session })
    return { ok: true as const, revision }
  })
}
