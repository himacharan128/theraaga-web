import 'server-only'

import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { EnquiryInput } from '@/lib/enquiry-schema'

export interface StoredLead extends EnquiryInput {
  id: string
  status: 'new' | 'contacted' | 'trial_booked' | 'enrolled' | 'lost'
  submittedAt: string
  /**
   * DPDP requires erasure once the purpose is served. 24 months is defensible
   * for an enquiry. In Mongo this is a real `Date` because a TTL index only
   * expires BSON dates and silently ignores strings; the index itself is
   * created by `ensureLeadRetention` (the public insert-only user cannot
   * create one). The JSONL dev fallback serialises it to an ISO string.
   */
  retentionUntil: Date
}

const RETENTION_MONTHS = 24

/**
 * The lead write path.
 *
 * Deliberately NOT storing `userAgent`, `sectionsViewed[]` or a scroll trace on
 * this document. Those belong in aggregate analytics, not in a record keyed to
 * a phone number that may relate to a minor.
 *
 * When MONGODB_URI is present this writes to Atlas (Mumbai, ap-south-1). The
 * application's database user is scoped to `insert` ONLY on this collection,
 * with no `find` privilege — so a leaked connection string cannot exfiltrate
 * enquiries. That is the difference between a nuisance and a DPDP exposure.
 *
 * With no MONGODB_URI (local development) it appends to .leads/leads.jsonl,
 * which is gitignored. That keeps `npm run dev` working with zero services.
 */
export async function saveLead(input: EnquiryInput): Promise<StoredLead> {
  const now = new Date()
  const retention = new Date(now)
  retention.setMonth(retention.getMonth() + RETENTION_MONTHS)

  const lead: StoredLead = {
    ...input,
    id: crypto.randomUUID(),
    status: 'new',
    submittedAt: now.toISOString(),
    retentionUntil: retention,
  }

  const uri = process.env.MONGODB_URI
  if (uri) {
    const { getDb } = await import('./mongo')
    const db = await getDb()
    await db.collection<StoredLead>('leads').insertOne(lead)
    return lead
  }

  /**
   * No database configured.
   *
   * The JSONL fallback exists so `npm run dev` works with zero services. It
   * CANNOT work on Vercel: serverless filesystems are read-only outside /tmp,
   * and /tmp does not survive between invocations — so a deployed site without
   * MONGODB_URI would take enquiries and lose them.
   *
   * Fail loudly here rather than let that happen quietly. The Server Action
   * catches this and shows the visitor the WhatsApp fallback, so a
   * misconfigured deploy costs us a lead but never leaves someone believing
   * they have been contacted when they have not.
   */
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[raaga:leads] FATAL: MONGODB_URI is not set. Refusing to accept an enquiry ' +
        'that cannot be persisted. Set MONGODB_URI in the deployment environment.',
    )
    throw new Error('Lead storage is not configured')
  }

  const dir = join(process.cwd(), '.leads')
  await mkdir(dir, { recursive: true })
  await appendFile(join(dir, 'leads.jsonl'), JSON.stringify(lead) + '\n', 'utf8')
  return lead
}

/**
 * Notification fan-out. Fired AFTER the action returns success so the visitor
 * never waits on an email provider.
 *
 * v1 ships a console sink; Resend (free 3,000/month) is a Phase 5 wiring task
 * and this signature does not change.
 */
export async function notifyLead(lead: StoredLead): Promise<void> {
  const summary =
    `New enquiry · ${lead.contactName} · +91${lead.phone} · ` +
    `${lead.learner} · ${lead.mode}` +
    (lead.message ? ` · “${lead.message.slice(0, 60)}”` : '')

  if (!process.env.RESEND_API_KEY) {
    console.info('[raaga:lead]', summary)
    return
  }
  // TODO(Phase 5): Resend — notification to the school + acknowledgement to the lead.
}
