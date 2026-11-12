import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { IndexList, LinkRows } from '@/components/layout/Editorial'
import { Arrow, ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { BASE_URL, JsonLd } from '@/components/seo/Schema'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { getAreas, getCentre, getCentres } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'
import type { Area } from '@/content/seed/areas'
import type { Centre } from '@/content/types'

/**
 * One page per neighbourhood RAAGA serves without a branch there, rendered by
 * /music-classes/[centre] when the segment names an area rather than a centre.
 *
 * The page is built around the one fact the centre pages cannot carry: how a
 * family in this place actually gets to a class. It opens on that fact, puts
 * the nearest centre and its journey on the dark stage, then says what to do
 * when the journey does not fit. Everything else (which class to ask about,
 * the trial) is the same navigation every classes page ends on. See
 * `content/seed/areas.ts` for what these pages may and may not claim.
 */
export async function areaMetadata(area: Area): Promise<Metadata> {
  const url = `/music-classes/${area.slug}`
  return {
    title: area.title,
    description: area.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${area.title} at RAAGA`,
      description: area.description,
      url: `${BASE_URL}${url}`,
      images: defaultOgImages,
    },
  }
}

const shortLocality = (c: Centre) => c.locality?.replace(', Hyderabad', '') ?? c.name

export async function AreaPage({ area }: { area: Area }) {
  const [nearest, alsoNear, centres, areas] = await Promise.all([
    getCentre(area.nearest),
    area.alsoNear ? getCentre(area.alsoNear) : Promise.resolve(undefined),
    getCentres(),
    getAreas(),
  ])
  if (!nearest) return null
  const url = `/music-classes/${area.slug}`
  const place = area.prose ?? area.name

  const neighbourLinks = area.neighbours
    .map((slug) => {
      const centre = centres.find((c) => c.slug === slug)
      if (centre) return { href: centre.href, label: `Classes in ${shortLocality(centre)}` }
      const other = areas.find((a) => a.slug === slug)
      return other ? { href: `/music-classes/${other.slug}`, label: `Near ${other.prose ?? other.name}` } : null
    })
    .filter((l): l is { href: string; label: string } => l !== null)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}${url}#webpage`,
    url: `${BASE_URL}${url}`,
    name: `${area.title} | RAAGA`,
    description: area.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#institute` },
    // The place this page is about, and the centre it points to.
    spatialCoverage: { '@type': 'Place', name: `${area.name}, Hyderabad` },
    mainEntity: { '@id': `${BASE_URL}/#centre-${nearest.key}` },
  }

  return (
    <>
      <JsonLd data={schema} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Classes across Hyderabad', href: '/music-classes' },
          { name: `Near ${place}`, href: url },
        ]}
      />
      <PageHero
        variant="statement"
        eyebrow={`${area.name} · Hyderabad`}
        title={
          <>
            Carnatic music classes near <em>{place}.</em>
          </>
        }
        lede={<p>{area.intro}</p>}
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
        <WhatsAppLink location={`area_${area.slug.replace(/-/g, '_')}`} className="btn btn-secondary">
          <WhatsAppIcon />
          Ask on WhatsApp
        </WhatsAppLink>
      </PageHero>

      {/* The journey, on the dark stage: the nearest centre set large, the
          realistic trip beside it. */}
      <Section
        id="nearest"
        tone="night"
        layout="split"
        eyebrow="Your nearest centre"
        title={`From ${place} to ${nearest.name}`}
      >
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="reveal lg:col-span-6">
            <p className="t-statement text-fg">
              <span className="block text-balance">
                RAAGA, {shortLocality(nearest)}
              </span>
              <span className="block text-fg-2">{area.distance} from {place}</span>
            </p>
            {alsoNear && (
              <p className="t-body mt-6 max-w-[44ch] text-fg-2">
                {alsoNear.name}, {shortLocality(alsoNear)} is a comparable journey, so
                compare both at your class time.
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={nearest.href} className="btn btn-secondary">
                Classes at {shortLocality(nearest)}
                <Arrow />
              </Link>
              {nearest.mapsUrl && (
                <a
                  className="btn btn-secondary"
                  href={nearest.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Directions in Google Maps
                  <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          <div className="reveal space-y-5 border-t border-line pt-8 lg:col-span-5 lg:col-start-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="t-standfirst text-fg-2">{area.travel}</p>
            <p className="t-body text-fg-2">
              {nearest.streetAddress
                ? `The centre is at ${[nearest.streetAddress, shortLocality(nearest), ['Hyderabad', nearest.postalCode].filter(Boolean).join(' ')].join(', ')}.`
                : `Classes are held at ${nearest.name} in ${shortLocality(nearest)}. Ask RAAGA to confirm the meeting point and class time before travelling.`}
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="alternatives"
        tone="sand"
        eyebrow="If the journey does not fit"
        title="Learn from where you are."
        layout="split"
      >
        <div className="reveal max-w-[60ch] space-y-5">
          <p className="t-standfirst text-fg-2">{area.alternative}</p>
          <p className="t-body text-fg-2">
            Read about{' '}
            <Link href="/online-classes" className="link">
              live online Carnatic classes
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="link">
              ask about a class hosted in your community
            </Link>
            . A community class is arranged with the community itself, so we do
            not publish where or when these run.
          </p>
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
          sangeetham, in batches of no more than six. The{' '}
          <Link href="/learning" className="link">
            published syllabus
          </Link>{' '}
          shows how the first swara exercises lead into compositions.
        </p>
      </Section>

      <Section
        id="nearby"
        eyebrow="Also coming from"
        title="Nearby neighbourhoods."
        layout="rail"
        renderIf={neighbourLinks.length > 0}
      >
        <LinkRows
          links={[
            ...neighbourLinks,
            { href: '/music-classes', label: 'Every way to learn across Hyderabad' },
          ]}
        />
      </Section>

      <FinalCta />
    </>
  )
}
