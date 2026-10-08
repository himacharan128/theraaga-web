import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { LedgerIndex } from '@/components/layout/Editorial'
import { Arrow } from '@/components/ui/Button'
import { getJournalTopics, getLearningGuides } from '@/data/content'
import { guideMeta } from '@/lib/reading'
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
 *
 * Set as the front page of a small publication: the first guide leads at
 * display size with the others filed beside it, then the subjects the journal
 * will write about, as a ledger on sand.
 */
export default async function JournalPage() {
  const [topics, guides] = await Promise.all([getJournalTopics(), getLearningGuides()])
  const [lead, ...rest] = guides

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

      <Section
        id="learning-guides"
        eyebrow="Practical reading"
        title="Questions before and between lessons."
        renderIf={guides.length > 0}
      >
        {lead && (
          <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
            <Link
              href={`/guides/${lead.slug}`}
              className={`reveal group block border-t border-mark pt-8 no-underline ${
                rest.length > 0 ? 'lg:col-span-7' : 'lg:col-span-8'
              }`}
            >
              <p className="t-meta text-fg-3">01 · {guideMeta(lead)}</p>
              <h3 className="t-display mt-5 max-w-[16ch] text-balance text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
                {lead.title}
              </h3>
              <p className="t-standfirst mt-6 max-w-[44ch] text-fg-2">{lead.description}</p>
              <span className="t-small mt-8 inline-flex items-center gap-2 font-medium text-[var(--btn-ink)]">
                Read the guide
                <Arrow className="group-hover:translate-x-1" />
              </span>
            </Link>

            {rest.length > 0 && (
              <ol start={2} className="border-t border-line lg:col-span-5">
                {rest.map((guide, i) => (
                  <li
                    key={guide.slug}
                    className="reveal border-b border-line"
                    style={{ '--i': i + 1 } as CSSProperties}
                  >
                    <Link href={`/guides/${guide.slug}`} className="group block py-7 no-underline md:py-8">
                      <p className="t-meta text-fg-3">
                        {String(i + 2).padStart(2, '0')} · {guideMeta(guide)}
                      </p>
                      <h3 className="t-subhead mt-3 text-balance text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
                        {guide.title}
                      </h3>
                      <p className="t-body mt-3 max-w-[48ch] text-fg-2">{guide.description}</p>
                      <span className="t-small mt-4 inline-flex items-center gap-2 font-medium text-[var(--btn-ink)]">
                        Read the guide
                        <Arrow className="group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </Section>

      <Section id="subjects" eyebrow="Subjects" tone="sand" renderIf={topics.length > 0}>
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

        <p className="reveal t-caption mt-10 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">
          These are subjects for future essays and demonstrations. They are
          separate from the practical guides above; new contributions will
          appear here when they are ready.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
