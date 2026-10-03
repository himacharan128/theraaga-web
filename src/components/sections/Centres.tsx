import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getCentres } from '@/data/content'

/**
 * The router — the most important section on the homepage, because the first
 * question a parent scrolling a WhatsApp forward answers is "is this near me,
 * or can we do it from home?"
 *
 * WHY THIS IS NOT A CARD GRID.
 * There are four options, and a three-column grid orphaned the fourth into a
 * row of its own beside two-thirds of empty page. Dropping to two columns fixes
 * the arithmetic but flattens the hierarchy: the two Hyderabad centres are
 * where the school physically IS, and online and community are ways of reaching
 * the same teaching. So the split is 2 + 2 — two weighted panels for the
 * centres, one lighter band for the rest. Symmetric at every breakpoint, and
 * the layout now says something true about the business.
 */
export async function Centres() {
  const centres = await getCentres()
  const physical = centres.filter((c) => c.slug)
  const remote = centres.filter((c) => !c.slug)

  return (
    <Section
      id="centres"
      eyebrow="Sādhana · Where you learn"
      title="Two centres in Hyderabad."
      lede={
        <p>
          The syllabus, the Gurus and the standard are identical wherever you
          learn. Only the room changes.
        </p>
      }
      tone="surface"
    >
      {/* The two physical centres. Numbered, because they are places you can
          actually walk into, and the numeral gives the eye somewhere to land
          without another decorative flourish. */}
      <ul className="grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-border bg-border md:grid-cols-2">
        {physical.map((c, i) => (
          <li key={c.key} className="group bg-surface">
            <Link
              href={c.href}
              className="flex h-full flex-col p-8 no-underline transition-colors duration-[var(--dur)] hover:bg-[color-mix(in_srgb,var(--color-accent)_4%,transparent)] md:p-10"
            >
              <span
                aria-hidden="true"
                className="font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] text-gold-hairline"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-[length:var(--text-step-3)] font-[300] leading-[var(--lh-snug)] text-text-primary">
                {c.name}
              </h3>
              {c.locality && (
                <p className="mt-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-text-muted">
                  {c.locality}
                </p>
              )}
              <p className="u-measure mt-6 flex-1 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
                {c.body}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 self-start font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent underline decoration-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] underline-offset-[6px] transition-[text-decoration-color] group-hover:decoration-current">
                {c.cta}
                <svg className="raga-link-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Online and community. Deliberately unboxed — they are not places, and
          giving them the same panel treatment implied they were. */}
      <div className="mt-14">
        <p className="u-eyebrow">Or learn from where you are</p>
        <ul className="mt-7 grid gap-x-14 gap-y-9 border-t border-border pt-9 md:grid-cols-2">
          {remote.map((c) => (
            <li key={c.key} className="group">
              <h3 className="text-[length:var(--text-step-2)] font-[300] text-text-primary">
                {c.name}
              </h3>
              <p className="u-measure mt-3 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {c.body}
              </p>
              <Link
                href={c.href}
                className="mt-3 inline-flex min-h-11 items-center gap-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent underline decoration-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] underline-offset-[6px] transition-[text-decoration-color] hover:decoration-current"
              >
                {c.cta}
                <svg className="raga-link-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
