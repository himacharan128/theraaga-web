'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { RaagaTelemetryDetail } from '@/lib/analytics'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const

type Device = 'mobile' | 'tablet' | 'desktop'

function deviceBucket(): Device {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1120) return 'tablet'
  return 'desktop'
}

function compact(value: string | null, max = 64): string | undefined {
  if (!value) return undefined
  const clean = value.trim().replace(/[^a-zA-Z0-9 _./:-]/g, '').slice(0, max)
  return clean || undefined
}

function eventLabel(event: RaagaTelemetryDetail['event'], props: RaagaTelemetryDetail['props']) {
  const raw =
    event === 'section_view'
      ? props.section
      : event === 'cta_click' || event === 'whatsapp_click'
        ? props.cta_location
        : event === 'delivery_mode_select'
          ? props.mode
          : event === 'faq_expand'
            ? props.question
            : undefined

  return typeof raw === 'string' ? compact(raw) : undefined
}

/**
 * Privacy-preserving measurement transport.
 *
 * Each request is deliberately self-contained: no cookie, localStorage value,
 * device fingerprint, client identifier, raw IP address, full referrer, or
 * query string is ever sent. The server turns it into a daily aggregate.
 */
function publish(detail: RaagaTelemetryDetail, pathname: string) {
  if (pathname.startsWith('/admin')) return

  const query = new URLSearchParams(window.location.search)
  const body = JSON.stringify({
    event: detail.event,
    path: pathname,
    label: eventLabel(detail.event, detail.props),
    device: deviceBucket(),
    utmSource: compact(query.get(UTM_KEYS[0])),
    utmMedium: compact(query.get(UTM_KEYS[1])),
    utmCampaign: compact(query.get(UTM_KEYS[2])),
  })

  // sendBeacon preserves a click/navigation event without delaying it. Its
  // body is opaque to the page, and the endpoint is POST-only.
  if (navigator.sendBeacon?.('/api/telemetry', body)) return

  void fetch('/api/telemetry', {
    method: 'POST',
    body,
    headers: { 'content-type': 'text/plain;charset=UTF-8' },
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => undefined)
}

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    const onTelemetry = (event: WindowEventMap['raaga:telemetry']) => {
      publish(event.detail, pathname)
    }

    window.addEventListener('raaga:telemetry', onTelemetry)
    window.__raagaTelemetryReady = true
    for (const event of window.__raagaTelemetryQueue ?? []) {
      publish(event, pathname)
    }
    window.__raagaTelemetryQueue = []
    publish({ event: 'page_view', props: {} }, pathname)
    return () => {
      window.__raagaTelemetryReady = false
      window.removeEventListener('raaga:telemetry', onTelemetry)
    }
  }, [pathname])

  return null
}
