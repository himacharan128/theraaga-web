import type { CSSProperties } from 'react'
import { Section } from '@/components/layout/Section'
import { getCurriculum } from '@/data/content'
import type { CurriculumStage, Tier } from '@/content/types'

/**
 * Sangeetha Mārgam: the highest-value content on the site, and it needs
 * nothing from the client.
 *
 * Drumeo and Pianote sell an INVENTED "10-Level Method" as their core
 * differentiator. This progression is four centuries old, so it is simultaneously the
 * strongest "cultural institution" signal we own and the section that ships
 * complete on day one.
 *
 * Composed as a journey rather than ten equal boxes. On a wide screen it opens
 * on a map: the ten stages strung along one line under the three phases this
 * section has always named, each stage a link down to its entry. Below, the
 * stages are read phase by phase, the phase held in a rail beside its stages;
 * on a phone the phase simply heads them. Each stage sits in the phase its own
 * tier puts it in, so the grouping is the data's, not the layout's.
 *
 * Progressive disclosure via native <details>/<summary> rather than a React
 * accordion. Ten expanded stages is a wall of text on a 360px screen, but a JS
 * accordion would cost hydration on a page whose entire value is server-
 * rendered prose. <details> gives correct semantics, keyboard operation and
 * find-in-page for free, at zero bytes. The first stage opens by default so
 * the page shows what a stage holds before anyone has to ask.
 *
 * No level badges, durations or source footnote: the owner removed them on
 * 2026-10-03. Each stage is its name, what it is and what it lets you do.
 */
const PHASES: { tier: Tier; title: string; detail: string }[] = [
  { tier: 'beginner', title: 'Foundation', detail: 'Swaras · pitch · rhythm' },
  { tier: 'intermediate', title: 'Craft', detail: 'Repertoire · expression · control' },
  { tier: 'advanced', title: 'Artistry', detail: 'Raga · improvisation · performance' },
]

type Group = { title: string; detail: string; stages: CurriculumStage[] }

/** "Raga · improvisation · performance", wrapping after a middot, never before one. */
const keepDots = (text: string) => text.replace(/ · /g, '\u00a0· ')

const anchor = (s: CurriculumStage) => `stage-${s.slug}`
const nn = (n: number) => String(n).padStart(2, '0')

export async function CurriculumTimeline() {
  const stages = await getCurriculum()
  const groups: Group[] = PHASES.map((p) => ({
    title: p.title,
    detail: p.detail,
    stages: stages.filter((s) => s.tier === p.tier),
  })).filter((g) => g.stages.length > 0)

  return (
    <Section
      id="sangeetha-margam"
      eyebrow="Sangeetha Mārgam"
      title="The musical journey."
      layout="split"
      lede={
        <p>
          Carnatic music has a published order, and it has had one for
          centuries. Here is exactly where a student begins, what comes next,
          and what each stage sounds like when it is done properly. Open any
          stage to read more.
        </p>
      }
      renderIf={stages.length > 0}
    >
      <JourneyMap groups={groups} />

      <div className="space-y-14 md:space-y-20">
        {groups.map((g) => (
          <div key={g.title} className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-10">
            <header className="reveal lg:col-span-3">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <h3 className="t-subhead italic text-accent">{g.title}</h3>
                <p className="t-meta mt-2 text-fg-3">{keepDots(g.detail)}</p>
              </div>
            </header>
            <ol start={g.stages[0].order} className="border-t border-line lg:col-span-9">
              {g.stages.map((s, i) => (
                <Stage key={s.slug} stage={s} open={s.order === stages[0].order} i={i} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  )
}

/**
 * The ten stages on one line, the line warming from hairline to brass as it
 * goes and running on past the last stage, which takes a lifetime. Only where
 * ten stage names fit side by side (1280px and up); narrower, the grouped list
 * below already reads in order.
 */
function JourneyMap({ groups }: { groups: Group[] }) {
  const all = groups.flatMap((g) => g.stages)
  const columns = { gridTemplateColumns: `repeat(${all.length}, minmax(0, 1fr))` } as CSSProperties
  const opensPhase = new Set(groups.map((g) => g.stages[0].slug))

  return (
    <nav aria-label="The stages at a glance" className="reveal mb-24 hidden xl:block">
      <div className="grid gap-x-3" style={columns}>
        {groups.map((g) => (
          <div
            key={g.title}
            className="border-t border-line-strong pt-3 pr-4"
            style={{ gridColumn: `span ${g.stages.length}` }}
          >
            <p className="t-label text-kicker">{g.title}</p>
            <p className="t-meta mt-1 text-fg-3">{keepDots(g.detail)}</p>
          </div>
        ))}
      </div>

      <ol className="relative mt-10 grid gap-x-3" style={columns}>
        <span
          aria-hidden="true"
          className="reveal reveal-draw draw-x absolute inset-x-0 top-[0.3125rem] h-px bg-[linear-gradient(to_right,var(--line-strong),var(--mark)_70%,transparent)]"
          style={{ '--i': 2 } as CSSProperties}
        />
        {all.map((s) => (
          <li key={s.slug} className="relative">
            <a href={`#${anchor(s)}`} className="group block no-underline">
              <span
                aria-hidden="true"
                className={`block size-2.5 rotate-45 border border-[var(--mark)] transition-colors duration-[var(--dur-2)] group-hover:bg-[var(--mark)] ${
                  opensPhase.has(s.slug) ? 'bg-[var(--mark)]' : 'bg-[var(--tone-bg)]'
                }`}
              />
              <span aria-hidden="true" className="t-meta mt-5 block text-fg-3">
                {nn(s.order)}
              </span>
              <span className="t-small mt-1 block text-fg-2 transition-colors duration-[var(--dur-1)] group-hover:text-kicker">
                {s.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Stage({ stage: s, open, i }: { stage: CurriculumStage; open: boolean; i: number }) {
  return (
    <li
      id={anchor(s)}
      className="reveal scroll-mt-[calc(var(--header-h)+1.5rem)] border-b border-line"
      style={{ '--i': i % 4 } as CSSProperties}
    >
      <details className="group" open={open}>
        <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2.75rem_1fr_auto] items-baseline gap-x-3 py-6 md:grid-cols-[5rem_1fr_auto] md:gap-x-6 md:py-8 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="t-numeral text-[2rem] text-accent-muted md:text-[3rem]">
            {nn(s.order)}
          </span>
          <span>
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="t-subhead text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
                {s.name}
              </span>
              <span lang="sa" className="deva text-[1.125rem] text-accent-muted">
                {s.devanagari}
              </span>
            </span>
            <span className="t-caption mt-1 block text-fg-3">{s.gloss}</span>
          </span>
          <span aria-hidden="true" className="relative ml-2 size-3.5 self-center text-kicker">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-[var(--dur-2)] ease-[var(--ease-out-expo)] group-open:scale-y-0" />
          </span>
        </summary>

        <div className="unfold grid gap-6 pb-9 pl-[3.5rem] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-10 md:pb-12 md:pl-[6.5rem]">
          <p className="t-prose max-w-[56ch] text-fg-2">{s.body}</p>
          <div className="border-l border-mark pl-5 md:self-start">
            <p className="t-label text-kicker">You will be able to</p>
            <p className="t-standfirst mt-3 text-fg">{s.outcome}</p>
          </div>
        </div>
      </details>
    </li>
  )
}
