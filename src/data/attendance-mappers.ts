import { randomUUID } from 'node:crypto'
import { whatsAppReadiness } from '@/lib/whatsapp-cloud'
import type {
  AttendanceDoc,
  AuditEntry,
  CompletionSnapshot,
  NotificationDoc,
  PackageDoc,
  StudentDoc,
} from '@/data/attendance-db'
import type { NotificationRecipient, NotificationStatus } from '@/lib/attendance-rules'

export type StudentRow = {
  id: string
  name: string
  contactName: string
  whatsapp: string
  isMinor: boolean
  whatsappConsent: boolean
  place: StudentDoc['place']
  batch?: string
  status: StudentDoc['status']
  activePackage?: {
    id: string
    number: number
    attended: number
    target: number
    lastClassDate?: string
    markedToday: boolean
  }
  lastCompletedAt?: string
}

export type AttendanceRow = {
  id: string
  classDate: string
  status: 'attended' | 'removed'
  markedAt: string
  markedBy: string
  history: { at: string; by: string; action: string; reason?: string; from?: string; to?: string }[]
}

export type NotificationRow = {
  id: string
  recipient: NotificationRecipient
  status: NotificationStatus
  statusNote?: string
  to?: string
  attempts: number
  wamid?: string
  lastError?: { code?: number; title: string; at: string }
  createdAt: string
  updatedAt: string
  sentAt?: string
  completionSeq: number
  revision: number
  events: { status: string; at: string }[]
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  for (const key of Object.keys(value)) if (value[key] === undefined) delete value[key]
  return value
}

export function toStudentRow(doc: StudentDoc): StudentRow {
  return omitUndefined({
    id: doc._id,
    name: doc.name,
    contactName: doc.contactName,
    whatsapp: doc.whatsapp,
    isMinor: doc.isMinor,
    whatsappConsent: doc.whatsappConsent,
    place: doc.place,
    batch: doc.batch,
    status: doc.status,
  })
}

function toAuditRow(entry: AuditEntry): AttendanceRow['history'][number] {
  return omitUndefined({
    at: entry.at.toISOString(),
    by: entry.by,
    action: entry.action,
    reason: entry.reason,
    from: entry.from,
    to: entry.to,
  })
}

export function toAttendanceRow(doc: AttendanceDoc): AttendanceRow {
  return {
    id: doc._id,
    classDate: doc.classDate,
    status: doc.status,
    markedAt: doc.markedAt.toISOString(),
    markedBy: doc.markedBy,
    history: (doc.history ?? []).map(toAuditRow),
  }
}

export function toNotificationRow(doc: NotificationDoc): NotificationRow {
  return omitUndefined({
    id: doc._id,
    recipient: doc.recipient,
    status: doc.status,
    statusNote: doc.statusNote,
    to: doc.to,
    attempts: doc.attempts,
    wamid: doc.wamid,
    lastError: doc.lastError
      ? omitUndefined({ code: doc.lastError.code, title: doc.lastError.title, at: doc.lastError.at.toISOString() })
      : undefined,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    sentAt: doc.sentAt?.toISOString(),
    completionSeq: doc.completionSeq,
    revision: doc.revision,
    events: (doc.events ?? []).map((e) => ({ status: e.status, at: e.at.toISOString() })),
  })
}

export function toCompletionView(c: CompletionSnapshot) {
  return omitUndefined({
    seq: c.seq,
    completedAt: c.completedAt.toISOString(),
    dates: [...c.dates],
    reopenedAt: c.reopenedAt?.toISOString(),
    reopenReason: c.reopenReason,
  })
}

/**
 * The two notification rows for a completion (or a corrected calendar).
 * `reopened` marks a re-completion after a reopen: sent by hand, never
 * automatically. Pure apart from reading the WhatsApp environment.
 */
export function buildNotificationRows(args: {
  student: StudentDoc
  pkg: Pick<PackageDoc, '_id'>
  seq: number
  revision: number
  dates: string[]
  now: Date
  reopened: boolean
}): NotificationDoc[] {
  const { student, pkg, seq, revision, dates, now, reopened } = args
  const readiness = whatsAppReadiness()

  const make = (
    recipient: NotificationRecipient,
    to: string | undefined,
    status: NotificationStatus,
    statusNote?: string,
  ): NotificationDoc =>
    omitUndefined({
      _id: randomUUID(),
      key: `${pkg._id}:${seq}:${revision}:${recipient}`,
      packageId: pkg._id,
      studentId: student._id,
      completionSeq: seq,
      revision,
      recipient,
      to,
      dates: [...dates],
      status,
      statusNote,
      attempts: 0,
      nextAttemptAt: status === 'pending' ? now : undefined,
      events: [],
      createdAt: now,
      updatedAt: now,
    })

  let studentRow: NotificationDoc
  if (!student.whatsappConsent) {
    studentRow = make('student', student.whatsapp, 'skipped', 'No WhatsApp consent recorded')
  } else if (!readiness.configured) {
    studentRow = make('student', student.whatsapp, 'held', 'WhatsApp is not connected yet')
  } else if (reopened) {
    studentRow = make('student', student.whatsapp, 'held', 'Completed again after a reopen; send manually')
  } else {
    studentRow = make('student', student.whatsapp, 'pending')
  }

  let schoolRow: NotificationDoc
  if (!readiness.schoolRecipient) {
    schoolRow = make('school', undefined, 'held', 'School recipient number not set')
  } else if (!readiness.configured) {
    schoolRow = make('school', readiness.schoolRecipient, 'held', 'WhatsApp is not connected yet')
  } else if (reopened) {
    schoolRow = make('school', readiness.schoolRecipient, 'held', 'Completed again after a reopen; send manually')
  } else {
    schoolRow = make('school', readiness.schoolRecipient, 'pending')
  }
  return [studentRow, schoolRow]
}
