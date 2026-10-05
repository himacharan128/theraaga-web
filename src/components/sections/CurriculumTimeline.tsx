import { Section } from '@/components/layout/Section'
import { getCurriculum } from '@/data/content'

/**
 * Sangeetha Mārgam — the highest-value content on the site, and it needs
 * nothing from the client.
 *
 * Drumeo and Pianote sell an INVENTED "10-Level Method" as their core
 * differentiator. This progression is four centuries old, so it is simultaneously the
 * strongest "cultural institution" signal we own and the section that ships
 * complete on day one.
 *
 * Progressive disclosure via native <details>/<summary> rather than a React
 * accordion. Ten expanded stages is a wall of text on a 360px screen, but a JS
 * accordion would cost hydration on a page whose entire value is server-
 * rendered prose. <details> gives correct semantics, keyboard operation and
 * find-in-page for free, at zero bytes.
 *
 * No level badges, durations or source footnote: the owner removed them on
 * 2026-10-03. Each stage is its name, what it is and what it lets you do.
 */
export async function CurriculumTimeline() {
  const stages = await getCurriculum()

  return (
    <Section
      id="sangeetha-margam"
      eyebrow="Sangeetha Mārgam"
      title="The musical journey."
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
      <div className="mb-10 grid gap-4 border-y border-border py-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
        {[
          { title: 'Foundation', detail: 'Swaras · pitch · rhythm' },
          { title: 'Craft', detail: 'Repertoire · expression · control' },
          { title: 'Artistry', detail: 'Raga · improvisation · performance' },
        ].map((phase) => (
          <div key={phase.title} className="first:pl-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <p className="font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] text-accent">
              {phase.title}
            </p>
            <p className="mt-1 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
              {phase.detail}
            </p>
          </div>
        ))}
      </div>
      {/* A ruled list with the stage number in a fixed left rail. Each stage
          used to be its own bordered box hung off a gradient spine with a
          filled maroon disc; the order is already carried by the numbers. */}
      <ol className="border-t border-border">
        {stages.map((s) => (
          <li key={s.slug} className="flex gap-4 border-b border-border md:gap-7">
            <span
              aria-hidden="true"
              className="mt-[1.4rem] w-6 shrink-0 font-[var(--font-ui)] text-[length:var(--text-step--1)] tabular-nums text-text-muted md:w-8"
            >
              {String(s.order).padStart(2, '0')}
            </span>

            <details className="group flex-1">
              <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-4 transition-colors duration-[var(--dur-fast)] hover:[&_.stage-name]:text-accent [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="stage-name text-[length:var(--text-step-2)] font-[300] text-text-primary transition-colors duration-[var(--dur-fast)]">
                      {s.name}
                    </span>
                    <span className="deva text-[length:var(--text-step-0)] text-accent-muted">
                      {s.devanagari}
                    </span>
                  </span>
                  <span className="mt-1 block font-[var(--font-display)] italic text-text-muted">
                    {s.gloss}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center text-accent transition-transform duration-[var(--dur)] ease-[var(--ease-raaga)] group-open:rotate-45 motion-reduce:transition-none"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </summary>

              <div className="u-enter pb-7 pt-1">
                <p className="u-measure text-text-secondary">{s.body}</p>
                <p className="u-measure mt-4 border-l-2 border-gold-hairline/50 pl-4 text-text-secondary">
                  <span className="block font-[var(--font-ui)] text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-text-muted">
                    You will be able to
                  </span>
                  {s.outcome}
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>

    </Section>
  )
}
