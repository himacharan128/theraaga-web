import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { Faq } from '@/components/sections/Faq'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { whatsappHref } from '@/lib/whatsapp'
import { getCentreBySlug, getCentres } from '@/data/content'

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
  const title = `Carnatic music classes in ${centre.name}`
  const description = `Carnatic vocal classes at ${where} — for children and adults, beginners welcome. Taught in the traditional order from Sarali Swaras to Manodharma Sangeetham.`

  return {
    title,
    description,
    alternates: { canonical: `/music-classes/${slug}` },
    openGraph: {
      title: `${title} · RAAGA`,
      description,
      url: `https://theraaga.in/music-classes/${slug}`,
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
      <PageHero
        eyebrow={centre.locality ?? centre.name}
        title={`Carnatic vocal classes at ${centre.name}.`}
        lede={
          <p>
            {centre.body} For children from five and adults beginning at any
            age — no previous training needed.
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

      <Section
        id="nearby"
        eyebrow="Also serving"
        title="Easy to reach from."
        tone="surface"
        renderIf={centre.nearby.length > 0}
      >
        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {centre.nearby.map((n) => (
            <li
              key={n}
              className="border border-border bg-bg px-4 py-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-secondary"
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

      <Faq />
      <ContactBlock />
      <EnquirySection />
    </>
  )
}
