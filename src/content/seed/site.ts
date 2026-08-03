import type { SiteSettings, DeliveryMode } from '../types'

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
  // Four facts that are true on day one, with no client data at all.
  // Values are STRINGS. Merit School of Music and Furtados both currently ship
  // live homepages reading "0 +" because a count-up never fired.
  stats: [
    { label: 'Taught in an unbroken guru–śiṣya line', value: 'Parampara' },
    { label: 'Maximum students per batch', value: '6' },
    { label: 'Ways to learn', value: '3' },
    { label: 'Beginners accepted from age', value: '5' },
  ],
}

/**
 * The router. 14 of 19 music schools studied put one immediately below the
 * hero — and Raaga's router is not instrument, it is MODE. That is the actual
 * differentiator and the thing a parent scrolling a WhatsApp forward is
 * looking for.
 */
export const deliveryModes: DeliveryMode[] = [
  {
    key: 'institute',
    eyebrow: 'At the institute',
    title: 'Jubilee Hills',
    body: 'Small batches at our studio in Jubilee Hills. Weekday evenings and weekend mornings.',
    cta: 'See institute batches',
    href: '/carnatic-vocal-classes-hyderabad',
  },
  {
    key: 'online',
    eyebrow: 'Online',
    title: 'Anywhere in the world',
    body: 'Live one-to-one and small-group classes over video, at times that work for the US, the UK and the Gulf.',
    cta: 'See online classes',
    href: '/online-classes',
  },
  {
    key: 'community',
    eyebrow: 'At your community',
    title: 'Clubhouse batches',
    body: 'We come to your gated community and teach at your clubhouse. Six interested families is usually enough — we speak to your association together.',
    cta: 'Bring Raaga to your community',
    href: '/communities',
  },
]
