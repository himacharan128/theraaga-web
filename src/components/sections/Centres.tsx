import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getCentres } from '@/data/content'

/**
 * The router — the single most important section on the homepage.
 *
 * 14 of 19 music-school homepages studied put one immediately below the hero.
 * Yousician routes by instrument, Merit by age band. RAGA routes by WHERE,
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
      <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
        {centres.map((c) => (
          <li key={c.key} className="group">
            {/* Whole card is the tap target — one thumb-scroll on mobile. */}
            <Link
              href={c.href}
              className="relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface p-7 shadow-[0_10px_30px_rgba(71,49,34,0.06)] no-underline transition-[transform,border-color,box-shadow] duration-[var(--dur)] ease-[var(--ease-raaga)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-lift)] motion-reduce:transition-none motion-reduce:hover:transform-none md:p-8"
            >
              <span aria-hidden="true" className="absolute left-0 top-7 h-12 w-1 rounded-r-full bg-accent transition-[height] duration-[var(--dur)] group-hover:h-20" />
              <p className="u-eyebrow relative pl-3">{c.eyebrow}</p>
              <h3 className="relative mt-4 text-[length:var(--text-step-2)] font-[300] text-text-primary">
                {c.name}
              </h3>
              {c.locality && (
                <p className="relative mt-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                  {c.locality}
                </p>
              )}
              <p className="relative mt-5 flex-1 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {c.body}
              </p>
              <span className="relative mt-8 inline-flex items-center gap-2 self-start rounded-full bg-[color-mix(in_srgb,var(--color-accent)_7%,transparent)] px-3.5 py-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent">
                {c.cta}
                <svg className="raga-link-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
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
