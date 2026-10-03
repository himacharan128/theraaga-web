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
    <Section id="trust" renderIf={stats.length > 0} className="!py-10 md:!py-12">
      <dl className="grid grid-cols-2 gap-y-7 border-y border-border py-7 lg:grid-cols-4 lg:gap-y-0">
        {stats.map((s) => (
          <div key={s.label} className="relative px-5 text-center sm:px-6">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              {/* Step-2 below sm: at step-3 the two-up cells at 375px are ~127px
                  wide and 'A decade' broke onto two lines, stranding 'A'. */}
              <span className="block font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] leading-none text-accent sm:text-[length:var(--text-step-3)]">
                {s.value}
              </span>
              {/* The <dt> above already names the stat for assistive tech; hide
                  this visible copy so a screen reader does not read it twice. */}
              <span
                aria-hidden="true"
                className="mt-3 block font-[var(--font-ui)] text-[length:var(--text-step--1)] leading-[1.4] text-text-muted"
              >
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
