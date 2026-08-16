import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { SwaraDivider } from '@/components/ui/Ornament'
import { getSite, getCentres } from '@/data/content'

export const metadata: Metadata = {
  title: 'About — our heritage',
  description:
    'RAAGA was founded in 2016 in Jubilee Hills, Hyderabad to preserve, nurture and share Carnatic classical music — taught in the Guru–Shishya Parampara at two centres and online.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Parampara — the heritage behind RAAGA',
    description:
      'Founded in 2016 in Jubilee Hills, Hyderabad. Carnatic classical music taught in the Guru–Shishya Parampara, at two centres and online.',
    url: 'https://theraaga.in/about',
  },
}

const VISION = [
  'To preserve Carnatic classical music as a living practice rather than a preserved artefact.',
  'To nurture each student’s musicianship at the pace their own voice sets.',
  'To share this music widely — across Hyderabad, and with students anywhere in the world.',
]

const MISSION = [
  {
    title: 'Teach within the parampara',
    body: 'To transmit this music as it has always been transmitted — from teacher to student, by ear and by repetition, without shortcuts.',
  },
  {
    title: 'Build musical excellence',
    body: 'To hold students to the standards of the tradition in śruti, laya and bhāva, whatever stage they are at.',
  },
  {
    title: 'Instil discipline and devotion',
    body: 'To make daily practice a habit and to keep the devotional root of this repertoire present in how it is sung.',
  },
  {
    title: 'Deepen cultural appreciation',
    body: 'To teach what the compositions mean, who wrote them and why — so students inherit a culture, not only a technique.',
  },
]

/**
 * Parampara — Our Heritage.
 *
 * Four scannable sections rather than one continuous essay: Our Story, Our
 * Vision, Our Mission, The Guru–Shishya Parampara. The previous version was a
 * single wall of philosophy, which is the format nobody reads on a phone.
 */
export default async function AboutPage() {
  const site = await getSite()
  const centres = await getCentres()
  const physical = centres.filter((c) => c.key !== 'online')

  return (
    <>
      <PageHero
        eyebrow="Parampara · परम्परा · Our heritage"
        title="Music is experienced over a lifetime, not consumed in moments."
        lede={
          <p>
            RAAGA was founded in {site.foundedYear} in Jubilee Hills, Hyderabad,
            to preserve, nurture and share Carnatic classical music.
          </p>
        }
      />

      <Section id="story" eyebrow="Our story">
        <div className="u-measure space-y-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
          <p>
            The school began in {site.foundedYear} with a single conviction:
            that Carnatic classical music deserves to be taught properly, and
            that teaching it properly takes time. Not a term, not a course — a
            lifetime of listening, practice and gradual refinement.
          </p>
          <p>
            That conviction shapes everything here. Students are not moved
            through a syllabus to a deadline. They progress when their voice is
            ready, in the order this music has always been learned, with a
            teacher who knows exactly where they are.
          </p>
          <p>
            Today we teach at two centres in Hyderabad and online to students
            around the world — but the teaching itself has not changed, and it
            is not meant to.
          </p>
        </div>

        <div className="my-14">
          <SwaraDivider index={3} />
        </div>

        <blockquote className="u-measure font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] italic leading-[var(--lh-snug)]">
          “Every note carries a tradition. Every student carries it forward.”
        </blockquote>
      </Section>

      <Section id="vision" eyebrow="Our vision" title="What we are for." tone="surface">
        <ul className="grid gap-x-12 gap-y-8 md:grid-cols-3">
          {VISION.map((v, i) => (
            <li key={v}>
              <span
                aria-hidden="true"
                className="deva block text-[length:var(--text-step-2)] leading-none text-gold-hairline"
              >
                {['सा', 'ग', 'प'][i]}
              </span>
              <p className="mt-4 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
                {v}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mission" eyebrow="Our mission" title="What we do about it.">
        <ul className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          {MISSION.map((m, i) => (
            <li key={m.title}>
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
            Carnatic music is transmitted, not delivered. It moves from one
            person to another by ear and by repetition — a phrase sung, a phrase
            returned, corrected, returned again — and almost nothing about that
            process has needed to change in centuries.
          </p>
          <p>
            The Guru–Shishya Parampara is that relationship: a student learns
            from a teacher, over years, and in doing so inherits a particular
            line of phrasing, ornamentation and understanding. It is why we do
            not rotate students between instructors as they progress, and why
            teaching here is patient, individual, and shaped around the learner
            rather than the timetable.
          </p>
          <p>
            What has changed is access. A family in Gachibowli should not lose a
            Sunday morning to traffic to reach a teacher, and a student in New
            Jersey should not have to wait for a December visit to India to
            continue. So the teaching stays traditional and the delivery does
            not.
          </p>
        </div>
      </Section>

      <Section id="where" eyebrow="Where we teach" title="Two centres, and online.">
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
          work for the Gulf, the UK and North America.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
