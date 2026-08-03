import { Section } from '@/components/layout/Section'
import { SwaraDivider } from '@/components/ui/Ornament'
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
 * gated-community clubhouses, and a published syllabus with real stage timings.
 */
export async function Pillars() {
  const pillars = await getPillars()

  return (
    <Section
      id="why-raaga"
      eyebrow="Why Raaga"
      title="What you get here that you won’t get elsewhere."
      renderIf={pillars.length > 0}
    >
      <ul className="grid gap-x-14 gap-y-10 md:grid-cols-2">
        {pillars.map((p, i) => (
          <li key={p.order}>
            {i > 0 && (
              <div className="mb-8 md:hidden">
                <SwaraDivider index={i} />
              </div>
            )}
            <h3 className="text-[length:var(--text-step-1)] font-[400] leading-[var(--lh-snug)] text-accent">
              {p.title}
            </h3>
            <p className="u-measure mt-3 text-text-secondary">{p.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
