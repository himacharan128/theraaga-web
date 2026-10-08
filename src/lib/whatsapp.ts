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
 * Every link carries a `[ref:…]` code so inbound messages self-identify which
 * section of which page produced them — free attribution with no API.
 */
export function whatsappHref(ref: string, message?: string): string {
  const text = `${message ?? 'Hello RAAGA, I would like to book a trial class.'} [ref:${ref}]`
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}

export function telHref(): string {
  return `tel:+${site.whatsapp}`
}
