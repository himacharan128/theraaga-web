import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { LineageCards } from '@/components/sections/LineageCards'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import {
  getGurusIntro,
  getLineageReferences,
  getScholarlyWorks,
} from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'The Gurus: Our Musical Lineage',
  description:
    'The Gurus at RAAGA are accomplished musicians, scholars, performers and authors trained under eminent maestros, with over two decades of experience teaching Carnatic Sangeetham in Hyderabad.',
  alternates: { canonical: '/gurus' },
  openGraph: {
    title: 'Guru Parampara: the Gurus at RAAGA',
    description:
      'Accomplished musicians, scholars, performers and authors. Students are thoughtfully guided to the Guru best suited to their journey.',
    url: 'https://theraaga.in/gurus',
    images: defaultOgImages,
  },
}

/**
 * Guru Parampara — The Gurus.
 *
 * WORDING PROVENANCE. An earlier draft hedged every lineage claim to
 * institutional level because we had no authority to say the Gurus studied
 * under those maestros. The client's content master makes that claim directly,
 * in their own words, so it is theirs to make and it is reproduced as written.
 *
 * What is still forbidden: attaching a specific maestro to a specific Guru,
 * naming an award or an institution the client did not name, or putting a
 * number on "renowned cultural institutions".
 *
 * There are no individual Guru profiles yet, and no portrait frames waiting for
 * one. With no client photography, a person-shaped hole is what makes a school
 * site look abandoned — so this page is complete as an account of the TEACHING,
 * and profiles are added later as data.
 */
export default async function GurusPage() {
  const intro = await getGurusIntro()
  const lineage = await getLineageReferences()
  const works = await getScholarlyWorks()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'The Gurus', href: '/gurus' },
        ]}
      />
      <PageHero
        eyebrow="Guru Parampara · गुरुपरम्परा · The musical lineage"
        title="Guided by tradition. United by music."
        lede={
          <p>
            In Carnatic Sangeetham the lineage is the credential. Who taught the
            Guru, and who taught them, is not trivia — it is what determines the
            phrasing a student inherits.
          </p>
        }
      />

      <Section id="our-gurus" eyebrow="Our Gurus">
        {/* Lead-paragraph treatment. The opening line is the claim the whole
            page rests on, so it is set larger than what follows — the oldest
            editorial signal there is for "start here". */}
        <div className="u-measure space-y-6 text-text-secondary">
          {intro.map((para, i) => (
            <p
              key={para.slice(0, 24)}
              className={
                i === 0
                  ? 'text-[length:var(--text-step-2)] font-[300] leading-[var(--lh-snug)] text-text-primary'
                  : 'text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)]'
              }
            >
              {para}
            </p>
          ))}
        </div>
      </Section>

      <Section
        id="lineage"
        eyebrow="Trained under"
        title="A tradition of excellence."
        tone="surface"
        lede={<p>Eminent maestros under whom our Gurus trained, including:</p>}
        renderIf={lineage.length > 0}
      >
        <LineageCards entries={lineage} />
      </Section>

      <Section
        id="scholarship"
        eyebrow="Scholars, authors and contributors"
        title="Written contributions to Carnatic scholarship."
        renderIf={works.length > 0}
        lede={
          <p>
            Teaching here is informed by scholarship as well as performance,
            including books authored by our Gurus.
          </p>
        }
      >
        <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {works.map((w) => (
            <li key={w.order} className="bg-surface p-7 md:p-9">
              <h3 className="font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] italic text-accent">
                {w.title}
              </h3>
              <p className="mt-3 text-[length:var(--text-step--1)] text-text-secondary">
                {w.note}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  )
}
