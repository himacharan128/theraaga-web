import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { CurriculumTimeline } from '@/components/sections/CurriculumTimeline'
import { FinalCta } from '@/components/sections/FinalCta'
import { ButtonLink } from '@/components/ui/Button'
import { SwaraDivider } from '@/components/ui/Ornament'
import { getAcademicPathways, getPerformanceStrands } from '@/data/content'

export const metadata: Metadata = {
  title: 'Courses — the Carnatic vocal syllabus',
  description:
    'The full Carnatic vocal syllabus taught at RAAGA, Hyderabad — Sarali Swaras through to Manodharma Sangeetham, with academic pathways and concert training. Classes in Jubilee Hills, Hitech City and online.',
  alternates: { canonical: '/courses' },
  openGraph: {
    title: 'Sādhana — the Carnatic vocal syllabus at RAAGA',
    description:
      'Ten stages from Sarali Swaras to Manodharma Sangeetham, published in full. Plus Certificate, Diploma and degree pathways, and concert training.',
    url: 'https://theraaga.in/courses',
  },
}

/**
 * Sādhana. The home for the detailed curriculum, moved off the homepage where
 * it made the page read as a prospectus.
 *
 * This is the page that earns the search traffic and the credibility, because
 * almost no competitor publishes their actual syllabus — and it is entirely
 * true with zero client content.
 */
export default async function CoursesPage() {
  const pathways = await getAcademicPathways()
  const strands = await getPerformanceStrands()

  return (
    <>
      <PageHero
        eyebrow="Sādhana · साधना · Journey of learning"
        title="What you will learn, in the order it has always been taught."
        lede={
          <p>
            Carnatic vocal for children and adults, from a first lesson through
            to improvisation. Learning here develops four things at once:{' '}
            <strong className="font-[400] text-text-primary">śruti</strong>, the
            ear for pitch;{' '}
            <strong className="font-[400] text-text-primary">laya</strong>, the
            sense of rhythm;{' '}
            <strong className="font-[400] text-text-primary">bhāva</strong>, the
            expression that gives a phrase meaning; and the confidence to sing
            in front of other people.
          </p>
        }
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
      </PageHero>

      <CurriculumTimeline />

      <Section
        id="vidwat-patham"
        eyebrow="Vidwat Pātham"
        title="Academic pathways."
        tone="surface"
        lede={
          <p>
            For students who want the qualification as well as the music, we
            prepare and guide candidates through formal music study.
          </p>
        }
        renderIf={pathways.length > 0}
      >
        <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {pathways.map((p) => (
            <li key={p.order} className="bg-surface p-7 md:p-9">
              <h3 className="text-[length:var(--text-step-1)] font-[400] text-accent">
                {p.name}
              </h3>
              <p className="mt-3 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="u-measure mt-8 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted">
          Speak to us about which pathway suits your stage of learning, and
          which examining bodies we currently prepare students for.
        </p>
      </Section>

      <Section
        id="kala-pradarsanam"
        eyebrow="Kala Pradarśanam"
        title="Performance and concert training."
        lede={
          <p>
            A student who has performed once practises differently forever.
            Performance is a strand of the teaching here, not an extra.
          </p>
        }
        renderIf={strands.length > 0}
      >
        <ul className="grid gap-x-14 gap-y-9 md:grid-cols-2">
          {strands.map((s, i) => (
            <li key={s.order}>
              {i > 0 && (
                <div className="mb-7 md:hidden">
                  <SwaraDivider index={i} />
                </div>
              )}
              <h3 className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)]">
                {s.name}
              </h3>
              <p className="u-measure mt-2 text-text-secondary">{s.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  )
}
