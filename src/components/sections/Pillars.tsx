import type { CSSProperties } from 'react'
import { Section } from '@/components/layout/Section'
import { getPillars } from '@/data/content'

/** The first four swaras, set faint behind the pillars like a watermark. */
const WATERMARK = ['स', 'रि', 'ग', 'म']

/**
 * Why RAAGA: four things the school can stand behind on day one, inside a
 * double brass frame, each led by a brass numeral. The numbering is a true
 * order (how it teaches, how closely, in what order, where that leads).
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
      <div className="frame-brass relative overflow-hidden p-5 md:p-10">
        <div aria-hidden="true" className="watermark">
          {WATERMARK.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <ol className="relative grid gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-9">
          {pillars.map((p, i) => (
            <li
              key={p.order}
              className="reveal grid grid-cols-[2.75rem_1fr] border-t border-line pt-4 md:block md:pt-5"
              style={{ '--i': i } as CSSProperties}
            >
              <span aria-hidden="true" className="t-numeral text-[2rem] leading-none text-accent-muted md:text-[2.5rem]">
                {p.order}
              </span>
              <div>
                <h3 className="t-title text-fg md:mt-3">{p.title}</h3>
                <p className="t-body mt-2 max-w-[40ch] text-fg-2">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
