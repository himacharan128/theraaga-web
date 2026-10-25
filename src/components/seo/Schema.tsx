import { site, centres } from '@/content/seed/site'
import type { SeoLandingPage } from '@/content/types'

export const BASE_URL = 'https://theraaga.in'
const LOGO_URL = `${BASE_URL}/brand/raaga-logo.png`

/**
 * Structured data, with three deliberate omissions.
 *
 * 1. There is NO `MusicSchool` type. schema.org/MusicSchool returns 404;
 *    EducationalOrganization's only subtypes are CollegeOrUniversity,
 *    ElementarySchool, HighSchool, MiddleSchool, Preschool and School. The
 *    correct markup is the multi-type array below.
 *
 * 2. NO `priceRange`, and no `offers` on any Course node. Prices never appear
 *    on this site, and that applies to structured data exactly as it does to
 *    visible copy. The properties are left out entirely rather than emitted
 *    empty. Google's Course list result does not use a price at all (the
 *    Course info result that did was retired in September 2025).
 *
 * 3. NO `AggregateRating` or `Review`. Google makes self-controlled reviews on
 *    Organization/LocalBusiness ineligible for the star feature and it carries
 *    manual-action risk. Real ratings belong on the Google Business Profile.
 *
 * Every property is emitted conditionally: we omit a node rather than publish
 * an empty string or, worse, invented geo coordinates for an address the client
 * has not yet confirmed. `streetAddress` appears for a centre only once that
 * centre has a real one.
 */

/** Every Hyderabad area a centre page names as its catchment, in one list. */
const catchment = [...new Set(centres.flatMap((c) => c.nearby))]

/**
 * Where online students learn from. The same regions the online page lists
 * its timings for; extend both together.
 */
const onlineCountries = [
  'India',
  'United Arab Emirates',
  'Qatar',
  'Oman',
  'United Kingdom',
  'United States',
  'Singapore',
  'Australia',
]

function address(streetAddress: string | null | undefined, locality: string | null | undefined, postalCode?: string) {
  // Google reads addressLocality as the city. The neighbourhood belongs in
  // the street line, so "Jubilee Hills" and "Hyderabad" never compete.
  const street = [streetAddress, locality].filter(Boolean).join(', ')
  return {
    '@type': 'PostalAddress',
    ...(street ? { streetAddress: street } : {}),
    ...(postalCode ? { postalCode } : {}),
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: 'IN',
  }
}

function institutionNodes() {
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#org`,
    name: site.legalName,
    alternateName: site.shortName,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      caption: 'RAAGA',
    },
    description:
      'RAAGA is a school of Indian classical music offering Carnatic music and vocal classes for children and adults in Hyderabad and live online.',
    foundingDate: String(site.foundedYear),
    subOrganization: { '@id': `${BASE_URL}/#institute` },
    ...(Object.values(site.social).filter(Boolean).length
      ? { sameAs: Object.values(site.social).filter(Boolean) }
      : {}),
  }

  // One Place node per physical centre, with the locality only until the
  // client confirms a publishable street address. A fabricated address is the
  // one error a visitor acts on physically.
  const locations = centres
    .filter((c) => c.slug)
    .map((c) => ({
      '@type': 'Place',
      '@id': `${BASE_URL}/#centre-${c.key}`,
      name: `${site.shortName}: ${c.name}`,
      url: `${BASE_URL}${c.href}`,
      ...(c.mapsUrl ? { hasMap: c.mapsUrl } : {}),
      ...(c.geo ? { geo: { '@type': 'GeoCoordinates', ...c.geo } } : {}),
      address: address(c.streetAddress, c.locality?.replace(`, ${site.city}`, ''), c.postalCode),
    }))

  const institute: Record<string, unknown> = {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${BASE_URL}/#institute`,
    name: site.legalName,
    alternateName: site.shortName,
    url: BASE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description:
      'Carnatic music and vocal classes in Hyderabad for children and adults, taught at Jubilee Hills, Hitech City, in residential communities and live online.',
    foundingDate: String(site.foundedYear),
    parentOrganization: { '@id': `${BASE_URL}/#org` },
    telephone: `+${site.whatsapp}`,
    ...(site.mapsUrl ? { hasMap: site.mapsUrl } : {}),
    // The Google Business Profile is the same school, and saying so is what
    // lets Google and the AI assistants join the listing's reviews and photos
    // to this website instead of treating them as two businesses.
    ...(site.googleProfileUrl ? { sameAs: [site.googleProfileUrl] } : {}),
    ...(site.geo ? { geo: { '@type': 'GeoCoordinates', ...site.geo } } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: address(site.streetAddress, site.locality, site.postalCode),
    ...(locations.length ? { location: locations } : {}),
    areaServed: [
      { '@type': 'City', name: site.city },
      ...catchment.map((n) => ({ '@type': 'Place', name: `${n}, ${site.city}` })),
      ...onlineCountries.map((n) => ({ '@type': 'Country', name: n })),
    ],
    knowsAbout: [
      'Carnatic music',
      'Carnatic vocal',
      'Carnatic Sangeetham',
      'Indian classical music',
      'Guru Shishya Parampara',
    ],
    knowsLanguage: ['en', 'te'],
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: site.shortName,
    alternateName: site.legalName,
    url: BASE_URL,
    inLanguage: 'en-IN',
    publisher: { '@id': `${BASE_URL}/#org` },
  }

  return [org, institute, website]
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/**
 * The school, its centres and the website, on every public page. Page-level
 * schema points at `#org`, `#institute` and `#website`; emitting them only on
 * the homepage left those references dangling everywhere else.
 */
export function SiteSchema() {
  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': institutionNodes() }} />
}

export function HomePageSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#webpage`,
        url: BASE_URL,
        name: 'Carnatic Music & Vocal Classes in Hyderabad | RAAGA',
        description:
          'Carnatic music and vocal classes for children and adults in Jubilee Hills and Hitech City, Hyderabad, plus live online learning.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#institute` },
        mainEntity: { '@id': `${BASE_URL}/#institute` },
      }}
    />
  )
}

/** One learning path as a schema.org Course. No offers, by rule. */
export function courseNode(page: SeoLandingPage) {
  const url = `${BASE_URL}/carnatic-music-classes/${page.slug}`
  return {
    '@type': 'Course',
    '@id': `${url}#course`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'en',
    provider: { '@id': `${BASE_URL}/#institute` },
    hasCourseInstance: [
      { '@type': 'CourseInstance', courseMode: 'onsite', location: centres.filter((c) => c.slug).map((c) => ({ '@id': `${BASE_URL}/#centre-${c.key}` })) },
      { '@type': 'CourseInstance', courseMode: 'online' },
    ],
  }
}

/** Google's Course list: an ItemList of three or more courses, each with its own page. */
export function CourseListSchema({ pages }: { pages: SeoLandingPage[] }) {
  if (pages.length < 3) return null
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: pages.map((page, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: courseNode(page),
        })),
      }}
    />
  )
}
