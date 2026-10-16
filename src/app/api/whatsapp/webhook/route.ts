import { createHash, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { applyStatusEvents } from '@/data/notifications'
import { parseStatusWebhook, verifyWebhookSignature } from '@/lib/whatsapp-cloud'


const MAX_BODY_BYTES = 1_000_000

function sameSecret(given: string | null, expected: string): boolean {
  if (!given) return false
  const a = createHash('sha256').update(given).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

/** Meta's one-off check when the webhook URL is saved in the app dashboard. */
export async function GET(request: Request) {
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN?.trim()
  const params = new URL(request.url).searchParams
  const challenge = params.get('hub.challenge')
  if (!expected || params.get('hub.mode') !== 'subscribe' || !challenge || !sameSecret(params.get('hub.verify_token'), expected)) {
    return new NextResponse(null, { status: 403 })
  }
  return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

/** Delivery receipts. Signed by Meta with the app secret; nothing is trusted before that check. */
export async function POST(request: Request) {
  const secret = process.env.WHATSAPP_APP_SECRET?.trim()
  if (!secret) return new NextResponse(null, { status: 503 })

  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > MAX_BODY_BYTES) return new NextResponse(null, { status: 413 })
  const raw = await request.text()
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return new NextResponse(null, { status: 413 })

  if (!verifyWebhookSignature(raw, request.headers.get('x-hub-signature-256'), secret)) {
    return new NextResponse(null, { status: 401 })
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  // A database failure surfaces as 500 so Meta retries the delivery.
  const applied = await applyStatusEvents(parseStatusWebhook(json))
  return NextResponse.json({ ok: true, applied })
}
