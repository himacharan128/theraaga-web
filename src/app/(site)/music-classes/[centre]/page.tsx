import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
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
        eyebrow={centre.locality ?? centre.name}
        title={`Carnatic music classes in ${centre.locality ?? centre.name}.`}
        lede={
          <p>
            {centre.body} RAAGA teaches Carnatic music and vocal classes for
            children from five and adults beginning at any age. No previous
            training needed.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Book a trial</ButtonLink>
          <ButtonLink
            variant="secondary"
            href={whatsappHref(slug.toUpperCase())}
          >
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <CurrentBatches />
      <Section id="directions" eyebrow="Plan your visit" title={`Learning at ${centre.name}`}>
        {centre.streetAddress ? <>
          <address className="not-italic text-xl leading-8">{centre.streetAddress}<br />{centre.locality}, Telangana {centre.postalCode}</address>
          {centre.mapsUrl && <a className="mt-5 inline-block text-accent underline underline-offset-4" href={centre.mapsUrl} target="_blank" rel="noopener noreferrer">Get directions in Google Maps</a>}
        </> : <p className="u-measure text-text-secondary">Classes are held at Phoenix Arena in Hitech City. Ask RAAGA to confirm the meeting point and class time before travelling to the venue.</p>}
        <p className="u-measure mt-6 text-text-secondary">
          {slug === 'jubilee-hills'
            ? 'Our founding centre has taught Carnatic vocal music since 2016. If you are comparing singing classes around Jubilee Hills, start with the kind of music you want to learn and a class you can attend regularly.'
            : 'For learners around Madhapur, Gachibowli and Kondapur, Phoenix Arena is our Hitech City option. Compare the journey from home or work at your intended class time before choosing a centre.'}
        </p>
        <p className="u-measure mt-4 text-text-secondary">Share your available days, whether you are starting or returning, and your preferred centre. The team will confirm current teacher and batch availability; a visit is best arranged in advance.</p>
      </Section>

      <Section id="learning-options" title="Which class should you ask about?" tone="surface">
        <ul className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Starting from the beginning', href: '/carnatic-music-classes/beginners', body: 'Begin with swaras, pitch and rhythm. No previous musical training is needed.' },
            { title: 'Lessons for children', href: '/carnatic-music-classes/children', body: 'RAAGA welcomes children from five. Read what parents can ask about readiness, class participation and practice.' },
            { title: 'Adult beginners and returners', href: '/carnatic-music-classes/adults', body: 'Starting now or returning after a break? Discuss your previous learning and a class that fits your routine.' },
          ].map((path) => <li key={path.href} className="border-t border-border pt-5">
            <h3 className="text-xl"><Link href={path.href} className="text-accent underline underline-offset-4">{path.title}</Link></h3>
            <p className="mt-3 text-text-secondary">{path.body}</p>
          </li>)}
        </ul>
        <p className="u-measure mt-8 text-text-secondary">Our teaching is Carnatic classical vocal, also called Carnatic sangeetham. The <Link href="/learning" className="text-accent underline underline-offset-4">published syllabus</Link> shows how foundational exercises lead into compositions and advanced study.</p>
      </Section>

      <Section
        id="nearby"
        eyebrow="Choosing a centre"
        title="Coming from a nearby neighbourhood?"
        renderIf={centre.nearby.length > 0}
      >
        <ul className="flex flex-wrap gap-2">
          {centre.nearby.map((n) => (
            <li
              key={n}
              className="rounded-full border border-border-strong px-4 py-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-secondary"
            >
              {n}
            </li>
          ))}
        </ul>
        <p className="u-measure mt-8 text-text-secondary">
          These are nearby areas to consider, not additional RAAGA branches.
          Check your journey at the intended class time. Further away, or outside Hyderabad? We teach the same syllabus live{' '}
          <a href="/online-classes" className="text-accent underline underline-offset-4">
            online
          </a>
          , and we have a second centre at{' '}
          <Link href={otherCentre.href} className="text-accent underline underline-offset-4">{otherCentre.label}</Link>.
        </p>
        <p className="mt-5"><Link href="/guides/choosing-singing-classes-hyderabad" className="text-accent underline underline-offset-4">What to look for when choosing singing classes in Hyderabad</Link></p>
      </Section>

      <FinalCta />
    </>
  )
}
