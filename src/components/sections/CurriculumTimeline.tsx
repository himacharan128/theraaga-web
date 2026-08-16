import { Section } from '@/components/layout/Section'
import { getCurriculum, CURRICULUM_SOURCE } from '@/data/content'

const TIER_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const

/**
 * Sangeetha Mārgam — the highest-value content on the site, and it needs
 * nothing from the client.
 *
 * Drumeo and Pianote sell an INVENTED "10-Level Method" as their core
 * differentiator. This progression is four centuries old and corroborated
 * against a government university syllabus, so it is simultaneously the
 * strongest "cultural institution" signal we own and the section that ships
 * complete on day one.
 *
 * Progressive disclosure via native <details>/<summary> rather than a React
 * accordion. Ten expanded stages is a wall of text on a 360px screen, but a JS
 * accordion would cost hydration on a page whose entire value is server-
 * rendered prose. <details> gives correct semantics, keyboard operation and
 * find-in-page for free, at zero bytes.
 *
 * Every stage carries a plain Beginner/Intermediate/Advanced badge alongside
 * the traditional name: Sangeet Music Academy, Acharyanet and Go4Guru all pair
 * the two, and every aggregator search that matters is keyed on "beginner".
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
      <ol className="relative">
        {/* The spine — the same tanpura string that threads the lineage.
            Decorative and static: `animation-timeline: scroll()` is not
            Baseline, and it would mean two code paths for something nobody
            notices. */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-gold-hairline/10 via-gold-hairline/45 to-gold-hairline/10 md:left-[19px]"
        />

        {stages.map((s) => (
          <li key={s.slug} className="relative flex gap-5 pb-6 last:pb-0 md:gap-9">
            <span
              aria-hidden="true"
              className="relative z-10 mt-3.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg font-[var(--font-ui)] text-[0.72rem] text-accent md:mt-3 md:size-10"
            >
              {s.order}
            </span>

            <details className="group flex-1 border-b border-border last:border-0">
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[length:var(--text-step-2)] font-[300] text-text-primary">
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
                  className="shrink-0 text-accent transition-transform duration-[var(--dur-fast)] ease-[var(--ease-raaga)] group-open:rotate-45 motion-reduce:transition-none"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </summary>

              <div className="pb-7 pt-1">
                <p className="u-measure text-text-secondary">{s.body}</p>
                <p className="u-measure mt-4 border-l-2 border-gold-hairline/50 pl-4 text-text-secondary">
                  <span className="block font-[var(--font-ui)] text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-text-muted">
                    You will be able to
                  </span>
                  {s.outcome}
                </p>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-[var(--font-ui)] text-[length:var(--text-step--1)]">
                  <span className="border border-border px-2.5 py-1 text-text-muted">
                    {TIER_LABEL[s.tier]}
                  </span>
                  <span className="text-text-muted">{s.duration}</span>
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>

      <p className="u-measure mt-12 border-l-2 border-gold-hairline/50 pl-5 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted">
        {CURRICULUM_SOURCE}
      </p>
    </Section>
  )
}
