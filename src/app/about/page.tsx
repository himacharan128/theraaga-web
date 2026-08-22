import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { SwaraDivider } from '@/components/ui/Ornament'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { getSite, getCentres, getStory, getVision, getMission } from '@/data/content'

export const metadata: Metadata = {
  title: 'About: Our Heritage',
  description:
    'RAGA was founded in 2016 in Jubilee Hills, Hyderabad to preserve, nurture and share the timeless tradition of Carnatic Sangeetham, rooted in the Guru–Shishya Parampara.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Parampara: the heritage behind RAGA',
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
  const centres = await getCentres()
  const story = await getStory()
  const vision = await getVision()
  const mission = await getMission()
  const physical = centres.filter((c) => c.slug)

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

      <Section id="vision" eyebrow="Vision" tone="surface">
        <p className="u-measure text-[length:var(--text-step-2)] font-[300] leading-[var(--lh-snug)] text-text-primary">
          {vision}
        </p>
      </Section>

      <Section id="mission" eyebrow="Mission" title="What we do about it.">
        <ul className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          {mission.map((m, i) => (
            <li key={m.order}>
              {i > 0 && (
                <div className="mb-8 md:hidden">
                  <SwaraDivider index={i} />
                </div>
              )}
              <h2 className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-accent">
                {m.title}
              </h2>
              <p className="u-measure mt-3 text-text-secondary">{m.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="parampara"
        eyebrow="The Guru–Shishya Parampara"
        title="Why we teach this way."
        tone="surface"
      >
        <div className="u-measure space-y-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
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
        </div>
      </Section>

      <Section id="where" eyebrow="Where we teach" title="Two centres, and beyond.">
        <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {physical.map((c) => (
            <li key={c.key} className="bg-surface p-7 md:p-9">
              <h2 className="text-[length:var(--text-step-2)] font-[300]">
                {c.name}
              </h2>
              {c.locality && (
                <p className="mt-1 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                  {c.locality}
                </p>
              )}
              <p className="mt-4 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="u-measure mt-8 text-text-secondary">
          Students outside Hyderabad learn with us live online, at times that
          work for the Gulf, the UK and North America. We also teach classes
          hosted within residential communities.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
