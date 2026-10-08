import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { StatementBand, NumberedRail } from '@/components/layout/Editorial'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { getSite, getStory, getVision, getMission } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'About: Our Heritage',
  description:
    'RAAGA was founded in 2016 in Jubilee Hills, Hyderabad to preserve, nurture and share the timeless tradition of Carnatic Sangeetham, rooted in the Guru-Shishya Parampara.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Parampara: the heritage behind RAAGA',
    description:
      'Founded in 2016 in Jubilee Hills, Hyderabad. Carnatic Sangeetham taught in the Guru-Shishya Parampara, at two centres and online.',
    url: 'https://theraaga.in/about',
    images: defaultOgImages,
  },
}

/**
 * Parampara: Our Heritage.
 *
 * The story, the Vision and all five Mission headings are the CLIENT'S OWN
 * WORDS from their content master. An earlier draft invented a different vision
 * and a different four-point mission; both are replaced. Do not rewrite these
 * for tone: this is the one page where the school's self-description has to be
 * theirs.
 *
 * Composed as a long read in six movements, each with its own silhouette so
 * the page paces like an essay rather than a stack of blocks: the statement
 * hero; the story beside the year it begins in, closing on the Sanskrit line;
 * the Vision alone on the dark stage; the Mission as a numbered rule; the
 * Guru-Shishya Parampara as the page's centre, set ceremonially on sand; and
 * where the teaching happens now. No photograph: the page is about an idea,
 * and the only people pictured elsewhere on the site are at named events.
 */
export default async function AboutPage() {
  const [site, story, vision, mission] = await Promise.all([
    getSite(),
    getStory(),
    getVision(),
    getMission(),
  ])
  const [opening, ...rest] = story

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />
      <PageHero
        variant="statement"
        eyebrow="Parampara · परम्परा · Our heritage"
        title={
          <>
            Preserving, nurturing and sharing <em>Carnatic Sangeetham.</em>
          </>
        }
        lede={
          <p>
            {site.shortName} was founded in {site.foundedYear} in{' '}
            {site.locality}, {site.city}.
          </p>
        }
      />

      {/* The story, read beside the year it begins in. The founding sentence
          is set as a statement; what follows steps down to the standfirst. */}
      <section id="story" data-section="story" data-has-content="true" className="pad-section">
        <div className="u-shell grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="reveal lg:col-span-3">
            <h2 className="kicker">Our story</h2>
            <p
              aria-hidden="true"
              className="t-numeral mt-8 hidden text-[clamp(4.5rem,7.5vw,7rem)] text-accent-muted lg:block"
            >
              {site.foundedYear}
            </p>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            {opening && <p className="reveal t-statement text-pretty text-fg">{opening}</p>}
            {rest.map((para, i) => (
              <p
                key={para.slice(0, 24)}
                className="reveal t-standfirst mt-8 max-w-[44ch] text-fg-2"
                style={{ '--i': i + 1 } as CSSProperties}
              >
                {para}
              </p>
            ))}

            {/* The school's line, in its own script first. */}
            <figure className="reveal mt-16 border-t border-line pt-10 md:mt-20 md:pt-12">
              <blockquote>
                <p lang="sa" className="deva text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.25] text-fg">
                  {site.sanskritLine.devanagari}
                </p>
                <p className="t-subhead mt-2 italic text-fg">{site.sanskritLine.roman}</p>
              </blockquote>
              <figcaption className="t-small mt-4 text-fg-3">{site.sanskritLine.gloss}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <StatementBand eyebrow="Vision">{vision}</StatementBand>

      <Section id="mission" layout="split" eyebrow="Mission" title="What we do about it.">
        <NumberedRail items={mission} />
      </Section>

      {/* The page's centre. The Guru-Shishya Parampara is the idea everything
          else on the site rests on, so it is the one chapter set
          ceremonially: the word in Devanagari at full scale, the name, the
          argument in a single reading column beneath. */}
      <section id="parampara" data-section="parampara" data-has-content="true" className="tone-sand pad-section">
        <div className="u-shell">
          <header className="reveal mx-auto max-w-4xl text-center">
            <p
              aria-hidden="true"
              lang="sa"
              className="deva text-[clamp(3.5rem,1.9rem+6vw,7rem)] leading-[1.2] text-accent"
            >
              परम्परा
            </p>
            <h2 className="t-display mt-3 text-balance text-fg md:mt-4">The Guru-Shishya Parampara</h2>
            <p className="t-standfirst mx-auto mt-6 max-w-[40ch] italic text-fg-2">
              Why the teaching is patient, individual, and shaped around the
              learner rather than the timetable.
            </p>
          </header>

          <div aria-hidden="true" className="reveal mx-auto mt-12 flex max-w-xs items-center gap-4 md:mt-16">
            <span className="h-px flex-1 bg-mark" />
            <span className="size-1.5 rotate-45 bg-mark" />
            <span className="h-px flex-1 bg-mark" />
          </div>

          <div className="mx-auto mt-12 max-w-[62ch] md:mt-16">
            <p className="reveal t-standfirst text-fg">
              Carnatic Sangeetham is transmitted, not delivered. It moves from one
              person to another by ear and by repetition (a phrase sung, a phrase
              returned, corrected, returned again), and almost nothing about that
              process has needed to change in centuries.
            </p>
            <p className="reveal t-prose mt-6 text-fg-2">
              The Guru-Shishya Parampara is that relationship: a student learns
              from a Guru, over years, and in doing so inherits a particular line
              of phrasing, ornamentation and understanding. It is why teaching
              here is patient, individual, and shaped around the learner rather
              than the timetable.
            </p>
            <p className="reveal t-prose mt-6 text-fg-2">
              What has changed is access. A family in Gachibowli should not lose a
              Sunday morning to traffic to reach a Guru, and a student in New
              Jersey should not have to wait for a December visit to India to
              continue. So the teaching stays traditional and the delivery does
              not.
            </p>
          </div>
        </div>
      </section>

      <Section id="where" layout="rail" eyebrow="Where we teach" title="Two centres, and beyond.">
        <p className="reveal t-standfirst max-w-[44ch] text-fg-2">
          We teach at our centres in{' '}
          <Link href="/music-classes/jubilee-hills" className="link">
            Jubilee Hills
          </Link>{' '}
          and{' '}
          <Link href="/music-classes/hitech-city" className="link">
            Hitech City
          </Link>
          , and{' '}
          <Link href="/online-classes" className="link">
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
