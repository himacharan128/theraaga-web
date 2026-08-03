import { Section } from '@/components/layout/Section'
import { getSite } from '@/data/content'

/**
 * Proof without lying.
 *
 * NEVER an animated counter. Merit School of Music and Furtados School of Music
 * both currently ship live production homepages reading "0 +" and "0+" for
 * Happy Students and Cities, because a count-up animation never fires. Render
 * nothing rather than a zero.
 *
 * Values are strings, and the whole strip hides at zero items.
 */
export async function TrustStrip() {
  const site = await getSite()
  const stats = site.stats ?? []

  return (
    <Section id="trust" renderIf={stats.length > 0} className="!py-12 md:!py-16">
      <dl className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg px-6 py-8 text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block font-[var(--font-display)] text-[length:var(--text-step-3)] font-[300] leading-none text-accent">
                {s.value}
              </span>
              <span className="mt-3 block font-[var(--font-ui)] text-[length:var(--text-step--1)] leading-[1.4] text-text-muted">
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
