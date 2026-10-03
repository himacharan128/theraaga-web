import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ButtonLink } from '@/components/ui/Button'
import { PathCard } from '@/components/sections/ExploreLearningGoals'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Start Carnatic Music Classes in Hyderabad: A Learner’s Guide',
  description: 'Choosing Carnatic vocal classes for yourself or your child? Explore RAAGA’s learning path, Hyderabad centres, online lessons and how to enquire about a trial.',
  alternates: { canonical: '/getting-started' },
  openGraph: { title: 'Getting started with Carnatic music at RAAGA', description: 'Choose a learning format, understand the syllabus and prepare your questions for RAAGA.', url: 'https://theraaga.in/getting-started' },
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

      <Section id="formats" eyebrow="Choose a format" title="Where would you like to learn?">
        <ul className="grid gap-4 md:grid-cols-2">
          {FORMATS.map((f) => (
            <li key={f.href} className="group">
              <PathCard {...f} cta="Explore" />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="beginners" title="Starting without previous training" tone="surface">
        <p className="u-measure text-text-secondary">
          You can enquire as a beginner. Tell RAAGA whether you are learning for yourself or choosing classes for a child, your preferred location or online format, and the times you can attend. If you have studied before, describe the exercises or compositions you have learned so the teacher can discuss an appropriate starting point.
        </p>
      </Section>

      <Section id="syllabus" title="What the syllabus covers">
        <p className="u-measure text-text-secondary">
          RAAGA’s published progression begins with Sarali Swaras, Janta Swaras and Alankaras. Students then work through compositions including Geetams, Swarajatis, Varnams, Keertanas and Kritis. Advanced learning includes Manodharma Sangeetham. Progress depends on the learner and the teacher’s guidance; a list of stages is not a promise of a fixed completion date.
        </p>
        <div className="mt-8">
          <ButtonLink variant="secondary" href="/learning">Read the complete Carnatic syllabus</ButtonLink>
        </div>
      </Section>

      <Section id="questions" title="Questions to ask before joining" tone="surface">
        <ul className="u-measure list-disc space-y-3 pl-6 text-text-secondary">
          {QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="u-measure mt-8 text-text-secondary">
          For a child’s enquiry, provide the parent or guardian’s contact details and an age band. The website does not need the child’s name or date of birth.
        </p>
      </Section>

      <Section id="goals" title="Academic and performance goals">
        <p className="u-measure text-text-secondary">
          RAAGA offers guidance for students pursuing certificate, diploma and degree pathways, alongside performance preparation. Ask the team about your intended programme and its requirements. Preparation at RAAGA should not be confused with a university awarding a qualification.
        </p>
        <div className="mt-8">
          <ButtonLink variant="secondary" href="/gurus">Explore RAAGA’s teaching tradition</ButtonLink>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
