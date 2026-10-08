import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { IndexList, LinkRows } from '@/components/layout/Editorial'
import { ButtonLink } from '@/components/ui/Button'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'Start Carnatic Music Classes in Hyderabad: A Learner’s Guide',
  description: 'Choosing Carnatic vocal classes for yourself or your child? Explore RAAGA’s learning path, Hyderabad centres, online lessons and how to enquire about a trial.',
  alternates: { canonical: '/getting-started' },
  openGraph: { title: 'Getting started with Carnatic music at RAAGA', description: 'Choose a learning format, understand the syllabus and prepare your questions for RAAGA.', url: 'https://theraaga.in/getting-started', images: defaultOgImages },
}
const FORMATS = [
  {
    title: 'Learn in Jubilee Hills',
    href: '/music-classes/jubilee-hills',
    body: 'Explore our founding Hyderabad centre, where RAAGA has taught since 2016.',
  },
  {
    title: 'Learn at Phoenix Arena',
    href: '/music-classes/hitech-city',
    body: 'Explore our Hitech City learning option and enquire about a suitable class.',
  },
  {
    title: 'Learn live online',
    href: '/online-classes',
    body: 'Ask about a class that works for your time zone and current level.',
  },
  {
    title: 'Explore the learning path',
    href: '/learning',
    body: 'See the traditional progression from foundational swaras to advanced music.',
  },
]

const QUESTIONS = [
  'Which teacher and batch suit my current level?',
  'What class times are available at my chosen centre or online?',
  'How should I practise between lessons?',
  'What should I prepare for the trial?',
  'How are performance opportunities or academic preparation introduced?',
]

/**
 * The closing ask is the shared FinalCta below; this page deliberately has no
 * second "ready to speak with the school?" block of its own.
 *
 * Read as a short guide in five movements, each with its own shape: the
 * formats as a contents page, the beginner's note in a rail on sand, the
 * syllabus as a single paragraph, the questions as a numbered list on the
 * dark stage, and the goals in a rail.
 */
export default function GettingStartedPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Getting started', href: '/getting-started' }]} />
      <PageHero
        eyebrow="Your first step"
        title="Finding the right Carnatic music class."
        lede={<p>A practical guide for adults starting for themselves and parents choosing lessons for a child. RAAGA teaches Carnatic vocal music in Hyderabad and live online.</p>}
      />

      <Section id="formats" eyebrow="Choose a format" title="Where would you like to learn?" layout="split">
        <IndexList items={FORMATS.map((f) => ({ ...f, action: 'Explore' }))} />
      </Section>

      <Section id="beginners" title="Starting without previous training" tone="sand" layout="rail">
        <p className="reveal t-standfirst max-w-[52ch] text-fg-2">
          You can enquire as a beginner. Tell RAAGA whether you are learning for yourself or choosing classes for a child, your preferred location or online format, and the times you can attend. If you have studied before, describe the exercises or compositions you have learned so the teacher can discuss an appropriate starting point.
        </p>
        <LinkRows
          className="reveal mt-10"
          links={[
            { label: 'Beginner classes', href: '/carnatic-music-classes/beginners' },
            { label: 'Classes for children', href: '/carnatic-music-classes/children' },
            { label: 'Adult beginners and returners', href: '/carnatic-music-classes/adults' },
          ]}
        />
      </Section>

      <Section id="syllabus" title="What the syllabus covers" layout="split">
        <div className="reveal lg:grid lg:grid-cols-12 lg:gap-x-10">
          <p className="t-prose max-w-[60ch] text-fg-2 lg:col-span-7 lg:col-start-6">
            RAAGA’s published progression begins with Sarali Swaras, Janta Swaras and Alankaras. Students then work through compositions including Geetams, Swarajatis, Varnams, Keertanas and Kritis. Advanced learning includes Manodharma Sangeetham. Progress depends on the learner and the teacher’s guidance; a list of stages is not a promise of a fixed completion date.
          </p>
          <div className="mt-8 lg:col-span-7 lg:col-start-6">
            <ButtonLink variant="secondary" href="/learning">Read the complete Carnatic syllabus</ButtonLink>
          </div>
        </div>
      </Section>

      <Section id="questions" title="Questions to ask before joining" tone="night" layout="center">
        <ol className="mx-auto max-w-3xl border-t border-line">
          {QUESTIONS.map((q, i) => (
            <li
              key={q}
              className="reveal grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 border-b border-line py-6 md:grid-cols-[4rem_1fr] md:py-7"
              style={{ '--i': i % 4 } as CSSProperties}
            >
              <span aria-hidden="true" className="t-numeral text-[1.25rem] text-kicker md:text-[1.5rem]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t-title text-fg">{q}</span>
            </li>
          ))}
        </ol>
        <p className="reveal t-caption mx-auto mt-10 max-w-3xl border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">
          For a child’s enquiry, provide the parent or guardian’s contact details and an age band. The website does not need the child’s name or date of birth.
        </p>
      </Section>

      <Section id="goals" title="Academic and performance goals" layout="rail">
        <p className="reveal t-standfirst max-w-[52ch] text-fg-2">
          RAAGA offers guidance for students pursuing certificate, diploma and degree pathways, alongside performance preparation. Ask the team about your intended programme and its requirements. Preparation at RAAGA should not be confused with a university awarding a qualification.
        </p>
        <div className="reveal mt-8">
          <ButtonLink variant="secondary" href="/gurus">Explore RAAGA’s teaching tradition</ButtonLink>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
