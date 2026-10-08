import type { CSSProperties } from 'react'
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
      layout="rail"
      eyebrow="Prārambham · How to begin"
      title="What actually happens next."
    >
      {/* A sequence, so a numbered list: each step a ruled row with its
          numeral in the margin, the rule above the first drawn as it arrives. */}
      <div aria-hidden="true" className="reveal reveal-draw draw-x h-px bg-line-strong/60" />
      <ol>
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            className="reveal grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-8 md:grid-cols-[6rem_1fr] md:gap-x-4 md:py-10"
            style={{ '--i': i + 1 } as CSSProperties}
          >
            <span aria-hidden="true" className="t-numeral text-[2.75rem] text-kicker md:text-[4rem]">
              {s.n}
            </span>
            <div className="md:pt-2">
              <h3 className="t-subhead text-fg">{s.title}</h3>
              <p className="t-body mt-3 max-w-[52ch] text-fg-2">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
