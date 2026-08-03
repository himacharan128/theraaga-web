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
 * v1 ships a no-op sink that logs in development. Wiring PostHog Cloud EU behind
 * a Next.js rewrite proxy is a Phase 5 task; this signature does not change.
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

export function track(event: RaagaEventName | 'faq_expand', props: Props = {}) {
  if (typeof window === 'undefined') return

  const payload = { event, ...props, ts: Date.now() }

  // Dev sink. Replaced by posthog-js (proxied, cookieless, identified_only) in Phase 5.
  if (process.env.NODE_ENV !== 'production') {

    console.debug('[raaga:track]', payload)
  }

  const w = window as unknown as { posthog?: { capture: (e: string, p: Props) => void } }
  w.posthog?.capture(event, props)
}

/**
 * WhatsApp passes no referrer, so every forwarded link arrives as direct/unknown.
 * Per-community links carry ?g=<slug>, which is the only reliable attribution
 * the clubhouse channel has.
 */
export function readAttribution(): Props {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') ?? undefined,
    utm_medium: p.get('utm_medium') ?? undefined,
    utm_campaign: p.get('utm_campaign') ?? undefined,
    community: p.get('g') ?? undefined,
    referrer: document.referrer || undefined,
  }
}
