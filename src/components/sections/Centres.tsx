import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getCentres } from '@/data/content'

/**
 * The router — the single most important section on the homepage.
 *
 * 14 of 19 music-school homepages studied put one immediately below the hero.
 * Yousician routes by instrument, Merit by age band. Raaga routes by WHERE,
 * because that is the first question a parent scrolling a WhatsApp forward is
 * actually answering: is this near me, or can we do it from home?
 *
 * Always renders — the three options are facts about the business, not client
 * data, so this section can never be empty.
 */
export async function Centres() {
  const centres = await getCentres()

  return (
    <Section
      id="centres"
      eyebrow="Sādhana · Where you learn"
      title="Choose how you learn."
      lede={
        <p>
          Two centres in Hyderabad, and live online classes for everyone else.
          The syllabus and the teaching are the same in all three.
        </p>
      }
      tone="surface"
    >
      <ul className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {centres.map((c) => (
          <li key={c.key} className="bg-surface">
            {/* Whole card is the tap target — one thumb-scroll on mobile. */}
            <Link
              href={c.href}
              className="group flex h-full min-h-[11rem] flex-col p-7 no-underline md:p-9"
            >
              <p className="u-eyebrow">{c.eyebrow}</p>
              <h3 className="mt-3 text-[length:var(--text-step-2)] font-[300] text-text-primary">
                {c.name}
              </h3>
              {c.locality && (
                <p className="mt-1 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                  {c.locality}
                </p>
              )}
              <p className="mt-4 flex-1 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {c.body}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover:decoration-current">
                {c.cta}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
