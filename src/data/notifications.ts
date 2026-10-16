import 'server-only'

import { randomUUID } from 'node:crypto'
import { attendanceCollections, type NotificationDoc } from '@/data/attendance-db'
import { renderCalendarPng } from '@/lib/calendar-image'
import {
  AUTO_SEND_WINDOW_MS,
  ID_PATTERN,
  RETRY_DELAYS_MS,
  SEND_LEASE_MS,
  type NotificationStatus,
} from '@/lib/attendance-rules'
import {
  completionMessageParams,
  sendTemplate,
  uploadMedia,
  whatsAppReadiness,
  type SendError,
  type WebhookStatusEvent,
} from '@/lib/whatsapp-cloud'

/**
 * Sends the package-completion calendars and tracks what WhatsApp says about
 * them. The rules that keep a parent from receiving the message twice:
 *
 *  · A row is CLAIMED (pending -> sending) by one conditional update, so two
 *    workers never send the same row.
 *  · If the send request fails in a way that may still have reached WhatsApp
 *    (timeout, 5xx) the row becomes `uncertain` and is NEVER sent again by
 *    code. A person checks WhatsApp and decides.
 *  · A worker that died mid-send leaves a `sending` row whose lease expires.
 *    That is also `uncertain`, for the same reason.
 *  · Every status write is conditional on the status the worker last saw, so
 *    a late webhook or a second worker is never overwritten.
 */

const INTERRUPTED_NOTE = 'The previous send was interrupted; check WhatsApp before resending'
const STALE_NOTE = 'Not sent within 72 hours; send manually if still wanted'

export type DueResult = { id: string; status: NotificationStatus }

type Finish = { status: NotificationStatus; set?: Partial<NotificationDoc>; unset?: (keyof NotificationDoc)[] }

async function finish(id: string, change: Finish, now: Date): Promise<boolean> {
  const { notifications } = await attendanceCollections()
  const set = { ...change.set, status: change.status, updatedAt: now }
  const unset: Record<string, ''> = { leaseUntil: '' }
  for (const key of ['nextAttemptAt', 'statusNote', ...(change.unset ?? [])]) {
    if (!(key in set)) unset[key] = ''
  }
  const result = await notifications.updateOne({ _id: id, status: 'sending' }, { $set: set, $unset: unset })
  return result.matchedCount === 1
}

function errorField(error: SendError, now: Date): NotificationDoc['lastError'] {
  return { ...(error.code === undefined ? {} : { code: error.code }), title: error.title, at: now }
}

/** Retry later, or give up when the schedule or the 72 hour window is spent. */
function retryOrFail(row: NotificationDoc, error: SendError, now: Date): Finish {
  const delay = RETRY_DELAYS_MS[row.attempts - 1]
  const expired = !row.manualBy && now.getTime() - row.createdAt.getTime() > AUTO_SEND_WINDOW_MS
  if (delay === undefined || expired) {
    return {
      status: 'failed',
      set: { statusNote: `Could not be sent: ${error.title}`, lastError: errorField(error, now) },
    }
  }
  return {
    status: 'pending',
    set: {
      nextAttemptAt: new Date(now.getTime() + delay),
      statusNote: `Will try again: ${error.title}`,
      lastError: errorField(error, now),
    },
  }
}

function failFor(error: SendError, now: Date, row: NotificationDoc): Finish {
  switch (error.kind) {
    case 'retryable':
      return retryOrFail(row, error, now)
    case 'ambiguous':
      return {
        status: 'uncertain',
        set: {
          statusNote: 'WhatsApp did not confirm; check WhatsApp before resending',
          lastError: errorField(error, now),
        },
      }
    case 'config':
      return {
        status: 'failed',
        set: { statusNote: `WhatsApp setup problem: ${error.title}`, lastError: errorField(error, now) },
      }
    default:
      return {
        status: 'failed',
        set: { statusNote: `WhatsApp refused this message: ${error.title}`, lastError: errorField(error, now) },
      }
  }
}

