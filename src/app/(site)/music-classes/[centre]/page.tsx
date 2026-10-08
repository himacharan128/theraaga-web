import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { IndexList } from '@/components/layout/Editorial'
import { Arrow, ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { AddressLine } from '@/components/ui/AddressLine'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { whatsappHref } from '@/lib/whatsapp'
import { getCentreBySlug, getCentres } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

/**
 * One locality page per physical centre, generated from the centres data.
 *
 * Previously this was a hand-written file per centre, which is how a
 * two-centre school ends up with two subtly different pages that drift. Adding
 * a third centre is now a data change.
 *
 * Nearby areas describe the catchment, not additional branches.
 *
 * Composed as a place: the locality set in the title at hero scale, the visit
 * on the dark stage with the address large, the classes to ask about as a
 * contents page, and the neighbourhoods as a run of place names on sand.
 */
export async function generateStaticParams() {
  const centres = await getCentres()
  return centres
    .filter((c) => c.slug)
    .map((c) => ({ centre: c.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ centre: string }>
}): Promise<Metadata> {
  const { centre: slug } = await params
  const centre = await getCentreBySlug(slug)
  if (!centre) return {}

  const where = centre.locality ?? centre.name
  const title = `Carnatic Music Classes in ${where}`
  const description = slug === 'jubilee-hills'
    ? 'Carnatic vocal and singing classes at RAAGA, Road Number 24, Jubilee Hills, Hyderabad. Children and adults welcome. See the location and enquire about a trial.'
    : 'Carnatic vocal classes at RAAGA, Phoenix Arena, Hitech City, Hyderabad. Explore lessons for children and adults near Madhapur, Gachibowli and Kondapur.'

  return {
    title,
    description,
    alternates: { canonical: `/music-classes/${slug}` },
    openGraph: {
      title: `${title} at RAAGA`,
      description,
      url: `https://theraaga.in/music-classes/${slug}`,
      images: defaultOgImages,
    },
  }
}

export default async function CentrePage({
  params,
}: {
  params: Promise<{ centre: string }>
}) {
  const { centre: slug } = await params
  const centre = await getCentreBySlug(slug)
  if (!centre) notFound()
  const otherCentre = slug === 'jubilee-hills'
    ? { label: 'Phoenix Arena, Hitech City', href: '/music-classes/hitech-city' }
    : { label: 'Jubilee Hills', href: '/music-classes/jubilee-hills' }
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    '@id': `https://theraaga.in${centre.href}#webpage`,
    url: `https://theraaga.in${centre.href}`,
    name: `Carnatic music classes in ${centre.locality}`,
    isPartOf: { '@id': 'https://theraaga.in/#website' },
    about: { '@id': 'https://theraaga.in/#institute' },
    mainEntity: {
      '@type': 'Place', '@id': `https://theraaga.in/#centre-${centre.key}`,
      name: `RAAGA: ${centre.name}`, url: `https://theraaga.in${centre.href}`,
      ...(centre.streetAddress ? { address: {
        '@type': 'PostalAddress', streetAddress: centre.streetAddress,
        addressLocality: 'Hyderabad', addressRegion: 'Telangana',
        postalCode: centre.postalCode, addressCountry: 'IN',
      } } : {}),
      ...(centre.geo ? { geo: { '@type': 'GeoCoordinates', ...centre.geo } } : {}),
      ...(centre.mapsUrl ? { hasMap: centre.mapsUrl } : {}),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: `Classes in ${centre.name}`, href: `/music-classes/${slug}` },
        ]}
      />
      <PageHero
        variant="statement"
        eyebrow={centre.locality ?? centre.name}
        title={
          <>
            Carnatic music classes in <em>{centre.locality ?? centre.name}.</em>
          </>
        }
        lede={
          <p>
            {centre.body} RAAGA teaches Carnatic music and vocal classes for
            children from five and adults beginning at any age. No previous
            training needed.
          </p>
        }
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
        <ButtonLink variant="secondary" href={whatsappHref(slug.toUpperCase())}>
          <WhatsAppIcon />
          Ask on WhatsApp
        </ButtonLink>
      </PageHero>

      <CurrentBatches />

      {/* The visit, on the dark stage: where to go set large on the left, how
          to plan the trip beside it. Without a confirmed street address the
          large line is the honest instruction instead of an address. */}
      <Section
        id="directions"
        tone="night"
        layout="split"
        eyebrow="Plan your visit"
        title={`Learning at ${centre.name}`}
      >
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="reveal lg:col-span-6">
            {centre.streetAddress ? (
              <>
                <address className="t-statement not-italic text-fg">
                  <span className="block text-balance">
                    <AddressLine text={centre.streetAddress} />
                  </span>
                  <span className="block text-fg-2">
                    {centre.locality}, Telangana {centre.postalCode}
                  </span>
                </address>
                {centre.mapsUrl && (
                  <a
                    className="btn btn-secondary mt-10"
                    href={centre.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions in Google Maps
                    <Arrow />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </>
            ) : (
              <p className="t-statement text-fg">
                Classes are held at Phoenix Arena in Hitech City. Ask RAAGA to
                confirm the meeting point and class time before travelling to
                the venue.
              </p>
            )}
          </div>
          <div className="reveal space-y-5 border-t border-line pt-8 lg:col-span-5 lg:col-start-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="t-standfirst text-fg-2">
              {slug === 'jubilee-hills'
                ? 'Our founding centre has taught Carnatic vocal music since 2016. If you are comparing singing classes around Jubilee Hills, start with the kind of music you want to learn and a class you can attend regularly.'
                : 'For learners around Madhapur, Gachibowli and Kondapur, Phoenix Arena is our Hitech City option. Compare the journey from home or work at your intended class time before choosing a centre.'}
            </p>
            <p className="t-body text-fg-2">
              Share your available days, whether you are starting or returning,
              and your preferred centre. The team will confirm current teacher
              and batch availability; a visit is best arranged in advance.
            </p>
          </div>
        </div>
      </Section>

      <Section id="learning-options" title="Which class should you ask about?" layout="split">
        <IndexList
          items={[
            { title: 'Starting from the beginning', href: '/carnatic-music-classes/beginners', body: 'Begin with swaras, pitch and rhythm. No previous musical training is needed.' },
            { title: 'Lessons for children', href: '/carnatic-music-classes/children', body: 'RAAGA welcomes children from five. Read what parents can ask about readiness, class participation and practice.' },
            { title: 'Adult beginners and returners', href: '/carnatic-music-classes/adults', body: 'Starting now or returning after a break? Discuss your previous learning and a class that fits your routine.' },
          ]}
        />
        <p className="reveal t-caption mt-10 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">
          Our teaching is Carnatic classical vocal, also called Carnatic
          sangeetham. The{' '}
          <Link href="/learning" className="link">
            published syllabus
          </Link>{' '}
          shows how foundational exercises lead into compositions and advanced
          study.
        </p>
      </Section>

      {/* The catchment, set as a run of place names rather than a row of
          pills: they are places to come from, not options to press. Set as
          running text so the lines balance rather than leave one name alone;
          each diamond holds to the name before it and the line may break only
          after it, so a wrapped line never opens on one. */}
      <Section
        id="nearby"
        tone="sand"
        eyebrow="Choosing a centre"
        title="Coming from a nearby neighbourhood?"
        renderIf={centre.nearby.length > 0}
      >
        <ul className="reveal t-subhead leading-[1.5] text-balance text-fg">
          {centre.nearby.map((n, i) => (
            <li key={n} className="inline">
              <span className="whitespace-nowrap">
                {n}
                {i < centre.nearby.length - 1 && (
                  <span aria-hidden="true" className="mx-4 inline-block size-1.5 rotate-45 bg-mark align-middle md:mx-6" />
                )}
              </span>
              <wbr />
            </li>
          ))}
        </ul>
        <div className="reveal mt-12 grid gap-y-6 border-t border-line pt-8 lg:grid-cols-12 lg:gap-x-10">
          <p className="t-body max-w-[60ch] text-fg-2 lg:col-span-7">
            These are nearby areas to consider, not additional RAAGA branches.
            Check your journey at the intended class time. Further away, or outside Hyderabad? We teach the same syllabus live{' '}
            <Link href="/online-classes" className="link">
              online
            </Link>
            , and we have a second centre at{' '}
            <Link href={otherCentre.href} className="link">
              {otherCentre.label}
            </Link>
            .
          </p>
          <p className="lg:col-span-5 lg:justify-self-end">
            <Link href="/guides/choosing-singing-classes-hyderabad" className="link-arrow">
              What to look for when choosing singing classes in Hyderabad
              <Arrow />
            </Link>
          </p>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
