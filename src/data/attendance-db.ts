import 'server-only'

import type { ClientSession, Collection, Db } from 'mongodb'
import { getAdminDb, getAdminClient } from '@/data/admin-mongo'
import type {
  LearningPlace,
  NotificationRecipient,
  NotificationStatus,
  PackageStatus,
  StudentStatus,
} from '@/lib/attendance-rules'

/**
 * Stored shapes and indexes for students, eight-class packages, attendance
 * and completion notifications. Every rule that must hold under retries and
 * concurrent admins is enforced HERE, by a unique index, rather than by a
 * read-then-write in application code:
 *
 *   one active package per student      packages_one_active
 *   no duplicate package numbers         packages_student_number
 *   one attended class per student/day   attendance_student_day
 *   one message per completion/recipient notifications_key
 *
 * Collections live in the same database as the enquiries and are reached
 * through MONGODB_ADMIN_URI, the account that already needs readWrite.
 */

export type AuditEntry = {
  at: Date
  by: string
  action: string
  reason?: string
  from?: string
  to?: string
}

export type StudentDoc = {
  _id: string
  name: string
  nameKey: string
  isMinor: boolean
  contactName: string
  /** E.164 digits, no plus sign. */
  whatsapp: string
  whatsappConsent: boolean
  consentRecordedAt?: Date
  place: LearningPlace
  batch?: string
  status: StudentStatus
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

/** The frozen record of a package reaching its target. Never edited after. */
export type CompletionSnapshot = {
  seq: number
  completedAt: Date
  completedBy: string
  /** Sorted YYYY-MM-DD dates of the attended classes at completion. */
  dates: string[]
  attendanceIds: string[]
  /** Set if a reopen later superseded this completion. */
  reopenedAt?: Date
  reopenedBy?: string
  reopenReason?: string
}

export type PackageDoc = {
  _id: string
  studentId: string
  /** 1, 2, 3 … per student. */
  number: number
  target: number
  status: PackageStatus
  /** Cache of attended records, only ever written inside the same transaction. */
  attendedCount: number
  startedAt: Date
  startedBy: string
  completedAt?: Date
  /** The current completion, while status is `completed`. */
  completion?: CompletionSnapshot
  /** Earlier completions superseded by a reopen, oldest first. */
  completionHistory: CompletionSnapshot[]
  /** A class date was changed after completion; the sent calendar is stale. */
  amendedAt?: Date
  /** Corrected-calendar sends so far for the current completion. */
  revision: number
  updatedAt: Date
}

export type AttendanceDoc = {
  _id: string
  studentId: string
  packageId: string
  /** YYYY-MM-DD at the school. */
  classDate: string
  status: 'attended' | 'removed'
  markedAt: Date
  markedBy: string
  history: AuditEntry[]
}

export type NotificationEvent = {
  status: string
  /** When WhatsApp says it happened. */
  at: Date
  receivedAt: Date
  errorCode?: number
  errorTitle?: string
}

export type NotificationDoc = {
  _id: string
  /** `${packageId}:${completionSeq}:${revision}:${recipient}` */
  key: string
  packageId: string
  studentId: string
  completionSeq: number
  revision: number
  recipient: NotificationRecipient
  /** E.164 digits, captured when the row is created. */
  to?: string
  /** The dates on the calendar this row sends. */
  dates: string[]
  status: NotificationStatus
  /** Why it is held, skipped or failed, in words for the dashboard. */
  statusNote?: string
  attempts: number
  nextAttemptAt?: Date
  leaseUntil?: Date
  /** Random per claim; echoed back by WhatsApp in biz_opaque_callback_data. */
  sendToken?: string
  wamid?: string
  lastError?: { code?: number; title: string; at: Date }
  events: NotificationEvent[]
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  manualBy?: string
}

export type AttendanceCollections = {
  db: Db
  students: Collection<StudentDoc>
  packages: Collection<PackageDoc>
  attendance: Collection<AttendanceDoc>
  notifications: Collection<NotificationDoc>
}

let indexesPromise: Promise<void> | undefined

async function ensureIndexes(c: AttendanceCollections): Promise<void> {
  await Promise.all([
    c.students.createIndex({ status: 1, nameKey: 1 }, { name: 'students_status_name' }),
    c.students.createIndex({ whatsapp: 1 }, { name: 'students_whatsapp' }),
    // Siblings share a parent's number, so the phone alone is not unique.
    c.students.createIndex(
      { nameKey: 1, whatsapp: 1 },
      { name: 'students_name_whatsapp', unique: true },
    ),
    c.packages.createIndex(
      { studentId: 1, number: 1 },
      { name: 'packages_student_number', unique: true },
    ),
    c.packages.createIndex(
      { studentId: 1 },
      { name: 'packages_one_active', unique: true, partialFilterExpression: { status: 'active' } },
    ),
    c.packages.createIndex({ status: 1, completedAt: -1 }, { name: 'packages_status_completed' }),
    c.attendance.createIndex(
      { studentId: 1, classDate: 1 },
      {
        name: 'attendance_student_day',
        unique: true,
        partialFilterExpression: { status: 'attended' },
      },
    ),
    c.attendance.createIndex({ packageId: 1, classDate: 1 }, { name: 'attendance_package_day' }),
    c.notifications.createIndex({ key: 1 }, { name: 'notifications_key', unique: true }),
    c.notifications.createIndex({ status: 1, nextAttemptAt: 1 }, { name: 'notifications_due' }),
    c.notifications.createIndex({ packageId: 1, createdAt: 1 }, { name: 'notifications_package' }),
    c.notifications.createIndex(
      { wamid: 1 },
      { name: 'notifications_wamid', partialFilterExpression: { wamid: { $exists: true } } },
    ),
  ])
}

/** Collections with indexes guaranteed. Memoised per instance; a failure is not. */
export async function attendanceCollections(): Promise<AttendanceCollections> {
  const db = await getAdminDb()
  const c: AttendanceCollections = {
    db,
    students: db.collection<StudentDoc>('students'),
    packages: db.collection<PackageDoc>('class_packages'),
    attendance: db.collection<AttendanceDoc>('attendance'),
    notifications: db.collection<NotificationDoc>('package_notifications'),
  }
  if (!indexesPromise) {
    indexesPromise = ensureIndexes(c)
    indexesPromise.catch(() => {
      indexesPromise = undefined
    })
  }
  await indexesPromise
  return c
}

/**
 * Runs `work` in a multi-document transaction. The driver retries the whole
 * callback on TransientTransactionError (including write conflicts between two
 * admins touching the same package), so `work` must be safe to re-run: read
 * inside it, never before it.
 */
export async function inTransaction<T>(work: (session: ClientSession) => Promise<T>): Promise<T> {
  const client = await getAdminClient()
  const session = client.startSession()
  try {
    let result: T | undefined
    await session.withTransaction(
      async () => {
        result = await work(session)
      },
      { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } },
    )
    return result as T
  } finally {
    await session.endSession()
  }
}

export function isDuplicateKey(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: number }).code === 11000
}