async function sendRow(row: NotificationDoc, now: Date): Promise<Finish> {
  const { students, packages } = await attendanceCollections()
  const [student, pkg] = await Promise.all([
    students.findOne({ _id: row.studentId }),
    packages.findOne({ _id: row.packageId }),
  ])
  if (!student || !pkg) {
    return { status: 'failed', set: { statusNote: 'The student record no longer exists' } }
  }
  if (!row.to) return { status: 'failed', set: { statusNote: 'No recipient number on this message' } }
  // A row can wait days on backoff. Re-check the adult's choices at send time.
  if (row.recipient === 'student' && !student.whatsappConsent) {
    return { status: 'skipped', set: { statusNote: 'WhatsApp consent was withdrawn before sending' } }
  }
  if (row.recipient === 'student' && student.whatsapp !== row.to) {
    return { status: 'held', set: { statusNote: 'The number changed after this was queued; check it and send manually' } }
  }

  const completion =
    pkg.completion?.seq === row.completionSeq
      ? pkg.completion
      : pkg.completionHistory.find((entry) => entry.seq === row.completionSeq)

  let png: Uint8Array
  try {
    png = await renderCalendarPng({
      studentName: student.name,
      packageNumber: pkg.number,
      target: pkg.target,
      dates: row.dates,
      // The last class on this calendar, matching the dashboard preview.
      ...(completion && row.dates.length ? { completedOn: row.dates[row.dates.length - 1] } : {}),
    })
  } catch {
    return retryOrFail(row, { kind: 'retryable', title: 'The calendar image could not be made' }, now)
  }

  const media = await uploadMedia(png)
  if (!media.ok) return failFor(media.error, now, row)

  const sent = await sendTemplate({
    to: row.to,
    mediaId: media.mediaId,
    bodyParams: completionMessageParams(student.name, pkg.number, row.dates),
    callbackData: `${row._id}:${row.sendToken ?? ''}`,
  })
  if (!sent.ok) return failFor(sent.error, now, row)
  return { status: 'accepted', set: { wamid: sent.wamid, sentAt: now } }
}

export async function processDueNotifications(
  opts: { packageId?: string; limit?: number; now?: Date } = {},
): Promise<{ processed: number; results: DueResult[] }> {
  const now = opts.now ?? new Date()
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200)
  const { notifications } = await attendanceCollections()
  const scope = opts.packageId ? { packageId: opts.packageId } : {}
  const results: DueResult[] = []

  // A worker that died mid-send: the message may or may not have gone out.
  const abandoned = await notifications
    .find({ ...scope, status: 'sending', leaseUntil: { $lt: now } }, { projection: { _id: 1 } })
    .limit(limit)
    .toArray()
  for (const { _id } of abandoned) {
    const result = await notifications.updateOne(
      { _id, status: 'sending', leaseUntil: { $lt: now } },
      { $set: { status: 'uncertain', statusNote: INTERRUPTED_NOTE, updatedAt: now }, $unset: { leaseUntil: '' } },
    )
    if (result.matchedCount === 1) results.push({ id: _id, status: 'uncertain' })
  }

  const due = await notifications
    .find({ ...scope, status: 'pending', nextAttemptAt: { $lte: now } }, { projection: { _id: 1 } })
    .sort({ nextAttemptAt: 1 })
    .limit(limit)
    .toArray()

  for (const { _id } of due) {
    // The lease runs from THIS claim, not from the start of the batch: each
    // row can take ~30 s, so a batch-start lease would already have expired
    // for later rows and an overlapping worker would mark them interrupted.
    const claimedAt = Math.max(now.getTime(), Date.now())
    const row = await notifications.findOneAndUpdate(
      { _id, status: 'pending', nextAttemptAt: { $lte: now } },
      {
        $set: {
          status: 'sending',
          leaseUntil: new Date(claimedAt + SEND_LEASE_MS),
          sendToken: randomUUID(),
          updatedAt: now,
        },
        $inc: { attempts: 1 },
      },
      { returnDocument: 'after' },
    )
    if (!row) continue // another worker claimed it

    let change: Finish
    if (!row.manualBy && now.getTime() - row.createdAt.getTime() > AUTO_SEND_WINDOW_MS) {
      change = { status: 'failed', set: { statusNote: STALE_NOTE } }
    } else {
      try {
        change = await sendRow(row, now)
      } catch {
        // Unknown failure after a claim: if it was in the send itself we cannot tell.
        change = {
          status: 'uncertain',
          set: { statusNote: INTERRUPTED_NOTE, lastError: { title: 'Unexpected error while sending', at: now } },
        }
      }
    }
    if (await finish(_id, change, now)) results.push({ id: _id, status: change.status })
  }

  return { processed: results.length, results }
}

type RetryError = 'not_found' | 'not_retryable' | 'confirm_required' | 'not_configured'

