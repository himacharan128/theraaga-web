import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { LedgerIndex } from '@/components/layout/Editorial'
import { PathCard } from '@/components/sections/ExploreLearningGoals'
import { getJournalTopics, getLearningGuides } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'Carnatic Music Journal & Learning Guides',
  description:
    'Explore RAAGA’s practical Carnatic music guides: choosing classes in Hyderabad, online learning and home practice, plus subjects from the musical tradition.',
  alternates: { canonical: '/journal' },
  openGraph: {
    title: 'Manana: the RAAGA journal',
    description:
      'Practical learning guides and subjects from the Carnatic musical tradition at RAAGA, Hyderabad.',
    url: 'https://theraaga.in/journal',
    images: defaultOgImages,
  },
}

/**
 * Practical guides link to their canonical pages. The client's planned
 * musical subjects remain separate from published writing. No guide is
 * attributed to a Guru without their actual contribution and approval.
 */
export default async function JournalPage() {
  const topics = await getJournalTopics()
  const guides = await getLearningGuides()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Journal', href: '/journal' },
        ]}
      />
      <PageHero
        eyebrow="Manana · मनन · Reflection"
        title="Read, listen and keep learning."
        lede={
          <p>
            Manana is reflection: returning to what you have learned and finding
            more in it. Start with practical guides to choosing lessons and
            practising between classes, then explore the subjects behind the music.
          </p>
        }
      />

      <Section id="learning-guides" eyebrow="Practical reading" title="Questions before and between lessons." renderIf={guides.length > 0}>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => <li key={guide.slug} className="group">
            <PathCard title={guide.title} body={guide.description} href={`/guides/${guide.slug}`} cta="Read the guide" />
          </li>)}
        </ul>
      </Section>

      <Section id="subjects" eyebrow="Subjects" renderIf={topics.length > 0}>
        {/* Seven is prime: it orphaned an item in both the two- and
            three-column grid this used to be. A journal's subject index is a
            list anyway, and a ledger takes any count without leaving a gap. */}
        <LedgerIndex
          items={topics.map((topic) => ({
            key: topic.order,
            term: topic.name,
            aside: topic.devanagari,
            body: topic.body,
          }))}
        />

        <p className="u-measure mt-12 border-l-2 border-gold-hairline/50 pl-5 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted">
          These are subjects for future essays and demonstrations. They are
          separate from the practical guides above; new contributions will
          appear here when they are ready.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
