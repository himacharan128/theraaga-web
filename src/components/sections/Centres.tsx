import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getCentres, getSite } from '@/data/content'
import type { Centre } from '@/content/types'

/**
 * The router — the most important section on the homepage, because the first
 * question a parent scrolling a WhatsApp forward answers is "is this near me,
 * or can we do it from home?"
 *
 * WHY THIS IS NOT A CARD GRID.
 * There are four options, and a three-column grid orphaned the fourth into a
 * row of its own beside two-thirds of empty page. So the split is 2 + 2:
 * the two Hyderabad centres, then "Or learn from where you are" — online and
 * community. Symmetric at every breakpoint.
 *
 * ALL FOUR ARE BOXED, AND NUMBERED 01–04. Online and community were briefly
 * set as an unboxed band, on the reasoning that they are not places and the
 * same panel implied they were. The owner reversed that on 2026-10-03: with
 * only the centres boxed, online and community read as footnotes, and for a
 * parent in a gated community that is the option most likely to be the answer.
 * Both rows therefore share one `Panel`, so the grid, border, radius, padding,
 * full-card link and arrow CTA cannot drift apart.
 *
 * COMMUNITY STANDS OUT, WITHOUT A GRADIENT. Gated-community parents are the
 * school's core audience, so that panel alone carries an accent-tinted ground
 * (`--color-accent-tint`), a 2px accent ring, its eyebrow as a label and a
 * filled CTA. The tint is a flat colour, not a field; every text pair on it is
 * asserted in scripts/check-contrast.ts.
 *
 * TITLES. The two centre cards read "RAAGA, Jubilee Hills" and "RAAGA, Phoenix
 * Arena". That prefix is display only: `centre.name` stays bare in the seed
 * because breadcrumbs, schema and the centre pages reuse it and would double up.
 */
const arrow = (
  <svg className="raga-link-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
    <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

// Rounds only the corners the highlighted cell shares with the grid's own
// rounded edge (bottom on mobile, right on md+) so its accent ring follows the
// curve instead of being clipped square by `overflow-hidden`. The grid's inner
// radius is one border-width smaller than --radius-md, hence the calc.
const ringCorners =
  'rounded-bl-[calc(var(--radius-md)-1px)] rounded-br-[calc(var(--radius-md)-1px)] md:rounded-bl-none md:rounded-tr-[calc(var(--radius-md)-1px)]'

function Panel({
  centre: c,
  title,
  index,
  highlight = false,
}: {
  centre: Centre
  title: string
  index: number
  highlight?: boolean
}) {
  return (
    <li className="group bg-surface">
      <Link
        href={c.href}
        className={`flex h-full flex-col p-8 no-underline transition-colors duration-[var(--dur)] md:p-10 ${
          highlight
            ? `bg-accent-tint shadow-[inset_0_0_0_2px_var(--color-accent)] hover:bg-accent-tint-hover ${ringCorners}`
            : 'hover:bg-[color-mix(in_srgb,var(--color-accent)_4%,transparent)]'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <span
            aria-hidden="true"
            className="font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] text-gold-hairline"
          >
            {String(index).padStart(2, '0')}
          </span>
          {highlight && (
            <span className="rounded-full bg-accent px-3 py-1 font-[var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.14em] text-on-accent">
              {c.eyebrow}
            </span>
          )}
        </div>
        <h3 className="mt-5 text-[length:var(--text-step-3)] font-[300] leading-[var(--lh-snug)] text-text-primary">
          {title}
        </h3>
        {c.locality && (
          <p className="mt-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-text-muted">
            {c.locality}
          </p>
        )}
        <p className="u-measure mt-6 flex-1 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
          {c.body}
        </p>
        {highlight ? (
          <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-accent px-5 py-3 font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-on-accent transition-colors group-hover:bg-accent-hover">
            {c.cta}
            {arrow}
          </span>
        ) : (
          <span className="mt-8 inline-flex items-center gap-2 self-start font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent underline decoration-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] underline-offset-[6px] transition-[text-decoration-color] group-hover:decoration-current">
            {c.cta}
            {arrow}
          </span>
        )}
      </Link>
    </li>
  )
}

const gridClass =
  'grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-border bg-border md:grid-cols-2'

export async function Centres() {
  const [site, centres] = await Promise.all([getSite(), getCentres()])
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
      <ul className={gridClass}>
        {physical.map((c, i) => (
          <Panel key={c.key} centre={c} title={`${site.shortName}, ${c.name}`} index={i + 1} />
        ))}
      </ul>

      <div className="mt-14">
        <p className="u-eyebrow">Or learn from where you are</p>
        <ul className={`mt-7 ${gridClass}`}>
          {remote.map((c, i) => (
            <Panel
              key={c.key}
              centre={c}
              title={c.name}
              index={physical.length + i + 1}
              highlight={c.key === 'community'}
            />
          ))}
        </ul>
      </div>
    </Section>
  )
}
