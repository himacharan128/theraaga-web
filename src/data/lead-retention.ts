import 'server-only'

import { getAdminDb } from '@/data/admin-mongo'
import type { StoredLead } from '@/data/leads'

/**
 * The privacy notice promises an enquiry is deleted after twenty-four months.
 * That promise is only kept if Mongo itself expires the document, so this
 * makes sure the TTL index exists and that every lead can be seen by it.
 *
 * It runs on the ADMIN client: the public enquiry user is insert-only and
 * cannot create indexes. Leads stored before the Date fix carry an ISO string,
 * which a TTL index ignores, so they are converted in place first. Both steps
 * are idempotent and cheap once there is nothing left to convert.
 */
const RETRY_AFTER_FAILURE_MS = 5 * 60 * 1000

let retentionPromise: Promise<void> | undefined
let failedAt = 0

async function applyRetention(): Promise<void> {
  const db = await getAdminDb()
  const leads = db.collection<StoredLead>('leads')
  await leads.updateMany({ retentionUntil: { $type: 'string' } }, [
    { $set: { retentionUntil: { $toDate: '$retentionUntil' } } },
  ])
  await leads.createIndex(
    { retentionUntil: 1 },
    { expireAfterSeconds: 0, name: 'leads_retention_ttl' },
  )
}

/**
 * Never throws. A failure here must not take the dashboard down with it — the
 * owner still needs her enquiries — so it is logged loudly and retried after a
 * pause rather than on every request.
 */
export async function ensureLeadRetention(): Promise<void> {
  if (!retentionPromise) {
    if (failedAt && Date.now() - failedAt < RETRY_AFTER_FAILURE_MS) return
    retentionPromise = applyRetention().catch((error: unknown) => {
      retentionPromise = undefined
      failedAt = Date.now()
      console.error('[raaga:leads] Could not enforce the 24-month retention index:', error)
    })
  }
  await retentionPromise
}
