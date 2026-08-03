import { Section } from '@/components/layout/Section'

/**
 * Every CTA on this site says "Book a free trial class", but the actual outcome
 * is a phone call. Without this strip the label is very close to dishonest, and
 * the unanswered question — *what IS the trial?* — is exactly the friction that
 * kills the form.
 *
 * Three steps, static, no data dependency.
 */
const STEPS = [
  {
    n: 1,
    title: 'Tell us what you’d like to learn',
    body: 'Four questions, about thirty seconds. Or just message us on WhatsApp — that works equally well.',
  },
  {
    n: 2,
    title: 'We’ll call and agree a time',
    body: 'Usually the same evening. We’ll ask about age, any previous learning, and which of the three modes suits you.',
  },
  {
    n: 3,
    title: 'Come to a free Open Baithak',
    body: 'Thirty minutes, no charge, nothing to bring. Parents are welcome to sit in. If it isn’t right, that is a perfectly good outcome.',
  },
]

export function HowToStart() {
  return (
    <Section id="how-to-start" eyebrow="How to start" title="What actually happens next.">
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
