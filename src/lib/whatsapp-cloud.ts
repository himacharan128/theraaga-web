import { createHmac, timingSafeEqual } from 'node:crypto'
import { normaliseWhatsApp } from '@/lib/attendance-rules'

/**
 * WhatsApp Business Platform (Cloud API) client for package-completion
 * messages. Server code only: it reads the access token from the
 * environment, so it must never be imported by a client component.
 *
 * The access token is only ever placed in the Authorization header. It is
 * never logged and never copied into an error title.
 */

export const DEFAULT_TEMPLATE_NAME = 'raaga_package_complete'
export const DEFAULT_TEMPLATE_LANGUAGE = 'en'
export const DEFAULT_GRAPH_VERSION = 'v25.0'
const REQUEST_TIMEOUT_MS = 15_000

export type SendError = {
  kind: 'retryable' | 'permanent' | 'ambiguous' | 'config'
  code?: number
  title: string
}

export type WebhookStatusEvent = {
  wamid: string
  status: string
  at: Date
  recipientId?: string
  callbackData?: string
  errorCode?: number
  errorTitle?: string
}

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

/** What is configured, without revealing any value. */
export function whatsAppReadiness(): { configured: boolean; schoolRecipient: string | null; missing: string[] } {
  const missing: string[] = ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'].filter((name) => !env(name))
  const configured = missing.length === 0
  const school = env('WHATSAPP_SCHOOL_RECIPIENT')
  const schoolRecipient = school ? normaliseWhatsApp(school) : null
  if (!schoolRecipient) missing.push('WHATSAPP_SCHOOL_RECIPIENT')
  return { configured, schoolRecipient, missing }
}

function endpoint(path: 'media' | 'messages'): string | null {
  const phoneNumberId = env('WHATSAPP_PHONE_NUMBER_ID')
  if (!phoneNumberId || !/^\d{5,25}$/.test(phoneNumberId)) return null
  return `https://graph.facebook.com/${env('WHATSAPP_GRAPH_VERSION') ?? DEFAULT_GRAPH_VERSION}/${phoneNumberId}/${path}`
}

const RATE_LIMIT_CODES = new Set([2, 4, 80007, 130429, 131056, 131000])
const CONFIG_CODES = new Set([190, 132001, 132000, 132012, 133010, 100, 10, 200])

function truncate(text: string): string {
  return text.length > 200 ? `${text.slice(0, 197)}...` : text
}

/** Never lets the token into a title, whatever a server echoes back. */
function scrub(text: string): string {
  const token = env('WHATSAPP_ACCESS_TOKEN')
  return token ? text.split(token).join('[redacted]') : text
}

async function classify(response: Response, stage: 'media' | 'messages'): Promise<SendError> {
  let code: number | undefined
  let title = `WhatsApp returned HTTP ${response.status}`
  try {
    const body = (await response.json()) as { error?: { code?: unknown; message?: unknown; error_user_title?: unknown } }
    if (typeof body.error?.code === 'number') code = body.error.code
    const text = body.error?.error_user_title || body.error?.message
    if (typeof text === 'string' && text.trim()) title = text.trim()
  } catch {
    // Not JSON: keep the generic title.
  }
  title = truncate(scrub(title))
  // Checked first: after a 5xx on /messages the message may have gone out,
  // so no error code may turn it into an automatic resend.
  if (stage === 'messages' && response.status >= 500) return { kind: 'ambiguous', code, title }
  if (code !== undefined && CONFIG_CODES.has(code)) return { kind: 'config', code, title }
  if (code !== undefined && RATE_LIMIT_CODES.has(code)) return { kind: 'retryable', code, title }
  if (response.status >= 500) return { kind: stage === 'messages' ? 'ambiguous' : 'retryable', code, title }
  if (response.status === 401) return { kind: 'config', code, title }
  if (response.status === 429) return { kind: 'retryable', code, title }
  return { kind: 'permanent', code, title }
}

function networkError(stage: 'media' | 'messages', error: unknown): SendError {
  const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')
  const title = timedOut ? 'WhatsApp did not answer in time' : 'Could not reach WhatsApp'
  return { kind: stage === 'messages' ? 'ambiguous' : 'retryable', title }
}

function notConfigured(): SendError {
  return { kind: 'config', title: 'WhatsApp is not configured' }
}

