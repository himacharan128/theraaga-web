/**
 * Point-to-point analytics — a deliberately SMALL taxonomy.
 *
 * The research proposed ~35 events including per-field form telemetry. That was
 * cut to 12: on a four-field form at tens of sessions a week, `time_in_field_ms`
 * is data nobody will ever act on, and it was the sole justification for putting
 * a form library on the LCP path.
 *
 * Also cut: session replay entirely. It records a visitor scrolling a page about
 * children's classes BEFORE the age band is known, and it answers no question
 * the event list below does not.
 *
 * Standing policy, permanent: ZERO advertising pixels on this domain. No Meta
 * Pixel, no Google Ads remarketing, ever. DPDP s.9(3) bans behavioural
 * advertising directed at children even with parental consent, and the
 * educational-institution carve-out covers enrolled students, not a public
 * marketing page.
 *
 * The site now publishes only anonymous, first-party aggregate events to its
 * own endpoint. There are no cookies, visitor IDs, IP addresses, replay tools,
 * or third-party analytics scripts. The receiver reduces each event to a
 * daily count before it is stored; see /api/telemetry.
 */

export type RaagaEventName =
  | 'page_view'
  | 'section_view'
  | 'scroll_depth'
  | 'cta_click'
  | 'delivery_mode_select'
  | 'whatsapp_click'
  | 'form_view'
  | 'form_start'
  | 'form_field_error'
  | 'form_abandon'
  | 'form_submit_success'
  | 'thankyou_whatsapp_click'
  | 'faq_expand'

type Props = Record<string, string | number | boolean | undefined>

export type RaagaTelemetryDetail = {
  event: RaagaEventName
  props: Props
}

declare global {
  interface WindowEventMap {
    'raaga:telemetry': CustomEvent<RaagaTelemetryDetail>
  }

  interface Window {
    __raagaTelemetryQueue?: RaagaTelemetryDetail[]
    __raagaTelemetryReady?: boolean
  }
}

export function track(event: RaagaEventName, props: Props = {}) {
  if (typeof window === 'undefined') return

  const payload = { event, ...props, ts: Date.now() }

  // Local visibility without sending development traffic to a production store.
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[raaga:track]', payload)
  }

  const detail = { event, props }
  // Child component effects can run before the root transport effect has
  // attached its listener. Keep a tiny in-memory queue for that first paint;
  // it is discarded on tab close and is never a cookie or identifier.
  if (!window.__raagaTelemetryReady) {
    window.__raagaTelemetryQueue = [...(window.__raagaTelemetryQueue ?? []), detail]
    return
  }

  window.dispatchEvent(new CustomEvent('raaga:telemetry', { detail }))
}

/**
 * WhatsApp passes no referrer, so every forwarded link arrives as direct/unknown.
 * WhatsApp-forwarded traffic has.
 */
export function readAttribution(): Props {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') ?? undefined,
    utm_medium: p.get('utm_medium') ?? undefined,
    utm_campaign: p.get('utm_campaign') ?? undefined,
  }
}
