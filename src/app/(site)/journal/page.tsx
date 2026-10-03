import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { LedgerIndex } from '@/components/layout/Editorial'
import { getJournalTopics } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'Journal: Writing on Carnatic Sangeetham',
  description:
    'Manana — reflections on ragas, great composers, kritis, shruti and laya, voice culture and practice, from the Gurus at RAAGA in Hyderabad.',
  alternates: { canonical: '/journal' },
  openGraph: {
    title: 'Manana: the RAAGA journal',
    description:
      'Ragas, great composers, kritis explained, shruti and laya, voice culture and practice tips.',
    url: 'https://theraaga.in/journal',
    images: defaultOgImages,
  },
}

/**
 * Manana — the Journal.
 *
 * The seven subjects are the client's own editorial plan, so they are real and
 * they are published. The ARTICLES are not invented — no fabricated posts, no
 * lorem excerpts, no fake dates.
 *
 * That makes this a subject index rather than a blog index, and it says so
 * plainly. A page that reads "here is what we will write about, and it is
 * being written" is honest and still communicates the school's scholarly bent;
 * a grid of ghost article cards communicates only that the site is unfinished.
 *
 * When posts exist they render above this and the note disappears — no code
 * change, the same pattern every other section on the site uses.
 */
export default async function JournalPage() {
  const topics = await getJournalTopics()

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
        title="Writing on the music we teach."
        lede={
          <p>
            Manana is reflection — the turning over of something learned until
            it is understood. These are the subjects our Gurus write about.
          </p>
        }
      />

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
          The first pieces are being written. We would rather publish one essay
          worth reading than a dozen that are not — so this page stays a list of
          subjects until there is something here worth your time.
        </p>
      </Section>

      <FinalCta />
    </>
  )
}
