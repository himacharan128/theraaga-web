import 'server-only'

import { attendanceCollections } from '@/data/attendance-db'
import type { StudentDoc } from '@/data/attendance-db'
import {
  toAttendanceRow,
  toCompletionView,
  toNotificationRow,
  toStudentRow,
  type AttendanceRow,
  type NotificationRow,
  type StudentRow,
} from '@/data/attendance-mappers'
import { ID_PATTERN, PACKAGE_TARGET, todayAtSchool, type StudentStatus } from '@/lib/attendance-rules'

export type { AttendanceRow, NotificationRow, StudentRow }

export type PackageView = {
  id: string
  number: number
  status: 'active' | 'completed'
  target: number
  attended: number
  startedAt: string
  completedAt?: string
  amended: boolean
  revision: number
  completion?: { seq: number; completedAt: string; dates: string[] }
  completionHistory: { seq: number; completedAt: string; dates: string[]; reopenedAt?: string; reopenReason?: string }[]
  attendance: AttendanceRow[]
  notifications: NotificationRow[]
}

export type AttendanceSummary = {
  activeStudents: number
  activePackages: number
  approaching: StudentRow[]
  recentCompletions: {
    packageId: string
    studentId: string
    studentName: string
    number: number
    completedAt: string
    notifications: NotificationRow[]
  }[]
  needsAttention: {
    notificationId: string
    packageId: string
    studentId: string
    studentName: string
    recipient: string
    status: string
    statusNote?: string
  }[]
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Adds active-package progress and last completion to student documents. */
async function withProgress(docs: StudentDoc[]): Promise<StudentRow[]> {
  if (docs.length === 0) return []
  const c = await attendanceCollections()
  const ids = docs.map((d) => d._id)
  const today = todayAtSchool()
  const [active, completed] = await Promise.all([
    c.packages.find({ studentId: { $in: ids }, status: 'active' }).toArray(),
    c.packages
      .aggregate<{ _id: string; at: Date }>([
        { $match: { studentId: { $in: ids }, status: 'completed' } },
        { $group: { _id: '$studentId', at: { $max: '$completedAt' } } },
      ])
      .toArray(),
  ])
  const attendance = active.length
    ? await c.attendance
        .find({ packageId: { $in: active.map((p) => p._id) }, status: 'attended' }, { projection: { packageId: 1, classDate: 1 } })
        .toArray()
    : []
  const lastByPackage = new Map<string, string>()
  const todayPackages = new Set<string>()
  for (const a of attendance) {
    if ((lastByPackage.get(a.packageId) ?? '') < a.classDate) lastByPackage.set(a.packageId, a.classDate)
    if (a.classDate === today) todayPackages.add(a.packageId)
  }
  const activeByStudent = new Map(active.map((p) => [p.studentId, p]))
  const completedBy = new Map(completed.map((r) => [r._id, r.at]))
  return docs.map((doc) => {
    const row = toStudentRow(doc)
    const pkg = activeByStudent.get(doc._id)
    if (pkg) {
      row.activePackage = {
        id: pkg._id,
        number: pkg.number,
        attended: pkg.attendedCount,
        target: pkg.target,
        ...(lastByPackage.has(pkg._id) ? { lastClassDate: lastByPackage.get(pkg._id) } : {}),
        markedToday: todayPackages.has(pkg._id),
      }
    }
    const at = completedBy.get(doc._id)
    if (at) row.lastCompletedAt = at.toISOString()
    return row
  })
}

export async function listStudents(opts: { q?: string; status?: StudentStatus | 'all' } = {}): Promise<StudentRow[]> {
  const c = await attendanceCollections()
  const filter: Record<string, unknown> = {}
  if (opts.status && opts.status !== 'all') filter.status = opts.status
  const q = (opts.q ?? '').trim().slice(0, 80)
  if (q) {
    const or: Record<string, unknown>[] = [
      { nameKey: { $regex: escapeRegex(q.replace(/\s+/g, ' ').toLocaleLowerCase('en-IN')) } },
      { contactName: { $regex: escapeRegex(q), $options: 'i' } },
    ]
    const digits = q.replace(/\D/g, '')
    if (digits.length >= 3 && /^[\d\s+().-]+$/.test(q)) or.push({ whatsapp: { $regex: escapeRegex(digits) } })
    filter.$or = or
  }
  const docs = await c.students.find(filter).sort({ nameKey: 1, _id: 1 }).limit(200).toArray()
  return withProgress(docs)
}

export async function getStudentDetail(id: string): Promise<{
  student: StudentRow & { createdAt: string; updatedAt: string; consentRecordedAt?: string }
  packages: PackageView[]
} | null> {
  if (!ID_PATTERN.test(id)) return null
  const c = await attendanceCollections()
  const doc = await c.students.findOne({ _id: id })
  if (!doc) return null
  const [rows, packages, attendance, notifications] = await Promise.all([
    withProgress([doc]),
    c.packages.find({ studentId: id }).sort({ number: -1 }).toArray(),
    c.attendance.find({ studentId: id }).sort({ classDate: 1, markedAt: 1 }).toArray(),
    c.notifications.find({ studentId: id }).sort({ createdAt: 1, recipient: 1 }).toArray(),
  ])
  const student = {
    ...rows[0],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    ...(doc.consentRecordedAt ? { consentRecordedAt: doc.consentRecordedAt.toISOString() } : {}),
  }
  const views: PackageView[] = packages.map((pkg) => {
    const view: PackageView = {
      id: pkg._id,
      number: pkg.number,
      status: pkg.status,
      target: pkg.target,
      attended: pkg.attendedCount,
      startedAt: pkg.startedAt.toISOString(),
      amended: Boolean(pkg.amendedAt),
      revision: pkg.revision,
      completionHistory: (pkg.completionHistory ?? []).map(toCompletionView),
      attendance: attendance.filter((a) => a.packageId === pkg._id).map(toAttendanceRow),
      notifications: notifications.filter((n) => n.packageId === pkg._id).map(toNotificationRow),
    }
    if (pkg.completedAt) view.completedAt = pkg.completedAt.toISOString()
    if (pkg.completion) {
      const { seq, completedAt, dates } = toCompletionView(pkg.completion)
      view.completion = { seq, completedAt, dates }
    }
    return view
  })
  return { student, packages: views }
}

export async function getAttendanceSummary(): Promise<AttendanceSummary> {
  const c = await attendanceCollections()
  const since = new Date(Date.now() - 45 * 86_400_000)
  const [activeStudents, activePackages, nearing, recent, attention] = await Promise.all([
    c.students.countDocuments({ status: 'active' }),
    c.packages.countDocuments({ status: 'active' }),
    c.packages.find({ status: 'active', attendedCount: { $gte: PACKAGE_TARGET - 2 } }).limit(100).toArray(),
    c.packages.find({ status: 'completed', completedAt: { $gte: since } }).sort({ completedAt: -1 }).limit(20).toArray(),
    c.notifications.find({ status: { $in: ['held', 'failed', 'uncertain'] } }).sort({ createdAt: -1 }).limit(100).toArray(),
  ])
  const studentIds = [...new Set([...nearing, ...recent].map((p) => p.studentId).concat(attention.map((n) => n.studentId)))]
  const students = studentIds.length ? await c.students.find({ _id: { $in: studentIds } }).toArray() : []
  const byId = new Map(students.map((s) => [s._id, s]))
  const approachingDocs = nearing
    .map((p) => byId.get(p.studentId))
    .filter((s): s is StudentDoc => !!s && s.status === 'active')
  const approaching = (await withProgress(approachingDocs)).sort((a, b) => a.name.localeCompare(b.name))
  const recentNotes = recent.length
    ? await c.notifications.find({ packageId: { $in: recent.map((p) => p._id) } }).sort({ createdAt: 1 }).toArray()
    : []
  return {
    activeStudents,
    activePackages,
    approaching,
    recentCompletions: recent.flatMap((p) => {
      const student = byId.get(p.studentId)
      if (!student || !p.completedAt) return []
      return [
        {
          packageId: p._id,
          studentId: p.studentId,
          studentName: student.name,
          number: p.number,
          completedAt: p.completedAt.toISOString(),
          notifications: recentNotes
            .filter((n) => n.packageId === p._id && n.completionSeq === p.completion?.seq)
            .map(toNotificationRow),
        },
      ]
    }),
    needsAttention: attention.flatMap((n) => {
      const student = byId.get(n.studentId)
      if (!student) return []
      return [
        {
          notificationId: n._id,
          packageId: n.packageId,
          studentId: n.studentId,
          studentName: student.name,
          recipient: n.recipient,
          status: n.status,
          ...(n.statusNote ? { statusNote: n.statusNote } : {}),
        },
      ]
    }),
  }
}

export async function getPackageForImage(
  packageId: string,
  revision?: number,
): Promise<{ studentName: string; number: number; target: number; dates: string[]; completedOn?: string } | null> {
  if (!ID_PATTERN.test(packageId)) return null
  const c = await attendanceCollections()
  const pkg = await c.packages.findOne({ _id: packageId })
  if (!pkg) return null
  const student = await c.students.findOne({ _id: pkg.studentId })
  if (!student) return null
  const current = await c.attendance
    .find({ packageId, status: 'attended' }, { projection: { classDate: 1 } })
    .toArray()
  const currentDates = current.map((a) => a.classDate).sort()
  let dates = currentDates
  if (pkg.completion) {
    // An explicit revision 0 is the calendar as first sent; otherwise the
    // snapshot is only right while the package has not been amended.
    const useSnapshot = revision === 0 || (revision === undefined && pkg.revision === 0 && !pkg.amendedAt)
    if (useSnapshot) dates = [...pkg.completion.dates]
  }
  return {
    studentName: student.name,
    number: pkg.number,
    target: pkg.target,
    dates,
    // The day of the last class, not the day it was entered: a package
    // backfilled on Friday for a Monday class was completed on Monday.
    ...(pkg.status === 'completed' && dates.length ? { completedOn: dates[dates.length - 1] } : {}),
  }
}
