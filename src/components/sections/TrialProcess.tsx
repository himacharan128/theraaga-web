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
    body: 'A few questions, about thirty seconds. Or message us on WhatsApp — that works equally well.',
  },
  {
    n: 2,
    title: 'Speak with RAAGA',
    body: 'We’ll call to understand who is learning, any previous training, and which times suit you.',
  },
  {
    n: 3,
    title: 'Attend your trial',
    body: 'One complete class with the teacher, with nothing to bring — at Jubilee Hills, Hitech City or online. It is a real lesson, not a demonstration or an event. Parents are welcome to sit in.',
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
      <ol className="grid gap-8 md:grid-cols-3 md:gap-12">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span
              aria-hidden="true"
              className="block font-[var(--font-display)] text-[length:var(--text-step-3)] font-[300] leading-none text-gold-hairline"
            >
              {s.n}
            </span>
            <h3 className="mt-4 text-[length:var(--text-step-1)] font-[400]">
              {s.title}
            </h3>
            <p className="mt-3 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
