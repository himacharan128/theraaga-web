import 'server-only'

import * as seed from '@/content/seed'
import type {
  AcademicPathway,
  Batch,
  Centre,
  CurriculumStage,
  Discipline,
  EventKind,
  EventPhoto,
  Faculty,
  Faq,
  GalleryCategory,
  GalleryItem,
  JournalTopic,
  PerformanceStrand,
  Pillar,
  PressMention,
  RaagaEvent,
  SeoLandingPage,
  SiteSettings,
  Tenet,
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

export async function getCentres(): Promise<Centre[]> {
  return seed.centres
}

/** The two physical centres, in display order. Online is handled separately. */
export async function getPhysicalCentres(): Promise<Centre[]> {
  return seed.centres.filter((c) => c.key !== 'online')
}

export async function getCentre(key: string): Promise<Centre | undefined> {
  return seed.centres.find((c) => c.key === key)
}

/** Look a centre up by its URL segment, for /music-classes/[centre]. */
export async function getCentreBySlug(slug: string): Promise<Centre | undefined> {
  return seed.centres.find((c) => c.slug === slug)
}

export async function getCurriculum(): Promise<CurriculumStage[]> {
  return [...seed.curriculum].sort((a, b) => a.order - b.order)
}

export async function getAcademicPathways(): Promise<AcademicPathway[]> {
  return [...seed.academicPathways].sort((a, b) => a.order - b.order)
}

export async function getPerformanceStrands(): Promise<PerformanceStrand[]> {
  return [...seed.performanceStrands].sort((a, b) => a.order - b.order)
}

export async function getLineageReferences() {
  return [...seed.lineageReferences].sort((a, b) => a.order - b.order)
}

export async function getScholarlyWorks() {
  return [...seed.scholarlyWorks].sort((a, b) => a.order - b.order)
}

export async function getTeachingPrinciples() {
  return [...seed.teachingPrinciples].sort((a, b) => a.order - b.order)
}

export async function getGurusIntro(): Promise<string[]> {
  return seed.gurusIntro
}

export async function getStory(): Promise<string[]> {
  return seed.story
}

export async function getVision(): Promise<string> {
  return seed.vision
}

export async function getMission(): Promise<Tenet[]> {
  return [...seed.mission].sort((a, b) => a.order - b.order)
}

export async function getEventKinds(): Promise<EventKind[]> {
  return [...seed.eventKinds].sort((a, b) => a.order - b.order)
}

export async function getJournalTopics(): Promise<JournalTopic[]> {
  return [...seed.journalTopics].sort((a, b) => a.order - b.order)
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

export async function getSeoLandingPages(): Promise<SeoLandingPage[]> {
  return seed.seoLandingPages
}

export async function getSeoLandingPageBySlug(
  slug: string,
): Promise<SeoLandingPage | undefined> {
  return seed.seoLandingPages.find((page) => page.slug === slug)
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
 * Press clippings, newest first. They show adults only, so there is no consent
 * block to gate on; the seed is already in date order and the sort is stable.
 */
export async function getPressMentions(): Promise<PressMention[]> {
  return [...seed.pressMentions].sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Event photographs, grouped by occasion for /events.
 *
 * The consent gate runs first, so an occasion whose photographs are all gated
 * is absent from the result rather than present and empty. Groups keep the
 * seed's order, and so do the photographs within them.
 */
export async function getEventPhotos(): Promise<
  { occasion: string; photos: EventPhoto[] }[]
> {
  const groups = new Map<string, EventPhoto[]>()
  for (const photo of consentGate(seed.eventPhotos)) {
    const group = groups.get(photo.occasion)
    if (group) group.push(photo)
    else groups.set(photo.occasion, [photo])
  }
  return [...groups].map(([occasion, photos]) => ({ occasion, photos }))
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

/**
 * Gallery, grouped for the Anubhava page.
 *
 * Returns only categories that actually have consented items, so the page
 * never renders an empty "Workshops" heading with nothing under it.
 */
export async function getGalleryByCategory(): Promise<
  { category: GalleryCategory; label: string; items: GalleryItem[] }[]
> {
  const labels: Record<GalleryCategory, string> = {
    classes: 'Classes',
    performances: 'Performances',
    workshops: 'Workshops',
    community: 'Community',
  }
  const items = await getGalleryItems()
  return (Object.keys(labels) as GalleryCategory[])
    .map((category) => ({
      category,
      label: labels[category],
      items: items.filter((i) => i.category === category),
    }))
    .filter((g) => g.items.length > 0)
}

export { CURRICULUM_SOURCE } from '@/content/seed'
