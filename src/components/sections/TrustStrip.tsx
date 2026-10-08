import type { CSSProperties } from 'react'
import { getSite } from '@/data/content'

/**
 * Proof without lying, set as the hero's colophon: four facts in a ruled row.
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
  if (stats.length === 0) return null

  return (
    <section id="trust" data-section="trust" data-has-content="true" className="relative">
      <div className="u-shell">
        <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal py-7 pr-4 md:py-9 ${i % 2 === 1 ? 'border-l border-line pl-5 md:pl-8' : ''} ${i > 1 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l lg:pl-8' : ''}`}
              style={{ '--i': i } as CSSProperties}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(1.625rem,1.2rem+1.6vw,2.5rem)] font-light leading-none tracking-[-0.02em] text-fg">
                  {s.value}
                </span>
                {/* The <dt> above already names the stat for assistive tech; hide
                    this visible copy so a screen reader does not read it twice. */}
                <span aria-hidden="true" className="t-small mt-3 block max-w-[24ch] text-fg-3">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
