import 'server-only'

import * as seed from '@/content/seed'
import type {
  Batch,
  Community,
  Discipline,
  Faculty,
  Faq,
  GalleryItem,
  Level,
  Pillar,
  RaagaEvent,
  SiteSettings,
  Testimonial,
} from '@/content/types'

/**
 * The data access layer.
 *
 * Everything the site reads goes through here. `app/` and `components/` must
 * contain ZERO database imports — that is the Next.js docs' security
 * recommendation, and it is also the single thing that makes the eventual
 * migration to the Go/Echo API a find-and-replace rather than a rewrite.
 *
 * v1 reads from `content/seed`. v1.1 points Payload 3 at the same collection
 * shapes on the same MongoDB and only the bodies of these functions change.
 */

export async function getSite(): Promise<SiteSettings> {
  return seed.site
}

export async function getDeliveryModes() {
  return seed.deliveryModes
}

export async function getLevels(): Promise<Level[]> {
  return [...seed.levels].sort((a, b) => a.order - b.order)
}

export async function getDisciplines(): Promise<Discipline[]> {
  return [...seed.disciplines].sort((a, b) => a.order - b.order)
}

export async function getActiveDisciplines(): Promise<Discipline[]> {
  return (await getDisciplines()).filter((d) => d.status === 'active')
}

export async function getPlannedDisciplines(): Promise<Discipline[]> {
  return (await getDisciplines()).filter((d) => d.status === 'planned')
}

export async function getPillars(): Promise<Pillar[]> {
  return [...seed.pillars].sort((a, b) => a.order - b.order)
}

export async function getFaqs(): Promise<Faq[]> {
  return [...seed.faqs].sort((a, b) => a.order - b.order)
}

export async function getFaculty(): Promise<Faculty[]> {
  return seed.faculty
}

export async function getBatches(): Promise<Batch[]> {
  return seed.batches
}

/**
 * CONSENT IS A QUERY-LEVEL GATE, NOT A UI CONDITION.
 *
 * Under the DPDP Act a child is anyone under 18, and children's-data failures
 * reach ₹200 crore. Anything depicting a minor without recorded guardian
 * consent must never leave the data layer — so it is filtered here, where no
 * component can accidentally bypass it.
 *
 * In v1.1 this becomes a Mongo query predicate backed by the index
 * { 'consent.hasMinors': 1, 'consent.guardianConsentObtained': 1 }.
 */
function consentGate<T extends { consent: { hasMinors: boolean; guardianConsentObtained: boolean } }>(
  rows: T[],
): T[] {
  return rows.filter(
    (r) => !r.consent.hasMinors || r.consent.guardianConsentObtained === true,
  )
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return consentGate(seed.testimonials)
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return consentGate(seed.galleryItems)
}

/**
 * Splitting events by "now" is a clock read, which `cacheComponents` will not
 * allow during prerender unless the result is explicitly cached. `use cache`
 * makes the intent honest: the upcoming/past split is recomputed on the cache's
 * schedule rather than on every request, which is exactly right for a term
 * calendar that changes a few times a year.
 */
export async function getUpcomingEvents(): Promise<RaagaEvent[]> {
  'use cache'
  const now = Date.now()
  return seed.events
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
}

export async function getPastEvents(limit = 3): Promise<RaagaEvent[]> {
  'use cache'
  const now = Date.now()
  return seed.events
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit)
}

/** Public count only — associations do not want their clubhouse address indexed. */
export async function getPublicCommunityCount(): Promise<number> {
  return seed.communities.filter(
    (c) => c.approvalStatus === 'live' || c.approvalStatus === 'approved',
  ).length
}

export async function getPublicCommunities(): Promise<Community[]> {
  return seed.communities.filter((c) => c.isPublic)
}

export { LADDER_SOURCE } from '@/content/seed'
