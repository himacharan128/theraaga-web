'use server'

import { headers } from 'next/headers'
import { enquirySchema } from '@/lib/enquiry-schema'
import { notifyLead, saveLead } from '@/data/leads'

export interface EnquiryState {
  ok: boolean
  errors?: Record<string, string>
  message?: string
  leadId?: string
}

/**
 * Bot trap threshold.
 *
 * Deliberately low. An earlier 3s value silently swallowed genuine fast
 * submissions — a motivated parent who taps four chips can clear the form in
 * well under three seconds, and because a tripped trap answers "success"
 * without storing anything, the failure is completely invisible from both
 * sides. A dead submit button that reports success is far worse than letting a
 * few bots through, and the honeypot plus rate limiter already cover those.
 */
const MIN_FILL_MS = 1200

/**
 * In-memory sliding window. Adequate for a site expecting tens of leads a
 * month, and it costs nothing.
 *
 * TODO(Phase 5): swap for @upstash/ratelimit, keyed on `x-vercel-forwarded-for`
 * — NOT `x-forwarded-for`, which Vercel deliberately overwrites. Note also that
 * Vercel WAF rate-limit counters are tracked per-region, so a global limit can
 * legitimately be exceeded.
 */
const WINDOW_MS = 10 * 60 * 1000

/**
 * The IP limit is deliberately loose and the phone limit deliberately tight.
 *
 * Indian mobile carriers run carrier-grade NAT at scale, so a large number of
 * genuinely unrelated visitors — exactly our audience, on phones, on mobile
 * data — can share one public IP. A tight per-IP limit would silently lock out
 * real families in the same apartment complex on the same network, which is
 * the worst possible failure for this site. The phone number is the meaningful
 * identity here, so that is where the strict limit belongs.
 */
const MAX_PER_IP = 30
const MAX_PER_PHONE = 3
const hits = new Map<string, number[]>()

function rateLimited(key: string, max: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > max
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const h = await headers()
  const ip =
    h.get('x-vercel-forwarded-for') ??
    h.get('x-real-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'local'

  const raw = Object.fromEntries(formData) as Record<string, unknown>

  // 1 · Honeypot. An off-screen field no human ever sees.
  // 2 · Time trap.
  //
  // Both answer exactly as a success does — including a leadId, so the client
  // redirects to /thank-you like anyone else. A bot learns nothing about why it
  // failed, and a false positive costs a real person nothing worse than a
  // follow-up on WhatsApp. Nothing is stored and nothing is notified.
  const renderedAt = Number(raw.renderedAt ?? 0)
  const trapped =
    (typeof raw.websiteUrl === 'string' && raw.websiteUrl.length > 0) ||
    (renderedAt > 0 && Date.now() - renderedAt < MIN_FILL_MS)

  if (trapped) {
    return { ok: true, leadId: 'suppressed' }
  }

  // 3 · Rate limit, per IP (loose) and per phone (tight).
  const phoneKey = String(raw.phone ?? '').replace(/\D/g, '')
  if (
    rateLimited(`ip:${ip}`, MAX_PER_IP) ||
    (phoneKey && rateLimited(`ph:${phoneKey}`, MAX_PER_PHONE))
  ) {
    return {
      ok: false,
      message:
        'We have already received your message. We will call you shortly. If it is urgent, message us on WhatsApp.',
    }
  }

  // 4 · The only parse that is trusted. Same schema the client used.
  const parsed = enquirySchema.safeParse({
    ...raw,
    guardianConsent: raw.guardianConsent === 'on' || raw.guardianConsent === 'true',
  })

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errors[key]) errors[key] = issue.message
    }
    return { ok: false, errors, message: 'Please check the highlighted fields.' }
  }

  try {
    const lead = await saveLead(parsed.data)
    // Fire-and-forget so the visitor never waits on an email provider.
    void notifyLead(lead).catch((e) => console.error('[raaga:notify]', e))
    return { ok: true, leadId: lead.id }
  } catch (err) {
    console.error('[raaga:enquiry]', err)
    return {
      ok: false,
      message:
        'Something went wrong on our side. Please message us on WhatsApp instead. We will see it straight away.',
    }
  }
}