export async function retryNotification(
  id: string,
  by: string,
  opts: { confirmUncertain?: boolean } = {},
): Promise<{ ok: true } | { ok: false; error: RetryError; message: string }> {
  const fail = (error: RetryError, message: string) => ({ ok: false as const, error, message })
  if (!ID_PATTERN.test(id)) return fail('not_found', 'That message was not found.')
  const { notifications, students } = await attendanceCollections()
  const row = await notifications.findOne({ _id: id })
  if (!row) return fail('not_found', 'That message was not found.')
  if (!['held', 'failed', 'uncertain', 'skipped'].includes(row.status)) {
    return fail('not_retryable', 'This message is already on its way or finished.')
  }
  if (row.status === 'uncertain' && !opts.confirmUncertain) {
    return fail('confirm_required', 'Check WhatsApp first. Only send again if it was not received.')
  }
  const readiness = whatsAppReadiness()
  if (!readiness.configured) return fail('not_configured', 'WhatsApp is not connected yet.')

  let to: string
  if (row.recipient === 'school') {
    if (!readiness.schoolRecipient) return fail('not_configured', 'The school number is not set.')
    to = readiness.schoolRecipient
  } else {
    const student = await students.findOne({ _id: row.studentId })
    if (!student) return fail('not_retryable', 'The student record no longer exists.')
    if (!student.whatsappConsent) return fail('not_retryable', 'No WhatsApp consent is recorded for this student.')
    to = student.whatsapp
  }

  const now = new Date()
  const result = await notifications.updateOne(
    { _id: id, status: row.status },
    {
      $set: { status: 'pending', nextAttemptAt: now, manualBy: by, to, attempts: 0, updatedAt: now },
      $unset: { statusNote: '', leaseUntil: '', wamid: '' },
    },
  )
  if (result.matchedCount !== 1) return fail('not_retryable', 'This message changed just now. Refresh and try again.')
  return { ok: true }
}

const RANK: Partial<Record<string, number>> = { accepted: 1, sent: 2, delivered: 3, read: 4 }
const MAX_EVENTS = 20

/** Applies WhatsApp delivery receipts. Returns how many receipts were recorded. */
export async function applyStatusEvents(events: WebhookStatusEvent[]): Promise<number> {
  if (!events.length) return 0
  const { notifications } = await attendanceCollections()
  let applied = 0
  for (const event of [...events].sort((a, b) => a.at.getTime() - b.at.getTime())) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      let row = await notifications.findOne({ wamid: event.wamid })
      // `<row id>:<send token>`: a late receipt for an earlier attempt of a
      // manually retried row must not attach itself to the new attempt.
      const [callbackId, callbackToken] = (event.callbackData ?? '').split(':')
      if (!row && callbackToken && ID_PATTERN.test(callbackId)) {
        const candidate = await notifications.findOne({ _id: callbackId, sendToken: callbackToken })
        if (candidate && !candidate.wamid && (candidate.status === 'sending' || candidate.status === 'uncertain')) {
          row = candidate
        }
      }
      if (!row) break
      const at = event.at.getTime()
      if (row.events.some((e) => e.status === event.status && e.at.getTime() === at)) break

      const current = RANK[row.status] ?? 0
      let next: NotificationStatus | undefined
      const set: Partial<NotificationDoc> = { updatedAt: new Date() }
      if (event.status === 'failed') {
        if (current < 3 && row.status !== 'failed') {
          next = 'failed'
          set.lastError = {
            ...(event.errorCode === undefined ? {} : { code: event.errorCode }),
            title: event.errorTitle ?? 'WhatsApp could not deliver this message',
            at: event.at,
          }
          set.statusNote = 'WhatsApp could not deliver this message'
        }
      } else {
        const rank = RANK[event.status] ?? 0
        // Out-of-order receipts never move a row back; a late "sent" never revives a failure.
        const revives = row.status === 'failed' ? rank >= 3 : true
        if (rank > current && revives) next = event.status as NotificationStatus
      }
      if (next) set.status = next
      if (!row.wamid) set.wamid = event.wamid
      if (!row.sentAt && event.status !== 'failed') set.sentAt = event.at

      const update: Record<string, unknown> = {
        $set: set,
        $push: {
          events: {
            $each: [
              {
                status: event.status,
                at: event.at,
                receivedAt: new Date(),
                ...(event.errorCode === undefined ? {} : { errorCode: event.errorCode }),
                ...(event.errorTitle === undefined ? {} : { errorTitle: event.errorTitle }),
              },
            ],
            $slice: -MAX_EVENTS,
          },
        },
      }
      const unset: Record<string, ''> = {}
      if (next && next !== 'failed') {
        unset.leaseUntil = ''
        unset.nextAttemptAt = ''
        if (row.statusNote) unset.statusNote = ''
      }
      if (Object.keys(unset).length) update.$unset = unset
      const result = await notifications.updateOne({ _id: row._id, status: row.status, events: { $size: row.events.length } }, update)
      if (result.matchedCount === 1) {
        applied += 1
        break
      }
      // Changed under us (another receipt): reload and decide again.
    }
  }
  return applied
}
