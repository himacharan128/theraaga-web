import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Section } from '@/components/layout/Section'
import { Arrow } from '@/components/ui/Button'
import { getCentres, getSite } from '@/data/content'
import type { Centre } from '@/content/types'

/**
 * The router: the most important section on the homepage, because the first
 * question a parent scrolling a WhatsApp forward answers is "is this near me,
 * or can we do it from home?"
 *
 * A RULED GRID, NOT CARDS. Four routes in a 2 + 2 grid drawn with hairlines,
 * like the panels of a printed programme: the two Hyderabad centres, then "Or
 * learn from where you are", online and community. Symmetric at every
 * breakpoint, and no fourth option orphaned beside empty page.
 *
 * ALL FOUR ARE EQUAL. Online and community were briefly set apart on the
 * reasoning that they are not places. The owner reversed that on 2026-10-03:
 * set apart, online and community read as footnotes, and for a parent in a
 * gated community that is the option most likely to be the answer. All four
 * share one `Route`; community keeps its own label.
 *
 * TITLES. The two centres read "RAAGA, Jubilee Hills" and "RAAGA, Phoenix
 * Arena". That prefix is display only: `centre.name` stays bare in the seed
 * because breadcrumbs, schema and the centre pages reuse it and would double up.
 */
function Route({
  centre: c,
  title,
  index,
  label,
}: {
  centre: Centre
  title: string
  index: number
  label?: string
}) {
  return (
    <li className="reveal border-b border-line md:odd:border-r" style={{ '--i': index % 2 } as CSSProperties}>
      <Link
        href={c.href}
        className={`group relative flex h-full flex-col py-8 no-underline md:py-10 ${index % 2 ? 'md:pr-10' : 'md:pl-10'}`}
      >
        {/* On a phone a route without a label sets its numeral beside the
            title rather than on a row of its own; side by side from md, every
            route keeps the row so the four titles share one line. */}
        <div
          className={`flex items-baseline justify-between gap-4 ${label ? '' : 'max-md:absolute max-md:top-[1.85rem] max-md:right-0'}`}
        >
          {label ? <p className="t-label text-kicker">{label}</p> : <span />}
          <span
            aria-hidden="true"
            className="t-numeral text-[1.75rem] text-fg-3 transition-colors duration-[var(--dur-2)] group-hover:text-kicker"
          >
            {String(index).padStart(2, '0')}
          </span>
        </div>
        <h3
          className={`t-subhead pr-12 text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker md:mt-5 md:pr-0 ${label ? 'mt-5' : ''}`}
        >
          {title}
        </h3>
        {c.locality && <p className="t-meta mt-2 text-fg-3">{c.locality}</p>}
        <p className="t-body mt-4 max-w-[44ch] flex-1 text-fg-2">{c.body}</p>
        <span className="link-arrow mt-7 self-start">
          {c.cta}
          <Arrow />
        </span>
      </Link>
    </li>
  )
}

export async function Centres() {
  const [site, centres] = await Promise.all([getSite(), getCentres()])
  const physical = centres.filter((c) => c.slug)
  const remote = centres.filter((c) => !c.slug)

  return (
    <Section
      id="centres"
      tone="paper"
      layout="split"
      eyebrow="Sādhana · Where you learn"
      title="Two centres in Hyderabad."
      lede={
        <p>
          The syllabus, the Gurus and the standard are identical wherever you
          learn. Only the room changes.
        </p>
      }
    >
      <ul className="grid border-t border-line md:grid-cols-2">
        {physical.map((c, i) => (
          <Route key={c.key} centre={c} index={i + 1} title={`${site.shortName}, ${c.name}`} />
        ))}
      </ul>

      <p className="reveal t-label runhead flex items-center gap-4 pt-12 pb-5 text-kicker md:pt-14">
        Or learn from where you are
      </p>

      <ul className="grid border-t border-line md:grid-cols-2">
        {remote.map((c, i) => (
          <Route
            key={c.key}
            centre={c}
            index={physical.length + i + 1}
            title={c.name}
            label={c.key === 'community' ? c.eyebrow : undefined}
          />
        ))}
      </ul>
    </Section>
  )
}
