import { site } from '@/content/seed/site'

/**
 * WhatsApp is a co-primary conversion path, not a convenience.
 *
 * In Hyderabad this is how the category actually converts: Sangeet Music
 * Academy's "Enroll Now" button literally IS a wa.me link, and Philips School
 * of Music repeats "Call / WhatsApp" four times as its only path. It also
 * captures the impatient forwarded parent who will never fill a form,
 * self-verifies the phone number, and opens Meta's free 24-hour service window
 * at zero API cost.
 *
 * The message is exactly what the parent sends, with no code in it. Links
 * used to append a `[ref:…]` marker for attribution, but it showed up in
 * every WhatsApp chat. Attribution now lives on our side: every WhatsApp
 * control renders through `components/ui/WhatsAppLink`, which records a
 * `whatsapp_click` event labelled with the button tapped (`cta_location`)
 * before WhatsApp opens, and the admin dashboard counts them per button.
 */
export function whatsappHref(message?: string): string {
  const text = message ?? 'Hello RAAGA, I would like to book a trial class.'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}

export function telHref(): string {
  return `tel:+${site.whatsapp}`
}
