import type { ReactNode } from 'react'

/**
 * Editorial layout primitives.
 *
 * Every section on this site had converged on one shape — eyebrow, title, grid
 * of bordered cards — repeated down every page. Uniform rhythm is the thing
 * that most makes a site read as generated: a human designer varies the shape
 * because different content *wants* different shapes, and the variation is
 * itself information.
 *
 * These four exist so that variation is a deliberate choice from a small
 * vocabulary rather than an ad-hoc invention per page. Each has a stated job.
 * If a fifth is ever needed, it needs a reason as specific as these.
 *
 * They also solve a recurring arithmetic bug. Grids orphan any item count that
 * does not divide by the column count — five commitments in two columns, seven
 * subjects in three. A list has no such failure mode, which is why the two
 * worst offenders became lists rather than differently-sized grids.
 */

/**
 * A. STATEMENT BAND — one sentence, the full width, nothing beside it.
 *
 * For a single declarative line that carries the weight of a whole page: a
 * vision, a promise. Putting it in the ordinary content column makes it read as
 * one more paragraph, which is precisely what it is not.
 */
export function StatementBand({
  eyebrow,
  children,
  attribution,
}: {
  eyebrow?: string
  children: ReactNode
  attribution?: ReactNode
}) {
  return (
    <section className="border-y border-border bg-accent py-[var(--spacing-section)] text-on-accent">
      <div className="u-shell">
        <div className="mx-auto max-w-4xl text-center">
          {eyebrow && (
            <p className="u-eyebrow mb-8 !text-[color-mix(in_srgb,var(--color-on-accent)_72%,transparent)]">
              {eyebrow}
            </p>
          )}
          <p className="text-balance font-[var(--font-display)] text-[length:var(--text-step-3)] font-[300] leading-[1.34]">
            {children}
          </p>
          {attribution && (
            <p className="mt-8 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_66%,transparent)]">
              {attribution}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * B. NUMBERED RAIL — an ordered set of commitments, one per row.
 *
 * For counts that are genuinely a sequence or an enumerated list rather than a
 * set of peers. The numeral sits in a fixed left rail so the titles align on a
 * hard vertical, which is what makes a list of five look composed instead of
 * left over.
 */
export function NumberedRail({
  items,
}: {
  items: { order: number; title: string; body: string }[]
}) {
  return (
    <ol className="border-t border-border">
      {items.map((item) => (
        <li
          key={item.order}
          className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-5 border-b border-border py-7 md:grid-cols-[4rem_16rem_1fr] md:gap-x-8 md:py-8"
        >
          <span
            aria-hidden="true"
            className="font-[var(--font-display)] text-[length:var(--text-step-0)] font-[300] text-gold-hairline"
          >
            {String(item.order).padStart(2, '0')}
          </span>
          <h3 className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-text-primary">
            {item.title}
          </h3>
          <p className="col-start-2 mt-2 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary md:col-start-3 md:mt-0">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  )
}

/**
 * C. LEDGER INDEX — term on the left, description on the right, hairline rows.
 *
 * For an unordered reference set: the kinds of gathering a school holds, the
 * subjects it writes about. It reads like a programme or a contents page, which
 * is what those things actually are, and it takes any item count without
 * orphaning one.
 */
export function LedgerIndex({
  items,
}: {
  items: { key: string | number; term: string; aside?: string; body: string }[]
}) {
  return (
    <dl className="border-t border-border">
      {items.map((item) => (
        <div
          key={item.key}
          className="grid items-baseline gap-x-10 gap-y-2 border-b border-border py-6 md:grid-cols-[18rem_1fr] md:py-7"
        >
          <dt className="flex items-baseline gap-3">
            <span className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-accent">
              {item.term}
            </span>
            {item.aside && (
              <span aria-hidden="true" className="deva text-[length:var(--text-step--1)] text-gold-hairline">
                {item.aside}
              </span>
            )}
          </dt>
          <dd className="text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
            {item.body}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * D. STICKY ASIDE — a label that holds its place while long prose scrolls past.
 *
 * For the one or two places with a genuinely long argument to make. The label
 * anchors the reader in a way a heading at the top of 400 words cannot, and the
 * asymmetry gives the page a different silhouette from every stacked section
 * above it.
 */
export function StickyAside({
  label,
  aside,
  children,
}: {
  label: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="u-eyebrow">{label}</p>
        {aside && (
          <div className="mt-6 hidden border-l-2 border-gold-hairline/50 pl-5 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted lg:block">
            {aside}
          </div>
        )}
      </div>
      <div className="u-measure space-y-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
        {children}
      </div>
    </div>
  )
}
