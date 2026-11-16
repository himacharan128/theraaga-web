import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { GuruCards } from '@/components/sections/GuruCards'
import { LineageCards } from '@/components/sections/LineageCards'
import { ScholarlyWorks } from '@/components/sections/ScholarlyWorks'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import {
  getGuruProfiles,
  getGurusIntro,
  getLineageReferences,
  getScholarlyWorks,
} from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'The Gurus: Our Musical Lineage',
  description:
    'Meet the Gurus at RAAGA: Dr. Suryanarayana Polaki, author of Bhasuri and Swararaga Kadambam, Bharathi Polaki and Bhasuri Polaki. Their training, lineage and teaching of Carnatic vocal in Hyderabad and online.',
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
 * Guru Parampara: The Gurus.
 *
 * WORDING PROVENANCE. An earlier draft hedged every lineage claim to
 * institutional level because we had no authority to say the Gurus studied
 * under those maestros. The client's content master makes that claim directly,
 * in their own words, so it is theirs to make and it is reproduced as written.
 *
 * What is still forbidden: naming an award or an institution the client did
 * not name, putting a number on "renowned cultural institutions", or attaching
 * a maestro to a Guru beyond what that teacher's own profile states.
 *
 * Guru profiles are data (`content/seed/gurus.ts`), each a page of its own and
 * listed here as text entries. There are no portrait frames waiting for one:
 * with no client photography, a person-shaped hole is what makes a school site
 * look abandoned, so each entry is complete as the teacher's stated facts and
 * a portrait is added only when one arrives.
 *
 * Composed as an archive: the dark stage for the opening, the claim the page
 * rests on as a statement, the maestro as a mounted portrait with a museum
 * label, and the books as a small exhibition on sand.
 */
export default async function GurusPage() {
  const [intro, lineage, works, profiles] = await Promise.all([
    getGurusIntro(),
    getLineageReferences(),
    getScholarlyWorks(),
    getGuruProfiles(),
  ])

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'The Gurus', href: '/gurus' },
        ]}
      />
      <PageHero
        variant="night"
        eyebrow="Guru Parampara · गुरुपरम्परा · The musical lineage"
        title={
          <>
            Guided by tradition. <em>United by music.</em>
          </>
        }
        lede={
          <p>
            In Carnatic Sangeetham the lineage is the credential. Who taught the
            Guru, and who taught them, is not trivia: it is what determines the
            phrasing a student inherits.
          </p>
        }
      />

      {/* Lead-paragraph treatment. The opening line is the claim the whole
          page rests on, so it is set as a statement across the measure, and
          the two lines that support it sit beneath, side by side on wide
          screens like the columns of a catalogue entry. */}
      <section id="our-gurus" data-section="our-gurus" data-has-content="true" className="pad-section">
        <div className="u-shell">
          <h2 className="kicker reveal">Our Gurus</h2>
          {intro[0] && (
            <p className="reveal t-statement mt-8 max-w-[30ch] text-pretty text-fg md:mt-10">{intro[0]}</p>
          )}
          {intro.length > 1 && (
            <div className="mt-12 grid gap-x-10 gap-y-6 border-t border-line pt-10 md:mt-16 md:grid-cols-12">
              {intro.slice(1).map((para, i) => (
                <p
                  key={para.slice(0, 24)}
                  className={`reveal t-standfirst text-fg-2 md:col-span-5 ${i % 2 ? 'md:col-start-7' : 'md:col-start-1'}`}
                  style={{ '--i': i } as CSSProperties}
                >
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <Section
        id="profiles"
        eyebrow="Meet the Gurus"
        title="Who teaches here."
        lede={
          <p>
            Each Guru’s training, lineage and years of teaching, in their own
            words. Students are guided to the Guru best suited to their level.
          </p>
        }
        renderIf={profiles.length > 0}
      >
        <GuruCards profiles={profiles} />
      </Section>

      <Section
        id="lineage"
        layout="split"
        eyebrow="Trained under"
        title="A tradition of excellence."
        tone="paper"
        lede={<p>Eminent maestros under whom our Gurus trained, including:</p>}
        renderIf={lineage.length > 0}
      >
        <LineageCards entries={lineage} />
      </Section>

      <Section
        id="scholarship"
        layout="rail"
        tone="sand"
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
        <ScholarlyWorks works={works} />
      </Section>

      <FinalCta />
    </>
  )
}