export async function uploadMedia(
  png: Uint8Array,
): Promise<{ ok: true; mediaId: string } | { ok: false; error: SendError }> {
  const url = endpoint('media')
  const token = env('WHATSAPP_ACCESS_TOKEN')
  if (!url || !token) return { ok: false, error: notConfigured() }
  const form = new FormData()
  form.set('messaging_product', 'whatsapp')
  form.set('type', 'image/png')
  form.set('file', new Blob([png as BlobPart], { type: 'image/png' }), 'calendar.png')
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) return { ok: false, error: await classify(response, 'media') }
    const body = (await response.json().catch(() => null)) as { id?: unknown } | null
    if (typeof body?.id !== 'string' || !body.id) {
      return { ok: false, error: { kind: 'retryable', title: 'WhatsApp did not return a media id' } }
    }
    return { ok: true, mediaId: body.id }
  } catch (error) {
    return { ok: false, error: networkError('media', error) }
  }
}

export async function sendTemplate(args: {
  to: string
  mediaId: string
  bodyParams: string[]
  callbackData: string
}): Promise<{ ok: true; wamid: string } | { ok: false; error: SendError }> {
  const url = endpoint('messages')
  const token = env('WHATSAPP_ACCESS_TOKEN')
  if (!url || !token) return { ok: false, error: notConfigured() }
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: args.to,
    type: 'template',
    biz_opaque_callback_data: args.callbackData,
    template: {
      name: env('WHATSAPP_TEMPLATE_NAME') ?? DEFAULT_TEMPLATE_NAME,
      language: { code: env('WHATSAPP_TEMPLATE_LANGUAGE') ?? DEFAULT_TEMPLATE_LANGUAGE },
      components: [
        { type: 'header', parameters: [{ type: 'image', image: { id: args.mediaId } }] },
        { type: 'body', parameters: args.bodyParams.map((text) => ({ type: 'text', text })) },
      ],
    },
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) return { ok: false, error: await classify(response, 'messages') }
    const body = (await response.json().catch(() => null)) as { messages?: { id?: unknown }[] } | null
    const wamid = body?.messages?.[0]?.id
    // A 2xx without an id still means WhatsApp may have accepted it.
    if (typeof wamid !== 'string' || !wamid) {
      return { ok: false, error: { kind: 'ambiguous', title: 'WhatsApp did not return a message id' } }
    }
    return { ok: true, wamid }
  } catch (error) {
    return { ok: false, error: networkError('messages', error) }
  }
}

/** Meta signs the raw body: `X-Hub-Signature-256: sha256=<hex hmac>` with the app secret. */
export function verifyWebhookSignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!header || !appSecret) return false
  const match = /^sha256=([0-9a-f]{64})$/i.exec(header.trim())
  if (!match) return false
  const expected = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest()
  const given = Buffer.from(match[1], 'hex')
  return given.length === expected.length && timingSafeEqual(given, expected)
}

const FORWARD_STATUSES = new Set(['sent', 'delivered', 'read', 'failed'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseStatusWebhook(json: unknown): WebhookStatusEvent[] {
  const events: WebhookStatusEvent[] = []
  if (!isRecord(json) || !Array.isArray(json.entry)) return events
  for (const entry of json.entry) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) continue
    for (const change of entry.changes) {
      if (!isRecord(change) || change.field !== 'messages' || !isRecord(change.value)) continue
      const statuses = change.value.statuses
      if (!Array.isArray(statuses)) continue
      for (const item of statuses) {
        if (!isRecord(item)) continue
        const { id, status, timestamp } = item
        if (typeof id !== 'string' || !id || typeof status !== 'string' || !FORWARD_STATUSES.has(status)) continue
        const seconds = Number(timestamp)
        if (!Number.isFinite(seconds) || seconds <= 0) continue
        const event: WebhookStatusEvent = { wamid: id, status, at: new Date(seconds * 1000) }
        if (Number.isNaN(event.at.getTime())) continue
        if (typeof item.recipient_id === 'string') event.recipientId = item.recipient_id
        if (typeof item.biz_opaque_callback_data === 'string') event.callbackData = item.biz_opaque_callback_data
        const first = Array.isArray(item.errors) && isRecord(item.errors[0]) ? item.errors[0] : undefined
        if (first) {
          if (typeof first.code === 'number') event.errorCode = first.code
          const title = first.error_data && isRecord(first.error_data) ? first.error_data.details : undefined
          const text = first.title ?? title ?? first.message
          if (typeof text === 'string') event.errorTitle = truncate(text)
        }
        events.push(event)
      }
    }
  }
  return events
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function longDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

/** Template body {{1}} student, {{2}} first class date, {{3}} last class date. */
export function completionMessageParams(name: string, number: number, dates: string[]): string[] {
  void number
  const sorted = [...dates].sort()
  const first = sorted[0] ? longDate(sorted[0]) : ''
  const last = sorted.length ? longDate(sorted[sorted.length - 1]) : ''
  return [name.replace(/\s+/g, ' ').trim(), first, last]
}
