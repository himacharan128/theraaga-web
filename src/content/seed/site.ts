import type { SiteSettings, Centre } from '../types'

/**
 * TIER 0 BLANKS are marked `null` or left out entirely rather than filled with
 * plausible-looking fiction. Every section that consumes them degrades by
 * design — see the DAL and <Section>.
 */
export const site: SiteSettings = {
  // The client's content master spells the school RAAGA throughout, as does
  // their own poster. The lockup still disambiguates, because "RAAGA School Of
  // Music" (Kothapet), "RAAGA Sudha Music School" (Kukatpally) and
  // raagaschool.com all exist and raaga.com has owned the bare word since 2006.
  legalName: 'RAAGA: School of Indian Classical Music, Jubilee Hills, Hyderabad',
  shortName: 'RAAGA',
  tagline: 'A journey through the timeless tradition of Carnatic Sangeetham.',
  // The client's chosen hero quote — the opening of Tyagaraja's kriti in raga
  // Chittaranjani, "I ceaselessly worship Shankara, whose form is sound".
  sanskritLine: {
    devanagari: 'नादतनुमनिशम्',
    roman: 'Nāda Tanum Anisham',
    gloss: 'Whose very form is sound.',
  },
  foundedYear: 2016,
  locality: 'Jubilee Hills',
  city: 'Hyderabad',
  region: 'Telangana',
  country: 'India',
  // Address and pin supplied by the owner on 2026-09-15.
  streetAddress: 'Road Number 24, Jawahar Colony, Venkatagiri',
  postalCode: '500033',
  geo: { latitude: 17.43625, longitude: 78.4089167 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=17.43625%2C78.4089167',
  whatsapp: '918247558515',
  phoneDisplay: '+91 82475 58515',
  // NULL BY DECISION, not by oversight. theraaga.in has no MX, SPF or DKIM, and
  // email is deliberately out of scope for now — so no address is published
  // anywhere. WhatsApp and the phone number are the contact routes, including
  // on the legal pages, where a reachable channel is a DPDP requirement rather
  // than a courtesy. Set this and every consumer picks it up automatically.
  email: null,
  social: {},
  // Facts that are true on day one, with no client data at all.
  // Values are STRINGS. Merit School of Music and Furtados both currently ship
  // live homepages reading "0 +" because a count-up never fired.
  stats: [
    { label: 'Teaching in Hyderabad', value: 'A decade' },
    { label: 'Centres, plus online and community classes', value: 'Two' },
    { label: 'Rooted in the Guru–Shishya', value: 'Parampara' },
    { label: 'Open to children and adults', value: 'All ages' },
  ],
}

/**
 * The router. 14 of 19 music schools studied put one immediately below the
 * hero — and RAAGA's router is not instrument, it is WHERE, because a parent
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
    body: 'Our founding centre, teaching here for a decade. Small batches for children and adults, in person, with the guru in the room.',
    cta: 'Classes at Jubilee Hills',
    href: '/music-classes/jubilee-hills',
    streetAddress: 'Road Number 24, Jawahar Colony, Venkatagiri',
    postalCode: '500033',
    geo: { latitude: 17.43625, longitude: 78.4089167 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=17.43625%2C78.4089167',
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
    body: 'Live classes online, worldwide, taught by the same Gurus to the same syllabus.',
    cta: 'Online Carnatic classes',
    href: '/online-classes',
    streetAddress: null,
    formLabel: 'Online',
    nearby: [],
  },
  {
    key: 'community',
    // No locality page: this is hosted teaching, and the venue belongs to the
    // community rather than to us. We never publish someone else's address.
    slug: null,
    eyebrow: 'In your community',
    name: 'Community classes',
    locality: null,
    body: 'Learning hosted within a residential community, taught by the same Gurus to the same syllabus. Tell us where you are and we will discuss what is possible.',
    cta: 'Ask about community classes',
    href: '/contact',
    streetAddress: null,
    formLabel: 'Community',
    nearby: [],
  },
]
