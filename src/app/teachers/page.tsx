import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { SwaraDivider } from '@/components/ui/Ornament'
import {
  getLineageReferences,
  getScholarlyWorks,
  getTeachingPrinciples,
} from '@/data/content'

export const metadata: Metadata = {
  title: 'Teachers — the teaching lineage',
  description:
    'Guided by tradition, united by music. The Guru–Shishya Parampara, the lineage and the scholarship behind Carnatic vocal teaching at RAAGA, Hyderabad.',
  alternates: { canonical: '/teachers' },
  openGraph: {
    title: 'Guru Parampara — the teaching lineage at RAAGA',
    description:
      'How Carnatic music is transmitted here: the Guru–Shishya Parampara, the lineage the school’s teaching draws on, and its scholarly contributions.',
    url: 'https://theraaga.in/teachers',
  },
}

/**
 * Guru Parampara.
 *
 * WORDING RULE — this page is where it matters most. Every lineage claim is
 * made at INSTITUTIONAL level: "the school's teaching lineage draws on". We do
 * not say, and must not imply, that a named maestro personally taught any
 * current teacher. That is a claim only the client can make, and only if it is
 * true; getting it wrong in a Carnatic context is both a credibility failure
 * and a misleading-advertisement exposure under the CCPA Guidelines 2022.
 *
 * There are no individual teacher profiles yet, and no portrait frames waiting
 * for one. With no client photography, a person-shaped hole is what makes a
 * school site look abandoned — so this page is built to be complete as an
 * account of the TEACHING, and individual profiles are added later as data.
 */
export default async function TeachersPage() {
  const principles = await getTeachingPrinciples()
  const lineage = await getLineageReferences()
  const works = await getScholarlyWorks()

  return (
    <>
      <PageHero
        eyebrow="Guru Parampara · गुरुपरम्परा · The musical lineage"
        title="Guided by tradition. United by music."
        lede={
          <p>
            In Carnatic music the lineage is the credential. Who taught the
            teacher, and who taught them, is not trivia — it is what determines
            the phrasing a student inherits.
          </p>
        }
      />

      <Section
        id="principles"
        eyebrow="How we teach"
        renderIf={principles.length > 0}
      >
        <ul className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p.order}>
              {i > 0 && (
                <div className="mb-8 md:hidden">
                  <SwaraDivider index={i} />
                </div>
              )}
              <h2 className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-accent">
                {p.title}
              </h2>
              <p className="u-measure mt-3 text-text-secondary">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="lineage"
        eyebrow="The lineage"
        title="A tradition of excellence."
        tone="surface"
        lede={
          <p>
            The school’s teaching lineage draws on the work of distinguished
            Carnatic musicians and scholars, including:
          </p>
        }
        renderIf={lineage.length > 0}
      >
        <ol className="relative max-w-2xl space-y-7 pl-7">
          {/* The lineage thread — the same tanpura string as the syllabus spine. */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[3px] top-2 w-px bg-gold-hairline/40"
          />
          {lineage.map((entry) => (
            <li key={entry.order} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-7 top-[0.55em] size-[7px] rounded-full bg-accent"
              />
              <p className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)]">
                {entry.honorific ? `${entry.honorific} ` : ''}
                {entry.name}
              </p>
            </li>
          ))}
        </ol>

        <p className="u-measure mt-10 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted">
          These are the musicians whose work and teaching the school’s tradition
          descends from. Individual teacher profiles and their own studies are
          published as each is confirmed.
        </p>
      </Section>

      <Section
        id="scholarship"
        eyebrow="Scholars, authors and contributors"
        title="Written contributions to Carnatic scholarship."
        renderIf={works.length > 0}
        lede={
          <p>
            Teaching here is informed by scholarship as well as performance —
            including published contributions to the literature of the
            tradition.
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

      <Section id="recognition" eyebrow="Recognition and honours">
        <div className="u-measure space-y-5 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
          <p>
            The recognitions held by our teachers, and by the tradition they
            teach within, are published here as each is confirmed in full — with
            the awarding body and the year.
          </p>
          <p>
            We would rather name nothing than name something imprecisely. In a
            tradition where credentials are the credential, a vague honour is
            worth less than none at all.
          </p>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
