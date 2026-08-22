import { site, centres } from '@/content/seed/site'

const BASE_URL = 'https://theraaga.in'
const LOGO_URL = `${BASE_URL}/brand/raaga-wordmark.webp`

/**
 * Structured data — with three deliberate omissions.
 *
 * 1. There is NO `MusicSchool` type. schema.org/MusicSchool returns 404;
 *    EducationalOrganization's only subtypes are CollegeOrUniversity,
 *    ElementarySchool, HighSchool, MiddleSchool, Preschool and School. The
 *    correct markup is the multi-type array below.
 *
 * 2. NO `priceRange`, and no `offers` on any Course node. Prices never appear
 *    on this site, and that applies to structured data exactly as it does to
 *    visible copy. The properties are left out entirely rather than emitted
 *    empty.
 *
 * 3. NO `AggregateRating` or `Review`. Google makes self-controlled reviews on
 *    Organization/LocalBusiness ineligible for the star feature and it carries
 *    manual-action risk. Real ratings belong on the Google Business Profile.
 *
 * Every property is emitted conditionally — we omit a node rather than publish
 * an empty string or, worse, invented geo coordinates for an address the client
 * has not yet confirmed. `streetAddress` appears for a centre only once that
 * centre has a real one.
 */
export function OrganizationSchema() {
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#org`,
    name: site.legalName,
    alternateName: site.shortName,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      caption: 'RAGA',
    },
    description:
      'RAGA is a school of Indian classical music offering Carnatic music and vocal classes for children and adults in Hyderabad and live online.',
    foundingDate: String(site.foundedYear),
    ...(Object.values(site.social).filter(Boolean).length
      ? { sameAs: Object.values(site.social).filter(Boolean) }
      : {}),
  }

  // One Place node per physical centre. Locality only until the client
  // confirms publishable street addresses — a fabricated address is the one
  // error a visitor acts on physically.
  const locations = centres
    .filter((c) => c.slug)
    .map((c) => ({
      '@type': 'Place',
      '@id': `${BASE_URL}/#centre-${c.key}`,
      name: `${site.shortName}: ${c.name}`,
      url: `${BASE_URL}${c.href}`,
      address: {
        '@type': 'PostalAddress',
        ...(c.streetAddress ? { streetAddress: c.streetAddress } : {}),
        addressLocality: c.locality ?? site.city,
        addressRegion: site.region,
        addressCountry: 'IN',
      },
    }))

  const institute: Record<string, unknown> = {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${BASE_URL}/#institute`,
    name: site.legalName,
    alternateName: site.shortName,
    url: BASE_URL,
    logo: LOGO_URL,
    description:
      'Carnatic music and vocal classes in Hyderabad for children and adults, taught at Jubilee Hills, Hitech City and live online.',
    foundingDate: String(site.foundedYear),
    telephone: `+${site.whatsapp}`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: 'IN',
    },
    ...(locations.length ? { location: locations } : {}),
    areaServed: [
      'Hyderabad',
      'Jubilee Hills',
      'Banjara Hills',
      'Hitech City',
      'Madhapur',
      'Gachibowli',
      'Kondapur',
      'Kokapet',
      'Manikonda',
      'Financial District',
      'Narsingi',
    ].map((n) => ({
      '@type': 'Place',
      name: n === site.city ? n : `${n}, ${site.city}`,
    })),
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

  const homePage = {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: 'Carnatic Music & Vocal Classes in Hyderabad | RAGA',
    description:
      'Carnatic music and vocal classes for children and adults in Jubilee Hills and Hitech City, Hyderabad, plus live online learning.',
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#institute` },
    mainEntity: { '@id': `${BASE_URL}/#institute` },
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [org, institute, website, homePage],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
