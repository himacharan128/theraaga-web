import { EnquiryForm } from './EnquiryForm'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * Prārambham — the beginning. This is where the Sanskrit lives: as the section
 * eyebrow, never as the button label.
 *
 * Zero of nineteen benchmark music-school homepages use a non-literal primary
 * CTA. NN/g found "Get Started" creates confusion because it does not say what
 * is being started — the exact failure mode of "Begin Your Sādhana" on a button.
 * So the heading carries the brand and the button carries the outcome.
 */
export async function EnquirySection() {
  const site = await getSite()

  return (
    <section
      id="prarambha"
      data-section="prarambha"
      data-has-content="true"
      className="border-y border-border bg-surface py-[var(--spacing-section)]"
    >
      <div className="u-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="u-eyebrow">The enquiry</p>
          <h2 className="mt-4 text-[length:var(--text-step-3)] font-[300]">
            Book a trial class.
          </h2>
          <p className="u-measure mt-5 text-text-secondary">
            A few questions, about thirty seconds — then we will call to
            arrange a time that suits you.
          </p>

          <p className="mt-8 border-l-2 border-gold-hairline pl-5 text-[length:var(--text-step--1)] text-text-muted">
            We ask for your name and number, not your child’s. Nothing is shared
            with anyone, and you can ask us to delete your enquiry at any time —
            see our{' '}
            <a href="/privacy" className="text-accent underline underline-offset-4">
              privacy notice
            </a>
            .
          </p>

          <p className="mt-8 font-[var(--font-display)] text-[length:var(--text-step-1)] italic text-text-muted">
            <span className="deva not-italic text-accent">
              {site.sanskritLine.devanagari}
            </span>
            {' — '}
            {site.sanskritLine.gloss}
          </p>
        </div>

        <div>
          <EnquiryForm whatsappHref={whatsappHref('FORM')} />
        </div>
      </div>
    </section>
  )
}
