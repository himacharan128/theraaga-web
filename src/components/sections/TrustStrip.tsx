import type { CSSProperties } from 'react'
import { getSite } from '@/data/content'

/**
 * Four facts in words, under the hero, each led by a small brass star. Values
 * are STRINGS, never counters: Merit School of Music and Furtados both ship
 * homepages reading "0 +" because a count-up never fired.
 */
export async function TrustStrip() {
  const site = await getSite()
  const stats = site.stats ?? []
  if (stats.length === 0) return null

  return (
    <section id="trust" data-section="trust" data-has-content="true" className="relative border-b border-line">
      <div className="u-shell">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 lg:grid-cols-4 lg:py-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="reveal relative pl-5"
              style={{ '--i': i } as CSSProperties}
            >
              <span aria-hidden="true" className="t-label absolute top-1 left-0 text-accent-muted">
                ✦
              </span>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="t-subhead block text-fg">
                  {s.value}
                </span>
                {/* The <dt> above already names the stat for assistive tech; hide
                    this visible copy so a screen reader does not read it twice. */}
                <span aria-hidden="true" className="t-small mt-1.5 block max-w-[22ch] text-fg-3">
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
