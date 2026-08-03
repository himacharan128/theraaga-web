import type {
  Batch,
  Community,
  Faculty,
  GalleryItem,
  RaagaEvent,
  Testimonial,
} from '../types'

export { site, deliveryModes } from './site'
export { levels, LADDER_SOURCE } from './levels'
export { disciplines } from './disciplines'
export { pillars } from './pillars'
export { faqs } from './faqs'

/**
 * ---------------------------------------------------------------------------
 * TIER 0 / TIER 1 CONTENT — deliberately EMPTY.
 * ---------------------------------------------------------------------------
 * These are not seeded with plausible fiction. Two reasons:
 *
 *  1. A fabricated testimonial is a misleading advertisement under the CCPA
 *     Misleading Advertisements Guidelines 2022 (₹10 lakh, ₹50 lakh repeat),
 *     and fake faculty or quotes can leak to a preview URL the client shares.
 *  2. Building a fake full-data path doubles the UI surface we have to design
 *     and review for no benefit.
 *
 * Every consumer of these arrays MUST degrade by design. That is the whole
 * point of the exercise — the site has to look finished while they are empty.
 * Leaving them empty is how we prove it does.
 */
export const faculty: Faculty[] = []
export const batches: Batch[] = []
export const testimonials: Testimonial[] = []
export const galleryItems: GalleryItem[] = []
export const events: RaagaEvent[] = []
export const communities: Community[] = []
