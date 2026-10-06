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
 * ALL FOUR ARE CARDS. Online and community were briefly set as an unboxed
 * band, on the reasoning that they are not places. The owner reversed that on
 * 2026-10-03: with only the centres boxed, online and community read as
 * footnotes, and for a parent in a gated community that is the option most
 * likely to be the answer. All four share one `Panel`.
 *
 * ONE CARD STYLE. These are the one place on the homepage where cards earn
 * their keep, because each is a route you pick. Each is a framed panel: a
 * hairline edge with gold corner brackets that grow on hover, a large display
 * numeral that comes forward on hover, and a text link. Community keeps its
 * emphasis through its own label and a faint maroon ground, both asserted in
 * scripts/check-contrast.ts.
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
    <li className="group">
      <Link
        href={c.href}
        className={`bracket flex h-full flex-col rounded-[var(--radius-lg)] border p-7 no-underline transition-[border-color,transform,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] hover:border-accent hover:shadow-[var(--shadow-hover)] motion-safe:hover:-translate-y-1 md:p-9 ${
          highlight ? 'border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-accent-tint' : 'border-border bg-surface'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          {highlight ? <p className="u-eyebrow">{c.eyebrow}</p> : <span />}
          <span
            aria-hidden="true"
            className="u-numeral -mt-1 font-[300] text-[length:var(--text-step-3)] text-accent opacity-30 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-100"
          >
            0{index}
          </span>
        </div>
        <h3 className="mt-4 text-[length:var(--text-step-2)] font-[300] leading-[var(--lh-snug)] text-text-primary md:text-[length:var(--text-step-3)]">
          {title}
        </h3>
        {c.locality && (
          <p className="mt-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            {c.locality}
          </p>
        )}
        <p className="u-measure mt-5 flex-1 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
          {c.body}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 self-start font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent">
          {c.cta}
          {arrow}
        </span>
      </Link>
    </li>
  )
}

const gridClass = 'rv-stagger grid gap-4 md:grid-cols-2 md:gap-5'

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
    >
      <ul className={gridClass}>
        {physical.map((c, i) => (
          <Panel key={c.key} centre={c} index={i + 1} title={`${site.shortName}, ${c.name}`} />
        ))}
      </ul>

      <div className="mt-14">
        <p className="u-eyebrow rv">Or learn from where you are</p>
        <ul className={`mt-6 ${gridClass}`}>
          {remote.map((c, i) => (
            <Panel
              key={c.key}
              centre={c}
              index={physical.length + i + 1}
              title={c.name}
              highlight={c.key === 'community'}
            />
          ))}
        </ul>
      </div>
    </Section>
  )
}
