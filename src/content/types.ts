import type { StaticImageData } from 'next/image'

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

/**
 * Learning happens at two physical centres or online. `Mode` is the key the
 * enquiry form, the router cards and the lead document all agree on.
 */
/**
 * The client's content master lists four options under "Preferred Centre":
 * Jubilee Hills / Phoenix Arena / Online / Community. Community is teaching
 * hosted inside a residential community rather than at one of our centres.
 */
export type Mode = 'jubilee-hills' | 'phoenix-arena' | 'online' | 'community'
export type Tier = 'beginner' | 'intermediate' | 'advanced'
export type DisciplineStatus = 'active' | 'planned'
export type GalleryCategory = 'classes' | 'performances' | 'workshops' | 'community'

export interface SiteSettings {
  /** Canonical lockup. Never bare "RAAGA" — three other schools already use it. */
  legalName: string
  shortName: string
  tagline: string
  sanskritLine: { devanagari: string; roman: string; gloss: string }
  /** The year the school was founded. Rendered as a fact, never as a counter. */
  foundedYear: number
  locality: string
  city: string
  region: string
  country: string
  /** null until the client confirms a publishable street address. */
  streetAddress: string | null
  postalCode?: string
  geo?: { latitude: number; longitude: number }
  mapsUrl?: string
  whatsapp: string
  phoneDisplay: string
  /**
   * null until a mailbox actually exists. A published address that bounces is
   * worse than none: it is a channel a visitor will use and never hear back on.
   */
  email: string | null
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

/**
 * A distinct search intent, not a location keyword swapped into a template.
 * Every entry powers one static, indexable page under /carnatic-music-classes.
 */
export interface SeoLandingPage {
  slug: string
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  highlights: { title: string; body: string }[]
  sections: { title: string; body: string }[]
  related: { label: string; href: string }[]
}

export interface Faq {
  order: number
  question: string
  answer: string
  /** The eight that actually block a decision render above the fold on mobile. */
  blocking: boolean
}

/**
 * A place learning happens. Two are physical centres, one is online.
 *
 * `streetAddress` stays null until the client confirms a publishable address —
 * a fabricated address is worse than no address, because it is the one field a
 * visitor will act on physically.
 */
export interface Centre {
  key: Mode
  /**
   * URL segment for /music-classes/[centre]. null for online, which has its
   * own page rather than a locality page.
   */
  slug: string | null
  /** Sanskrit or English kicker above the name. */
  eyebrow: string
  name: string
  /** Where it is, in the words a Hyderabad local would use. */
  locality: string | null
  body: string
  cta: string
  href: string
  streetAddress: string | null
  postalCode?: string
  geo?: { latitude: number; longitude: number }
  mapsUrl?: string
  /** Drives the mode chip label on the enquiry form, so the two never drift. */
  formLabel: string
  /** Localities this centre is realistically reachable from. */
  nearby: string[]
}

/**
 * A rung of Sangeetha Mārgam. These are documented stages of Carnatic
 * pedagogy, not a proprietary "method" — which is exactly why the section
 * ships complete with zero client content.
 */
export interface CurriculumStage {
  order: number
  slug: string
  /** Transliterated name, e.g. "Sarali Swaras". */
  name: string
  devanagari: string
  /** One-line plain-English gloss for someone who has never heard the term. */
  gloss: string
  /** What the stage actually is, musically. */
  body: string
  /** The concrete "what you'll be able to do" line — never aspirational. */
  outcome: string
  duration: string
  tier: Tier
}

export interface AcademicPathway {
  order: number
  name: string
  body: string
}

/** A Vision or Mission statement, straight from the client's content master. */
export interface Tenet {
  order: number
  title: string
  body: string
}

/** A recurring kind of event RAAGA holds — not a dated occurrence. */
export interface EventKind {
  order: number
  name: string
  body: string
}

/** A Manana subject area. Articles arrive later; the subjects are real now. */
export interface JournalTopic {
  order: number
  name: string
  devanagari?: string
  body: string
}

export interface PerformanceStrand {
  order: number
  name: string
  body: string
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
  aspect: '4/5' | '3/2' | '4/3' | '1/1' | '16/9'
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
  category: GalleryCategory
  media: MediaRef
  caption?: string
  consent: Consent
}

/**
 * A photograph from a real RAAGA event, grouped on /events by `occasion`.
 * The consent gate treats it exactly like any other image of people: it is
 * filtered in the query, never in a component.
 */
export interface EventPhoto {
  id: string
  /** The owner's caption for the occasion, e.g. "Annual concerts". */
  occasion: string
  media: MediaRef
  consent: Consent
}

/**
 * A newspaper write-up of a RAAGA event, shown on /events under "In the press".
 *
 * The clipping is kept whole: its masthead and source line are the attribution,
 * so they must never be cropped away. `headline` is exactly as printed;
 * `headlineEnglish` is only a gloss for a non-English headline.
 */
export interface PressMention {
  id: string
  publication: string
  language: 'en' | 'te'
  /** ISO date of the edition, YYYY-MM-DD. */
  date: string
  headline: string
  headlineEnglish?: string
  occasion: string
  /** Static import, so next/image has the intrinsic size and the asset URL. */
  clipping: StaticImageData
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
