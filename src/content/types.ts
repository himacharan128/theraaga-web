/**
 * Content model — see plan §9.
 *
 * These shapes are FINAL. In v1 they are seeded from `content/seed/*` and read
 * through the server-only DAL in `data/`. In v1.1 Payload 3 is pointed at the
 * same collections on the same MongoDB — that is configuration, not migration.
 *
 * Two rules the type system enforces on purpose:
 *  1. There are NO fee fields anywhere. An unused price field is an invitation
 *     to render one. Fees are a WhatsApp conversation. (plan §3)
 *  2. Anything that can depict a minor carries a `consent` block, and the DAL
 *     filters on it in the QUERY, not in the UI.
 */

export type Mode = 'institute' | 'online' | 'community'
export type Tier = 'beginner' | 'intermediate' | 'advanced'
export type DisciplineStatus = 'active' | 'planned'

export interface SiteSettings {
  /** Canonical lockup. Never bare "Raaga" — three other schools already use it. */
  legalName: string
  shortName: string
  tagline: string
  sanskritLine: { devanagari: string; roman: string; gloss: string }
  locality: string
  city: string
  region: string
  country: string
  /** null until the client confirms a publishable street address. */
  streetAddress: string | null
  whatsapp: string
  phoneDisplay: string
  email: string
  social: { instagram?: string; youtube?: string; facebook?: string }
  /** Strings, never ints — a zero-valued counter is worse than no counter. */
  stats: { label: string; value: string }[]
}

export interface Discipline {
  slug: string
  name: string
  sanskrit?: string
  blurb: string
  status: DisciplineStatus
  order: number
}

export interface Level {
  order: number
  slug: string
  sanskrit: string
  devanagari: string
  gloss: string
  /** The "what you'll be able to do" line — concrete, never aspirational. */
  outcome: string
  duration: string
  tier: Tier
}

export interface Pillar {
  order: number
  title: string
  body: string
}

export interface Faq {
  order: number
  question: string
  answer: string
  /** The eight that actually block a decision render above the fold on mobile. */
  blocking: boolean
}

export interface DeliveryMode {
  key: Mode
  eyebrow: string
  title: string
  body: string
  cta: string
  href: string
}

export interface LineageEntry {
  order: number
  name: string
  honorific?: string
  relation: 'guru' | 'paramaguru' | 'school'
  note?: string
}

export interface Faculty {
  slug: string
  name: string
  honorific?: string
  role: string
  lineage: LineageEntry[]
  yearsTeaching?: number
  /** All India Radio grading — a headline Carnatic credential no template models. */
  airGrade?: 'B' | 'B-High' | 'A' | 'Top'
  sabhasPerformed?: { name: string; city: string; year?: number }[]
  awards?: { title: string; awardingBody?: string; year?: number }[]
  examBoardAffiliations?: string[]
  languagesTaught?: string[]
  philosophy?: string
  portrait?: MediaRef
}

export interface Batch {
  id: string
  discipline: string
  mode: Mode
  dayOfWeek: string
  time: string
  ageBand: string
  seatsTotal: number
  seatsFilled: number
  locationLabel: string
}

export interface Consent {
  hasMinors: boolean
  guardianConsentObtained: boolean
  obtainedAt?: string
}

export interface MediaRef {
  src: string
  alt: string
  /** Reserved so the placeholder→real-photo swap costs zero layout shift. */
  aspect: '4/5' | '3/2' | '1/1' | '16/9'
}

export interface Testimonial {
  id: string
  quote: string
  attribution: string
  context: string
  tenure?: string
  consent: Consent
}

export interface GalleryItem {
  id: string
  kind: 'image' | 'video' | 'audio'
  media: MediaRef
  caption?: string
  consent: Consent
}

export interface RaagaEvent {
  id: string
  kind: 'kutcheri' | 'sangama' | 'open-baithak' | 'sangeeta-sandhya'
  title: string
  date: string
  venue: string
  /** Only physical events are eligible for Event JSON-LD. */
  isPhysical: boolean
  blurb?: string
}

export interface Community {
  slug: string
  name: string
  locality: string
  approvalStatus: 'prospect' | 'association_contacted' | 'approved' | 'live'
  /** Associations do not want their address indexed. Count is public; address is not. */
  isPublic: boolean
}
