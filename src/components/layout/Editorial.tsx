import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { Arrow } from '@/components/ui/Button'

/**
 * Editorial layout primitives.
 *
 * Every section on this site had converged on one shape: eyebrow, title, grid
 * of bordered cards, repeated down every page. Uniform rhythm is the thing
 * that most makes a site read as generated: a human designer varies the shape
 * because different content *wants* different shapes, and the variation is
 * itself information.
 *
 * These exist so that variation is a deliberate choice from a small
 * vocabulary rather than an ad-hoc invention per page. Each has a stated job.
 * None of them is a box: structure comes from hairlines, type and ground.
 *
 * They also solve a recurring arithmetic bug. Grids orphan any item count that
 * does not divide by the column count: five commitments in two columns, seven
 * subjects in three. A list has no such failure mode.
 */

/**
 * A. STATEMENT: one sentence, the full width, a chapter to itself.
 *
 * For a single declarative line that carries the weight of a whole page: a
 * vision, a promise. Set in the ordinary column it reads as one more
 * paragraph, which is precisely what it is not.
 */
export function StatementBand({
  eyebrow,
  children,
  attribution,
  tone = 'night',
}: {
  eyebrow?: string
  children: ReactNode
  attribution?: ReactNode
  tone?: 'night' | 'sand'
}) {
  return (
    <section
      data-tone={tone === 'night' ? 'dark' : undefined}
      className={`${tone === 'night' ? 'tone-night' : 'tone-sand'} pad-section`}
    >
      <div className="u-shell">
        <div className="reveal mx-auto max-w-5xl text-center">
          {eyebrow && <h2 className="kicker kicker-center mb-8 justify-center md:mb-10">{eyebrow}</h2>}
          <p className="t-statement text-balance text-fg md:text-[clamp(2rem,1.2rem+2.4vw,3.5rem)]">{children}</p>
          {attribution && <p className="t-meta mt-8 text-fg-3">{attribution}</p>}
        </div>
      </div>
    </section>
  )
}

/**
 * B. NUMBERED RAIL: an ordered set, one per row.
 *
 * For counts that are genuinely a sequence or an enumerated list rather than
 * a set of peers. The numeral holds a fixed rail so the titles align on a hard
 * vertical, which is what makes a list of five look composed.
 */
