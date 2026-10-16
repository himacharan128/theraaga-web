'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import {
  ID_PATTERN,
  PACKAGE_TARGET,
  classDateSchema,
  reasonSchema,
  studentInputSchema,
  type StudentStatus,
} from '@/lib/attendance-rules'
import { whatsAppReadiness } from '@/lib/whatsapp-cloud'
import {
  changeAttendanceDate,
  createStudent,
  eraseStudent,
  markAttendance,
  removeAttendance,
  reopenPackage,
  sendCorrectedCalendar,
  setStudentStatus,
  startPackage,
  updateStudent,
} from '@/data/attendance-store'
import { processDueNotifications, retryNotification } from '@/data/notifications'
import { formatClassDate } from '@/components/admin/attendance/format'
import type { ActionState } from '@/components/admin/attendance/states'

const GENERIC = 'Something went wrong. Nothing was changed. Please try again.'
const idSchema = z.string().regex(ID_PATTERN)

const text = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

const fail = (message: string, extra: Partial<ActionState> = {}): ActionState => ({ ok: false, message, ...extra })

/** Runs a store call and never lets a raw error reach the screen. */
async function guarded<T>(run: () => Promise<T>): Promise<T | null> {
  try {
    return await run()
  } catch (error) {
    console.error('attendance action failed', error instanceof Error ? error.name : 'unknown')
    return null
  }
}

function refresh(studentId?: string) {
  revalidatePath('/admin/attendance')
  revalidatePath('/admin/students')
  if (studentId) revalidatePath(`/admin/students/${studentId}`)
}

function sendInBackground(packageId: string) {
  after(async () => {
    try {
      await processDueNotifications({ packageId, limit: 4 })
      // Then a small slice of anything else due: on the Hobby plan the cron
      // runs once a day, so admin activity is what keeps retries moving.
      await processDueNotifications({ limit: 2 })
    } catch {
      console.error('notification send failed to start')
    }
  })
}

function parseStudent(formData: FormData) {
  const raw = {
    name: text(formData, 'name'),
    isMinor: text(formData, 'isMinor'),
    contactName: text(formData, 'contactName'),
    whatsapp: text(formData, 'whatsapp'),
    whatsappConsent: text(formData, 'whatsappConsent'),
    place: text(formData, 'place'),
    batch: text(formData, 'batch'),
  }
  const values = { ...raw }
  const parsed = studentInputSchema.safeParse(raw)
  if (parsed.success) return { ok: true as const, data: parsed.data, values }
  const fieldErrors: Record<string, string> = {}
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? 'form')
    fieldErrors[key] ??= issue.message
  }
  return { ok: false as const, state: fail('Please fix the highlighted fields.', { fieldErrors, values }) }
}

export async function createStudentAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = parseStudent(formData)
  if (!parsed.ok) return parsed.state
  const result = await guarded(() => createStudent(parsed.data, session.username))
  if (!result) return fail(GENERIC, { values: parsed.values })
  if (!result.ok) return fail(result.message, { values: parsed.values })
  refresh()
  redirect(`/admin/students/${result.id}?created=1${result.sharedNumberWith.length ? '&shared=1' : ''}`)
}

export async function updateStudentAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'id'))
  if (!id.success) return fail('That student could not be found.')
  const parsed = parseStudent(formData)
  if (!parsed.ok) return parsed.state
  const result = await guarded(() => updateStudent(id.data, parsed.data, session.username))
  if (!result) return fail(GENERIC, { values: parsed.values })
  if (!result.ok) return fail(result.message, { values: parsed.values })
  refresh(id.data)
  return { ok: true, message: 'Saved.' }
}

export async function setStudentStatusAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'id'))
  const status = z.enum(['active', 'inactive']).safeParse(text(formData, 'status'))
  if (!id.success || !status.success) return fail('That student could not be found.')
  const result = await guarded(() => setStudentStatus(id.data, status.data as StudentStatus, session.username))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  refresh(id.data)
  return { ok: true, message: status.data === 'active' ? 'Student is active again.' : 'Student marked inactive. History is kept.' }
}

export async function eraseStudentAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'id'))
  const confirmName = text(formData, 'confirmName').trim()
  if (!id.success) return fail('That student could not be found.')
  if (!confirmName) return fail('Type the student’s name to confirm.')
  const result = await guarded(() => eraseStudent(id.data, confirmName))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  refresh()
  redirect('/admin/students')
}

export async function startPackageAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'studentId'))
  if (!id.success) return fail('That student could not be found.')
  const result = await guarded(() => startPackage(id.data, session.username))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  refresh(id.data)
  return { ok: true, message: `Package ${result.number} started.` }
}

