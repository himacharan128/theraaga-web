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
    title: 'Speak with RAGA',
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
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {STEPS.map((s) => (
          <li key={s.n} className="relative overflow-hidden rounded-[var(--radius-md)] border border-border bg-[color-mix(in_srgb,var(--color-elevated)_76%,transparent)] p-6 shadow-[0_10px_24px_rgba(71,49,34,0.05)] md:p-7">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full bg-accent font-[var(--font-ui)] text-[0.76rem] font-medium tracking-[0.12em] text-on-accent shadow-[0_8px_18px_rgba(107,31,42,0.18)]"
            >
              0{s.n}
            </span>
            <h3 className="mt-7 text-[length:var(--text-step-1)] font-[400]">
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
