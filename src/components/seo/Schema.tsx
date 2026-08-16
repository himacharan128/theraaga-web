import { site, centres } from '@/content/seed/site'

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
    '@id': 'https://theraaga.in/#org',
    name: site.legalName,
    alternateName: site.shortName,
    url: 'https://theraaga.in',
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
      '@id': `https://theraaga.in/#centre-${c.key}`,
      name: `${site.shortName} — ${c.name}`,
      url: `https://theraaga.in${c.href}`,
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
    '@id': 'https://theraaga.in/#institute',
    name: site.legalName,
    url: 'https://theraaga.in',
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
    ].map((n) => ({ '@type': 'Place', name: `${n}, Hyderabad` })),
    knowsLanguage: ['en', 'te'],
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [org, institute],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
