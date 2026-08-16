import type { SiteSettings, Centre } from '../types'

/**
 * TIER 0 BLANKS are marked `null` or left out entirely rather than filled with
 * plausible-looking fiction. Every section that consumes them degrades by
 * design — see the DAL and <Section>.
 */
export const site: SiteSettings = {
  // Canonical lockup. "Raaga School Of Music" (Kothapet), "Raaga Sudha Music
  // School" (Kukatpally) and raagaschool.com (Bay Area) all already exist, and
  // raaga.com has owned the bare word since 2006. Always disambiguate.
  legalName: 'RAAGA — School of Indian Classical Music, Jubilee Hills, Hyderabad',
  shortName: 'RAAGA',
  tagline: 'Preserving tradition. Inspiring every generation.',
  sanskritLine: {
    devanagari: 'नादब्रह्म',
    roman: 'Nāda Brahma',
    gloss: 'Sound is the divine.',
  },
  foundedYear: 2016,
  locality: 'Jubilee Hills',
  city: 'Hyderabad',
  region: 'Telangana',
  country: 'India',
  // TIER 0: pending — do NOT invent a street address or geo coordinates.
  streetAddress: null,
  whatsapp: '918247558515',
  phoneDisplay: '+91 82475 58515',
  // TIER 0: no mailbox exists at theraaga.in yet — the domain has no MX records
  // and no SPF/DKIM, so mail claiming this address currently fails DMARC.
  // Either provision it or swap this for the working address before launch.
  email: 'hello@theraaga.in',
  social: {},
  // Facts that are true on day one, with no client data at all.
  // Values are STRINGS. Merit School of Music and Furtados both currently ship
  // live homepages reading "0 +" because a count-up never fired.
  stats: [
    { label: 'Teaching in Hyderabad since', value: '2016' },
    { label: 'Centres, plus online', value: 'Two' },
    { label: 'Taught in an unbroken guru–śiṣya line', value: 'Parampara' },
    { label: 'Open to children and adults', value: 'All ages' },
  ],
}

/**
 * The router. 14 of 19 music schools studied put one immediately below the
 * hero — and Raaga's router is not instrument, it is WHERE, because a parent
 * scrolling a WhatsApp forward is answering exactly one question first: is
 * this near me, or can we do it from home?
 *
 * `formLabel` is the single source of truth for the enquiry form's mode chips,
 * so the card a visitor tapped and the option they then pick can never drift
 * apart.
 */
export const centres: Centre[] = [
  {
    key: 'jubilee-hills',
    slug: 'jubilee-hills',
    eyebrow: 'At the centre',
    name: 'Jubilee Hills',
    locality: 'Jubilee Hills, Hyderabad',
    body: 'Our founding centre, teaching here since 2016. Small batches for children and adults, in person, with the guru in the room.',
    cta: 'Classes at Jubilee Hills',
    href: '/music-classes/jubilee-hills',
    // TIER 0: pending client confirmation. Never fabricated.
    streetAddress: null,
    formLabel: 'Jubilee Hills',
    nearby: [
      'Banjara Hills',
      'Film Nagar',
      'Yousufguda',
      'Srinagar Colony',
      'Madhapur',
      'Manikonda',
    ],
  },
  {
    key: 'phoenix-arena',
    slug: 'hitech-city',
    eyebrow: 'At the centre',
    name: 'Phoenix Arena',
    locality: 'Hitech City, Hyderabad',
    body: 'Our Hitech City centre, convenient for families in Madhapur, Gachibowli and Kondapur. The same syllabus, the same teaching.',
    cta: 'Classes at Hitech City',
    href: '/music-classes/hitech-city',
    // TIER 0: pending client confirmation. Never fabricated.
    streetAddress: null,
    formLabel: 'Phoenix Arena, Hitech City',
    nearby: [
      'Madhapur',
      'Gachibowli',
      'Kondapur',
      'Kokapet',
      'Financial District',
      'Nanakramguda',
    ],
  },
  {
    key: 'online',
    slug: null,
    eyebrow: 'From anywhere',
    name: 'Online',
    locality: null,
    body: 'Live classes over video for students outside Hyderabad and across the world, at times that work for the Gulf, the UK and North America.',
    cta: 'Online Carnatic classes',
    href: '/online-classes',
    streetAddress: null,
    formLabel: 'Online',
    nearby: [],
  },
]
