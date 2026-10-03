import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { SwaraDivider } from '@/components/ui/Ornament'
import { StatementBand, NumberedRail, StickyAside } from '@/components/layout/Editorial'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { getSite, getStory, getVision, getMission } from '@/data/content'

export const metadata: Metadata = {
  title: 'About: Our Heritage',
  description:
    'RAAGA was founded in 2016 in Jubilee Hills, Hyderabad to preserve, nurture and share the timeless tradition of Carnatic Sangeetham, rooted in the Guru–Shishya Parampara.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Parampara: the heritage behind RAAGA',
    description:
      'Founded in 2016 in Jubilee Hills, Hyderabad. Carnatic Sangeetham taught in the Guru–Shishya Parampara, at two centres and online.',
    url: 'https://theraaga.in/about',
  },
}

/**
 * Parampara — Our Heritage.
 *
 * The story, the Vision and all five Mission headings are the CLIENT'S OWN
 * WORDS from their content master. An earlier draft invented a different vision
 * and a different four-point mission; both are replaced. Do not rewrite these
 * for tone — this is the one page where the school's self-description has to be
 * theirs.
 */
export default async function AboutPage() {
  const site = await getSite()
  const story = await getStory()
  const vision = await getVision()
  const mission = await getMission()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />
      <PageHero
        eyebrow="Parampara · परम्परा · Our heritage"
        title="Preserving, nurturing and sharing Carnatic Sangeetham."
        lede={
          <p>
            {site.shortName} was founded in {site.foundedYear} in{' '}
            {site.locality}, {site.city}.
          </p>
        }
      />

      <Section id="story" eyebrow="Our story">
        <div className="u-measure space-y-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
          {story.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        <div className="my-14">
          <SwaraDivider index={3} />
        </div>

        <blockquote className="u-measure font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] italic leading-[var(--lh-snug)]">
          ♪ {site.sanskritLine.roman} ♪
          <footer className="mt-3 font-[var(--font-ui)] text-[length:var(--text-step--1)] not-italic text-text-muted">
            {site.sanskritLine.gloss}
          </footer>
        </blockquote>
      </Section>

      <StatementBand eyebrow="Vision">{vision}</StatementBand>

      <Section id="mission" eyebrow="Mission" title="What we do about it.">
        <NumberedRail items={mission} />
      </Section>

      <Section id="parampara" tone="surface">
        <StickyAside
          label="The Guru–Shishya Parampara"
          aside={<p>Why the teaching is patient, individual, and shaped around the learner rather than the timetable.</p>}
        >
          <p>
            Carnatic Sangeetham is transmitted, not delivered. It moves from one
            person to another by ear and by repetition — a phrase sung, a phrase
            returned, corrected, returned again — and almost nothing about that
            process has needed to change in centuries.
          </p>
          <p>
            The Guru–Shishya Parampara is that relationship: a student learns
            from a Guru, over years, and in doing so inherits a particular line
            of phrasing, ornamentation and understanding. It is why teaching
            here is patient, individual, and shaped around the learner rather
            than the timetable.
          </p>
          <p>
            What has changed is access. A family in Gachibowli should not lose a
            Sunday morning to traffic to reach a Guru, and a student in New
            Jersey should not have to wait for a December visit to India to
            continue. So the teaching stays traditional and the delivery does
            not.
          </p>
        </StickyAside>
      </Section>

      <Section id="where" eyebrow="Where we teach" title="Two centres, and beyond.">
        <p className="u-measure text-text-secondary">
          We teach at our centres in{' '}
          <Link href="/music-classes/jubilee-hills" className="text-accent underline underline-offset-4">
            Jubilee Hills
          </Link>{' '}
          and{' '}
          <Link href="/music-classes/hitech-city" className="text-accent underline underline-offset-4">
            Hitech City
          </Link>
          , and{' '}
          <Link href="/online-classes" className="text-accent underline underline-offset-4">
            live online
          </Link>
          . Students outside Hyderabad learn with us live online, at times that
          work for the Gulf, the UK and North America. We also teach classes
          hosted within residential communities.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
