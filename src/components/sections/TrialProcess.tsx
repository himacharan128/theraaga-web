import { Section } from '@/components/layout/Section'

/**
 * Every CTA on this site says "Book a trial", but the immediate outcome is
 * a conversation. Without this strip the label is close to dishonest, and the
 * unanswered question — *what IS the trial?* — is exactly the friction that
 * kills the form.
 *
 * Three steps, static, no data dependency. Step 3 states plainly what the
 * trial is and is not, so it can never be confused with a recital or an open
 * event.
 */
const STEPS = [
  {
    n: 1,
    title: 'Enquire',
    body: 'A few questions take about thirty seconds. You can also message us on WhatsApp.',
  },
  {
    n: 2,
    title: 'Speak with RAAGA',
    body: 'We’ll call to understand who is learning, any previous training, and which times suit you.',
  },
  {
    n: 3,
    title: 'Attend your trial',
    body: 'One complete class with the teacher at Jubilee Hills, Hitech City or online. Bring nothing. It is a real lesson, not a demonstration or an event. Parents are welcome to sit in.',
  },
]

export function TrialProcess() {
  return (
    <Section
      id="trial"
      size="lead"
      eyebrow="Prārambham · How to begin"
      title="What actually happens next."
      tone="surface"
    >
      {/* NOT three cards.
          Boxing these forced all three to the height of the longest, which left
          two of them sitting in visible dead space — and it made a sequence
          look like a set of alternatives. A sequence wants a line through it,
          so the numerals sit ON a rule and the eye reads left to right. */}
      <ol className="relative grid gap-12 md:grid-cols-3 md:gap-10">
        {STEPS.map((s) => (
          <li
            key={s.n}
            /* The connector is drawn per step rather than as one rule across
               the row: a single spanning rule ran past 03 and trailed off into
               the margin, which is the sort of detail that reads as unfinished.
               Each step now joins to the next and the last one draws nothing.
               Width is the column plus the gap, less the numeral. */
            className="relative md:after:absolute md:after:left-[3.25rem] md:after:top-[1.375rem] md:after:h-px md:after:w-[calc(100%-0.75rem)] md:after:bg-gold-hairline md:after:opacity-50 md:after:content-[''] md:last:after:hidden"
          >
            <span
              aria-hidden="true"
              className="relative z-10 flex size-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] bg-bg font-[var(--font-ui)] text-[0.76rem] font-medium tracking-[0.12em] text-accent"
            >
              0{s.n}
            </span>
            <h3 className="mt-6 text-[length:var(--text-step-1)] font-[400]">
              {s.title}
            </h3>
            <p className="u-measure mt-3 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
