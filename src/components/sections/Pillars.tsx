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
export async function Pillars() {
  const pillars = await getPillars()

  return (
    <Section
      id="why-raaga"
      eyebrow="Why RAAGA"
      title="What you get here that you won’t get elsewhere."
      renderIf={pillars.length > 0}
    >
      <ul className="grid gap-x-14 md:grid-cols-2">
        {pillars.map((p) => (
          <li
            key={p.order}
            className="border-t border-border py-8 first:border-t-0 md:[&:nth-child(2)]:border-t-0"
          >
            <h3 className="max-w-[16ch] text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-accent">
              {p.title}
            </h3>
            <p className="u-measure mt-4 text-text-secondary">{p.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
