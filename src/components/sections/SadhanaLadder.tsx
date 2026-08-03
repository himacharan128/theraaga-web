import { ButtonLink } from '@/components/ui/Button'
import { Section } from '@/components/layout/Section'
import { getLevels, LADDER_SOURCE } from '@/data/content'

const TIER_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const

/**
 * The highest-value section on the site, and it needs nothing from the client.
 *
 * Drumeo and Pianote sell an INVENTED "10-Level Method" as their core
 * differentiator. This ladder is four centuries old and verifiable against a
 * government university syllabus — so it is simultaneously the strongest
 * "cultural institution" signal we own and the section that ships complete on
 * day one.
 *
 * Every rung carries a plain Beginner/Intermediate/Advanced badge alongside the
 * Sanskrit: Sangeet Music Academy, Acharyanet and Go4Guru all pair the two, and
 * every aggregator search that matters is keyed on "beginner".
 *
 * The tanpura string is the spine — the same motif that serves as the guru
 * lineage thread. One motif, three jobs.
 */
export async function SadhanaLadder() {
  const levels = await getLevels()

  return (
    <Section
      id="sadhana"
      eyebrow="The path"
      title="From your first Sa to your own manodharma."
      tone="surface"
      lede={
        <p>
          Carnatic music has a published order, and it has had one for centuries.
          Here is exactly where a student begins, what comes next, and what each
          stage sounds like when it is done properly.
        </p>
      }
      renderIf={levels.length > 0}
    >
      <ol className="relative">
        {/* The spine. Decorative, static — no scroll-linked animation, because
            `animation-timeline: scroll()` is not Baseline and it would mean two
            code paths plus a @supports guard for something nobody notices. */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-gold-hairline/10 via-gold-hairline/45 to-gold-hairline/10 md:left-[19px]"
        />

        {levels.map((l) => (
          <li key={l.slug} className="relative flex gap-6 pb-10 last:pb-0 md:gap-9">
            <span
              aria-hidden="true"
              className="relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg font-[var(--font-ui)] text-[0.72rem] text-accent md:size-10"
            >
              {l.order}
            </span>

            <div className="flex-1 border-b border-border pb-8 last:border-0">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-[length:var(--text-step-2)] font-[300] text-text-primary">
                  {l.sanskrit}
                </h3>
                <span className="deva text-[length:var(--text-step-0)] text-accent-muted">
                  {l.devanagari}
                </span>
                <span className="font-[var(--font-display)] italic text-text-muted">
                  {l.gloss}
                </span>
              </div>

              <p className="u-measure mt-3 text-text-secondary">{l.outcome}</p>

              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-[var(--font-ui)] text-[length:var(--text-step--1)]">
                <span className="border border-border px-2.5 py-1 text-text-muted">
                  {TIER_LABEL[l.tier]}
                </span>
                <span className="text-text-muted">{l.duration}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="u-measure mt-12 border-l-2 border-gold-hairline/50 pl-5 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted">
        {LADDER_SOURCE}
      </p>

      <div className="mt-10">
        <ButtonLink href="/contact">Book a free trial class</ButtonLink>
      </div>
    </Section>
  )
}
