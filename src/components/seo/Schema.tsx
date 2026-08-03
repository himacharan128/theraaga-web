import { site } from '@/content/seed/site'

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
 * has not yet confirmed.
 */
export function OrganizationSchema() {
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': 'https://theraaga.in/#org',
    name: site.legalName,
    alternateName: site.shortName,
    url: 'https://theraaga.in',
    ...(Object.values(site.social).filter(Boolean).length
      ? { sameAs: Object.values(site.social).filter(Boolean) }
      : {}),
  }

  const institute: Record<string, unknown> = {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': 'https://theraaga.in/#institute',
    name: site.legalName,
    url: 'https://theraaga.in',
    telephone: `+${site.whatsapp}`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      // streetAddress omitted until confirmed — never fabricated.
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: 'IN',
    },
    areaServed: [
      'Jubilee Hills',
      'Banjara Hills',
      'Madhapur',
      'Gachibowli',
      'Kondapur',
      'Kokapet',
      'Manikonda',
      'Hitec City',
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
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
