import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { PlaceholderFrame } from '@/components/ui/Ornament'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * The fold budget is 360 × ~640 CSS px — India's dominant mobile resolution is
 * 360×800 and Android is 92.4% of traffic. Locality, discipline and all three
 * delivery modes have to be literal scannable text inside that box. The poetry
 * lives in the eyebrow, not instead of the facts.
 *
 * The LCP element is deliberately the H1 TEXT on flat ivory, not a photograph —
 * which is also why shipping without client photography does not hurt the
 * page's most important paint.
 */
export async function Hero() {
  const site = await getSite()

  return (
    <section
      data-section="hero"
      data-has-content="true"
      className="border-b border-border"
    >
      <div className="u-shell grid items-center gap-10 py-14 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <p className="u-eyebrow">{site.tagline}</p>

          <h1 className="mt-5 text-[length:var(--text-step-4)] font-[300]">
            Carnatic music, taught the way it was meant to be.
          </h1>

          <p className="u-measure mt-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
            Vocal classes for children, teens and adults — at our{' '}
            <strong className="font-[400] text-text-primary">
              {site.locality}
            </strong>{' '}
            institute, <strong className="font-[400] text-text-primary">online</strong>
            , or at{' '}
            <strong className="font-[400] text-text-primary">
              your community clubhouse
            </strong>
            . Beginners welcome.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">Book a free trial class</ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('HERO')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>

          <p className="mt-4 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            Free first class. No fees, no commitment.
          </p>
        </div>

        <div>
          {/* Placeholder frame with the aspect ratio RESERVED, so swapping in a
              real photograph later costs exactly zero layout shift. */}
          <PlaceholderFrame
            aspect="4/5"
            label="Photograph to follow"
            className="mx-auto max-w-sm lg:max-w-none"
          />
        </div>
      </div>
    </section>
  )
}
