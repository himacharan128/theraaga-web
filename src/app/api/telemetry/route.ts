import { NextResponse } from 'next/server'
import { z } from 'zod'
import { recordAggregateTelemetry } from '@/data/analytics'
import { externalReferrerHost } from '@/lib/traffic-source'

const eventSchema = z.enum([
  'page_view',
  'section_view',
  'scroll_depth',
  'cta_click',
  'delivery_mode_select',
  'whatsapp_click',
  'form_view',
  'form_start',
  'form_field_error',
  'form_abandon',
  'form_submit_success',
  'thankyou_whatsapp_click',
  'faq_expand',
])

const payloadSchema = z.object({
  event: eventSchema,
  path: z
    .string()
    .max(160)
    .regex(/^\/(?!\/)/, 'A same-site pathname is required.'),
  label: z.string().max(64).optional(),
  device: z.enum(['mobile', 'tablet', 'desktop']),
  referrerHost: z.string().max(100).regex(/^[a-z0-9.-]+$/).optional(),
  utmSource: z.string().max(64).optional(),
  utmMedium: z.string().max(64).optional(),
  utmCampaign: z.string().max(64).optional(),
})

function compactHeader(value: string | null, max: number): string | undefined {
  if (!value) return undefined
  // Vercel URL-encodes city names. Decode carefully, then restrict the small
  // dimension alphabet to stop unbounded arbitrary values entering the store.
  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    // Keep the original value if a malformed encoding reaches the edge.
  }
  const clean = decoded.trim().replace(/[^a-zA-Z0-9 _.-]/g, '').slice(0, max)
  return clean || undefined
}

function referrerHost(referer: string | null): string | undefined {
  if (!referer) return undefined
  try {
    const host = new URL(referer).hostname.toLowerCase().replace(/^www\./, '')
    return host === 'theraaga.in' || host === 'admin.theraaga.in' ? undefined : compactHeader(host, 100)
  } catch {
    return undefined
  }
}

export async function POST(request: Request) {
  // This is not an authentication mechanism. It rejects cross-origin browser
  // traffic and malformed requests, while all stored values remain aggregate
  // and low-sensitivity even if somebody deliberately sends a valid event.
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')?.toLowerCase().split(':')[0]
  const allowedOrigins = new Set(['https://theraaga.in', 'https://www.theraaga.in'])
  const local = host === 'localhost' || host === '127.0.0.1'

  if (origin && !allowedOrigins.has(origin) && !local) {
    return new NextResponse(null, { status: 204 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  const parsed = payloadSchema.safeParse(raw)
  if (!parsed.success || parsed.data.path.startsWith('/admin')) {
    return new NextResponse(null, { status: 204 })
  }

  const value = parsed.data
  try {
    // Awaiting the compact atomic increment means a serverless function cannot
    // be frozen between returning 204 and committing the count.
    await recordAggregateTelemetry({
      event: value.event,
      path: value.path,
      label: value.label,
      device: value.device,
      utmSource: value.utmSource,
      utmMedium: value.utmMedium,
      utmCampaign: value.utmCampaign,
      referrerHost: value.referrerHost
        ? externalReferrerHost(`https://${value.referrerHost}`)
        : referrerHost(request.headers.get('referer')),
      country: compactHeader(request.headers.get('x-vercel-ip-country'), 3),
      region: compactHeader(request.headers.get('x-vercel-ip-country-region'), 32),
      city: compactHeader(request.headers.get('x-vercel-ip-city'), 64),
    })
  } catch (error) {
    // Measurement must never make the marketing site or a visitor action fail.
    console.error('[raaga:telemetry]', error)
  }

  return new NextResponse(null, { status: 204 })
}
