import { Section } from '@/components/layout/Section'
import { getPillars } from '@/data/content'

/**
 * All six of the client's draft pillars were replaced.
 *
 * Five of them appeared near-verbatim on Shankar Mahadevan Academy's homepage —
 * "Performance Opportunities" was word-for-word identical, and "All Age Groups
 * Welcome" mirrored their "for all age groups". A differentiator that your
 * largest competitor already prints is not a differentiator.
 *
 * These lead with the two claims no national player can make: delivery into
 * how it teaches, how closely, in what order, and where that order leads.
 */
const WATERMARK = ['सा', 'रि', 'ग', 'म']

export async function Pillars() {
  const pillars = await getPillars()

  return (
    <Section
      id="why-raaga"
      eyebrow="Why RAAGA"
      title="What you get here that you won’t get elsewhere."
      renderIf={pillars.length > 0}
    >
      <ul className="rv-stagger grid gap-x-14 md:grid-cols-2">
        {pillars.map((p, i) => (
          <li
            key={p.order}
            className="relative border-t border-border py-9 first:border-t-0 md:py-10 md:[&:nth-child(2)]:border-t-0"
          >
            {/* The swara of the step, as a watermark that drifts against the
                scroll. Gold at low opacity: ornament, never text. */}
            <span
              aria-hidden="true"
              className="deva u-watermark rv-drift pointer-events-none absolute right-0 top-0 select-none text-gold-hairline opacity-[0.22]"
            >
              {WATERMARK[i % WATERMARK.length]}
            </span>
            <span
              aria-hidden="true"
              className="relative font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium tabular-nums text-accent-muted"
            >
              0{p.order}
            </span>
            <h3 className="relative mt-3 max-w-[16ch] text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-accent md:text-[length:var(--text-step-2)]">
              {p.title}
            </h3>
            <p className="u-measure relative mt-4 text-text-secondary">{p.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