export function NumberedRail({
  items,
}: {
  items: { order: number; title: string; body: string }[]
}) {
  return (
    <ol className="border-t border-line">
      {items.map((item, i) => (
        <li
          key={item.order}
          className="reveal grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-7 md:grid-cols-[4rem_minmax(0,15rem)_1fr] md:gap-x-8 md:py-9 lg:grid-cols-[5rem_minmax(0,21rem)_1fr]"
          style={{ '--i': i % 4 } as CSSProperties}
        >
          <span aria-hidden="true" className="t-numeral pt-1 text-[2rem] text-kicker md:text-[2.5rem]">
            {String(item.order).padStart(2, '0')}
          </span>
          <h3 className="t-title text-fg">{item.title}</h3>
          <p className="t-body col-start-2 mt-2 max-w-[56ch] text-fg-2 md:col-start-3 md:mt-1">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  )
}

/**
 * C. LEDGER INDEX: term on the left, description on the right, hairline rows.
 *
 * For an unordered reference set: the kinds of gathering a school holds, the
 * subjects it writes about. It reads like a programme or a contents page,
 * which is what those things actually are, and takes any count without
 * orphaning one.
 */
export function LedgerIndex({
  items,
}: {
  items: { key: string | number; term: string; aside?: string; body: string }[]
}) {
  return (
    <dl className="border-t border-line">
      {items.map((item, i) => (
        <div
          key={item.key}
          className="reveal grid gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:py-8"
          style={{ '--i': i % 4 } as CSSProperties}
        >
          <dt className="flex flex-wrap items-baseline gap-x-3">
            <span className="t-title text-fg">{item.term}</span>
            {item.aside && (
              <span aria-hidden="true" className="deva text-fg-3">
                {item.aside}
              </span>
            )}
          </dt>
          <dd className="t-body max-w-[58ch] text-fg-2">{item.body}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * D. INDEX: a contents page of places to go next, one ruled row each.
 *
 * For destinations rather than facts: the learning paths, the guides. The
 * number holds a rail, the title is the row's heading, and what the page holds
 * and the way in sit beside it. The whole row is the link. It replaces a grid
 * of bordered cards, whose equal boxes said nothing about which way to go and
 * left a hole whenever the count did not fill the last row.
 */
export function IndexList({
  items,
  start = 1,
}: {
  /** `action` names the way in; without one the row ends on its arrow alone. */
  items: { href: string; title: string; body?: string; meta?: ReactNode; action?: string }[]
  /** The number of the first row, when one list continues another. */
  start?: number
}) {
  return (
    <ol className="border-t border-line" start={start}>
      {items.map((item, i) => (
        <li key={item.href} className="reveal border-b border-line" style={{ '--i': i % 4 } as CSSProperties}>
          <Link
            href={item.href}
            className="group grid grid-cols-[2.25rem_1fr] gap-x-3 py-7 no-underline md:grid-cols-[4rem_minmax(0,5fr)_minmax(0,6fr)] md:gap-x-8 md:py-9"
          >
            <span aria-hidden="true" className="t-numeral pt-1.5 text-[1.125rem] text-kicker md:text-[1.375rem]">
              {String(start + i).padStart(2, '0')}
            </span>
            <h3 className="t-subhead text-balance text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
              {item.title}
            </h3>
            <div className="col-start-2 mt-3 md:col-start-3 md:mt-1">
              {item.meta && <p className="t-meta mb-2 text-fg-3">{item.meta}</p>}
              {item.body && <p className="t-body max-w-[52ch] text-fg-2">{item.body}</p>}
              <span className="t-small mt-4 inline-flex items-center gap-2 font-medium text-[var(--btn-ink)]">
                {item.action}
                <Arrow className="group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}

/**
 * E. PROGRAMME: peers in two columns either side of a centre rule.
 *
 * For a short set of equals that each need a heading and a sentence: the
 * kinds of performance, what an online student needs. Set like a printed
 * concert programme, numbered when the order is the school's, marked with a
 * small diamond when it is not.
 */
export function ProgrammeList({
  items,
  numbered = true,
}: {
  items: { key: string | number; title: string; body: string }[]
  numbered?: boolean
}) {
  return (
    <ol className="border-t border-line md:grid md:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={item.key}
          className="reveal grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-line py-7 md:grid-cols-[3rem_1fr] md:py-9 md:odd:pr-10 md:even:border-l md:even:pl-10"
          style={{ '--i': i % 2 } as CSSProperties}
        >
          {numbered ? (
            <span aria-hidden="true" className="t-numeral pt-1 text-[1.25rem] text-kicker">
              {String(i + 1).padStart(2, '0')}
            </span>
          ) : (
            <span aria-hidden="true" className="mt-[0.7em] size-1.5 rotate-45 bg-mark" />
          )}
          <div>
            <h3 className="t-subhead text-fg">{item.title}</h3>
            <p className="t-body mt-3 max-w-[44ch] text-fg-2">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * F. LINK ROWS: where to go next, one ruled line each, the arrow at the end.
 *
 * For a handful of onward links that are each a destination in their own
 * right. Two columns on a wide screen when there are four or more.
 */
export function LinkRows({
  links,
  className = '',
}: {
  links: { href: string; label: string }[]
  className?: string
}) {
  return (
    <ul className={`border-t border-line ${links.length > 3 ? 'sm:grid sm:grid-cols-2 sm:gap-x-10' : ''} ${className}`}>
      {links.map((link) => (
        <li key={link.href} className="border-b border-line">
          <Link href={link.href} className="group flex min-h-14 items-center justify-between gap-4 py-4 no-underline">
            <span className="t-title text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
              {link.label}
            </span>
            <Arrow className="text-kicker group-hover:translate-x-1" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
