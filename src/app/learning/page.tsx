import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { CurriculumTimeline } from '@/components/sections/CurriculumTimeline'
import { ExploreLearningGoals } from '@/components/sections/ExploreLearningGoals'
import { FinalCta } from '@/components/sections/FinalCta'
import { ButtonLink } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { getAcademicPathways, getPerformanceStrands } from '@/data/content'

export const metadata: Metadata = {
  title: 'Carnatic Music Courses & Vocal Syllabus',
  description:
    'The full Carnatic music and vocal syllabus taught at RAGA, Hyderabad. Sarali Swaras through to Manodharma Sangeetham, with academic pathways and concert training.',
  alternates: { canonical: '/learning' },
  openGraph: {
    title: 'Sādhana: The Carnatic vocal syllabus at RAGA',
    description:
      'Ten stages from Sarali Swaras to Manodharma Sangeetham, published in full. Plus Certificate, Diploma and degree pathways, and concert training.',
    url: 'https://theraaga.in/learning',
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
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Carnatic Music Courses', href: '/learning' },
        ]}
      />
      <PageHero
        eyebrow="Sādhana · साधना · Journey of learning"
        title="Sa. Pa. Sa. — the foundation of every musical journey."
        lede={
          <p>
            The timeless resonance every student begins with. From a first
            lesson through to improvisation, learning here develops four things
            at once:{' '}
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

      <ExploreLearningGoals />

      <Section
        id="sangeetha-vidwat-patham"
        eyebrow="Sangeetha Vidwat Pātham"
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
        <ul className="grid gap-4 sm:grid-cols-2">
          {pathways.map((p) => (
            <li key={p.order} className="rounded-[var(--radius-md)] border border-border bg-[color-mix(in_srgb,var(--color-elevated)_74%,transparent)] p-7 shadow-[0_10px_24px_rgba(71,49,34,0.05)] md:p-9">
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
        id="sangeetha-vedika"
        eyebrow="Sangeetha Vedika"
        title="The stage."
        lede={
          <p>
            A student who has performed once practises differently forever.
            Performance is a strand of the teaching here, not an extra.
          </p>
        }
        renderIf={strands.length > 0}
      >
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {strands.map((s) => (
            <li key={s.order} className="rounded-[var(--radius-md)] border border-border bg-[color-mix(in_srgb,var(--color-surface)_76%,transparent)] p-6 md:p-7">
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
