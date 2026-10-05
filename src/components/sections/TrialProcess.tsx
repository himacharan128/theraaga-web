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
      eyebrow="Prārambham · How to begin"
      title="What actually happens next."
      tone="surface"
    >
      {/* NOT three cards. Boxing these forced all three to the height of the
          longest and made a sequence look like a set of alternatives. Each
          step is a numeral over a hairline, so the row reads left to right
          without discs or connectors to carry it. */}
      <ol className="grid gap-10 md:grid-cols-3 md:gap-10">
        {STEPS.map((s) => (
          <li key={s.n} className="border-t border-border pt-6">
            <span
              aria-hidden="true"
              className="font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium tabular-nums text-accent"
            >
              0{s.n}
            </span>
            <h3 className="mt-3 text-[length:var(--text-step-1)] font-[400]">
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
