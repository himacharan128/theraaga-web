import type { Metadata } from 'next'
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
 * The Hyderabad organic SERP is technically weak — Philips School of Music runs
 * a locality×instrument URL grid with no structured data and no meta
 * descriptions, and Sangeet Music Academy's Hyderabad page is ~400 words with
 * no schema. Winnable, but a months-2-3 play: for the first leads the Google
 * Business Profile and WhatsApp will out-deliver organic.
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
  const description = `Carnatic music and vocal classes at RAAGA in ${where} for children and adults. Beginners welcome. Taught in the traditional order from Sarali Swaras to Manodharma Sangeetham.`

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

  return (
    <>
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
      {centre.streetAddress && <Section id="directions" eyebrow="Plan your visit" title={`Visit RAAGA in ${centre.name}`}><address className="not-italic text-xl leading-8">{centre.streetAddress}<br />{centre.locality}, Telangana {centre.postalCode}</address><p className="mt-4 text-text-secondary">Contact the school to confirm your class time before travelling.</p>{centre.mapsUrl && <a className="mt-5 inline-block text-accent underline underline-offset-4" href={centre.mapsUrl} target="_blank" rel="noopener noreferrer">Open the supplied location in Google Maps →</a>}</Section>}

      <Section
        id="nearby"
        eyebrow="Also serving"
        title="Easy to reach from."
        tone="surface"
        renderIf={centre.nearby.length > 0}
      >
        <ul className="flex flex-wrap gap-2">
          {centre.nearby.map((n) => (
            <li
              key={n}
              className="rounded-full border border-border-strong bg-[color-mix(in_srgb,var(--color-elevated)_72%,transparent)] px-4 py-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-secondary shadow-[0_6px_14px_rgba(71,49,34,0.04)]"
            >
              {n}
            </li>
          ))}
        </ul>
        <p className="u-measure mt-8 text-text-secondary">
          Further away, or outside Hyderabad? We teach the same syllabus live{' '}
          <a href="/online-classes" className="text-accent underline underline-offset-4">
            online
          </a>
          , and we have a second centre at{' '}
          {slug === 'jubilee-hills' ? 'Hitech City' : 'Jubilee Hills'}.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
