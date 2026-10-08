import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { PageHero, type HeroIndexEntry } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ProgrammeList } from '@/components/layout/Editorial'
import { CurriculumTimeline } from '@/components/sections/CurriculumTimeline'
import { ExploreLearningGoals } from '@/components/sections/ExploreLearningGoals'
import { FinalCta } from '@/components/sections/FinalCta'
import { ButtonLink } from '@/components/ui/Button'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import {
  getAcademicPathways,
  getCurriculum,
  getPerformanceStrands,
  getSeoLandingPages,
} from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'Carnatic Music Courses & Vocal Syllabus',
  description:
    'The full Carnatic music and vocal syllabus taught at RAAGA, Hyderabad. Sarali Swaras through to Manodharma Sangeetham, with academic pathways and concert training.',
  alternates: { canonical: '/learning' },
  openGraph: {
    title: 'Sādhana: The Carnatic vocal syllabus at RAAGA',
    description:
      'Ten stages from Sarali Swaras to Manodharma Sangeetham, published in full. Plus Certificate, Diploma and degree pathways, and concert training.',
    url: 'https://theraaga.in/learning',
    images: defaultOgImages,
  },
}

/**
 * Sādhana. The home for the detailed curriculum, moved off the homepage where
 * it made the page read as a prospectus.
 *
 * This is the page that earns the search traffic and the credibility, because
 * almost no competitor publishes their actual syllabus, and it is entirely
 * true with zero client content.
 *
 * It opens as a contents page, since it is long and read in parts: the title
 * on the left, the four chapters indexed on the right. Then the journey on
 * the light ground, the starting points on the dark stage, the qualifications
 * set as a rising stair, and the stage itself as a concert programme on sand.
 */
export default async function CoursesPage() {
  const [curriculum, goals, pathways, strands] = await Promise.all([
    getCurriculum(),
    getSeoLandingPages(),
    getAcademicPathways(),
    getPerformanceStrands(),
  ])

  // The index lists only chapters that render, so no link points at nothing.
  const index: HeroIndexEntry[] = [
    curriculum.length > 0 && { href: '#sangeetha-margam', label: 'The musical journey' },
    goals.length > 0 && { href: '#learning-goals', label: 'Find your starting point' },
    pathways.length > 0 && { href: '#sangeetha-vidwat-patham', label: 'Academic pathways' },
    strands.length > 0 && { href: '#sangeetha-vedika', label: 'The stage' },
  ].filter((entry): entry is HeroIndexEntry => Boolean(entry))

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Carnatic Music Courses', href: '/learning' },
        ]}
      />
      <PageHero
        variant="archive"
        eyebrow="Sādhana · साधना · Journey of learning"
        title={
          <>
            <em className="block text-accent">Sa. Pa. Sa.</em> The foundation of every musical journey.
          </>
        }
        lede={
          <p>
            The timeless resonance every student begins with. From a first
            lesson through to improvisation, learning here develops four things
            at once: <strong className="font-normal text-fg">śruti</strong>, the
            ear for pitch; <strong className="font-normal text-fg">laya</strong>,
            the sense of rhythm;{' '}
            <strong className="font-normal text-fg">bhāva</strong>, the
            expression that gives a phrase meaning; and the confidence to sing
            in front of other people.
          </p>
        }
        index={index}
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
      </PageHero>

      <CurriculumTimeline />
      <ExploreLearningGoals />

      <Section
        id="sangeetha-vidwat-patham"
        eyebrow="Sangeetha Vidwat Pātham"
        title="Academic pathways."
        layout="split"
        lede={
          <p>
            For students who want the qualification as well as the music, we
            prepare and guide candidates through formal music study.
          </p>
        }
        renderIf={pathways.length > 0}
      >
        {/* The four qualifications climb: each tread sits higher than the
            last on a wide screen, so the order reads as an ascent. */}
        <ol className="grid gap-y-10 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:items-start">
          {pathways.map((p, i) => (
            <li
              key={p.order}
              className="reveal"
              style={{ '--i': i, '--step': pathways.length - 1 - i } as CSSProperties}
            >
              <div className="border-t border-mark pt-6 lg:mt-[calc(var(--step)*3.5rem)]">
                <span aria-hidden="true" className="t-numeral block text-[2.5rem] text-accent-muted md:text-[3rem]">
                  {String(p.order).padStart(2, '0')}
                </span>
                <h3 className="t-title mt-5 text-fg">{p.name}</h3>
                <p className="t-body mt-3 max-w-[40ch] text-fg-2">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="reveal t-caption mt-12 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:mt-16 md:text-[1.0625rem]">
          Speak to us about which pathway suits your stage of learning, and
          which examining bodies we currently prepare students for.
        </p>
      </Section>

      <Section
        id="sangeetha-vedika"
        tone="sand"
        layout="split"
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
        <ProgrammeList items={strands.map((s) => ({ key: s.order, title: s.name, body: s.body }))} />
      </Section>

      <FinalCta />
    </>
  )
}