export async function markAttendanceAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'studentId'))
  const date = classDateSchema().safeParse(text(formData, 'classDate'))
  if (!id.success) return fail('That student could not be found.')
  if (!date.success) return fail(date.error.issues[0]?.message ?? 'Choose a valid date.')
  const startIfNeeded = text(formData, 'startIfNeeded') === '1'

  let result = await guarded(() => markAttendance(id.data, date.data, session.username))
  if (result && !result.ok && result.error === 'no_active_package' && startIfNeeded) {
    const started = await guarded(() => startPackage(id.data, session.username))
    if (!started) return fail(GENERIC)
    if (!started.ok) return fail(started.message)
    result = await guarded(() => markAttendance(id.data, date.data, session.username))
  }
  if (!result) return fail(GENERIC)
  refresh(id.data)
  if (!result.ok) return fail(result.message)

  const day = formatClassDate(date.data)
  if (result.status === 'already_marked') return { ok: true, message: `Already marked for ${day}. ${result.attended}/${result.target}.` }
  if (result.completed) {
    sendInBackground(result.packageId)
    const tail = whatsAppReadiness().configured
      ? 'Calendar queued for WhatsApp.'
      : 'WhatsApp is not connected yet, so the calendar is held.'
    return { ok: true, message: `Marked for ${day}. Package complete (${PACKAGE_TARGET}/${PACKAGE_TARGET}). ${tail}` }
  }
  const left = result.target - result.attended
  return { ok: true, message: `Marked for ${day}. ${result.attended}/${result.target}, ${left} to go.` }
}

export async function removeAttendanceAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'attendanceId'))
  const studentId = idSchema.safeParse(text(formData, 'studentId'))
  const reason = reasonSchema.safeParse(text(formData, 'reason'))
  if (!id.success || !studentId.success) return fail('That class could not be found.')
  if (!reason.success) return fail(reason.error.issues[0].message)
  const result = await guarded(() => removeAttendance(id.data, reason.data, session.username))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  refresh(studentId.data)
  return { ok: true, message: `Class removed. ${result.attended}/${PACKAGE_TARGET}.` }
}

export async function changeDateAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'attendanceId'))
  const studentId = idSchema.safeParse(text(formData, 'studentId'))
  const date = classDateSchema().safeParse(text(formData, 'newDate'))
  const reason = reasonSchema.safeParse(text(formData, 'reason'))
  if (!id.success || !studentId.success) return fail('That class could not be found.')
  if (!date.success) return fail(date.error.issues[0]?.message ?? 'Choose a valid date.')
  if (!reason.success) return fail(reason.error.issues[0].message)
  const result = await guarded(() => changeAttendanceDate(id.data, date.data, reason.data, session.username))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  refresh(studentId.data)
  return {
    ok: true,
    message: result.amended
      ? 'Date changed. The completed calendar now differs from what was sent; you can send a corrected calendar.'
      : 'Date changed.',
  }
}

export async function reopenPackageAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'packageId'))
  const studentId = idSchema.safeParse(text(formData, 'studentId'))
  const reason = reasonSchema.safeParse(text(formData, 'reason'))
  if (!id.success || !studentId.success) return fail('That package could not be found.')
  if (!reason.success) return fail(reason.error.issues[0].message)
  const result = await guarded(() => reopenPackage(id.data, reason.data, session.username))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  refresh(studentId.data)
  return { ok: true, message: 'Package reopened.' }
}

export async function sendCorrectedCalendarAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'packageId'))
  const studentId = idSchema.safeParse(text(formData, 'studentId'))
  if (!id.success || !studentId.success) return fail('That package could not be found.')
  const result = await guarded(() => sendCorrectedCalendar(id.data, session.username))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  sendInBackground(id.data)
  refresh(studentId.data)
  return { ok: true, message: 'Corrected calendar recorded. See the message status below.' }
}

export async function retryNotificationAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const id = idSchema.safeParse(text(formData, 'notificationId'))
  const packageId = idSchema.safeParse(text(formData, 'packageId'))
  const studentId = idSchema.safeParse(text(formData, 'studentId'))
  if (!id.success || !packageId.success || !studentId.success) return fail('That message could not be found.')
  const confirmUncertain = text(formData, 'confirmUncertain') === 'on'
  const result = await guarded(() => retryNotification(id.data, session.username, { confirmUncertain }))
  if (!result) return fail(GENERIC)
  if (!result.ok) return fail(result.message)
  sendInBackground(packageId.data)
  refresh(studentId.data)
  return { ok: true, message: 'Queued to send again.' }
}
