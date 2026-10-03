import { EnquiryForm } from './EnquiryForm'
import { WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref, telHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * Prārambham — the beginning.
 *
 * Two things were wrong with the previous layout and both came from the same
 * decision: the two columns were vertically CENTRED against each other. The
 * form is well over a thousand pixels tall and the supporting column is a few
 * hundred, so the supporting column floated in the middle of an enormous void —
 * which is what made the page look broken rather than merely plain.
 *
 * It is now top-aligned, and the supporting column is split in two so the
 * order can differ by breakpoint. On mobile everything stacks, and putting the
 * whole rail first pushed the first field roughly a screen below the fold on a
 * 390px phone — someone who arrived to fill a form had to scroll past all the
 * reassurance to reach it. The heading and the privacy note stay above (both
 * are read before you type a phone number); the WhatsApp alternative moves
 * below, where it is an escape hatch rather than an obstacle.
 *
 * This section is used on /contact only. Every other page ends with FinalCta,
 * which sends the visitor here, so there is one form and one closing ask. Here
 * it IS the page, so it carries the h1 and the page drops its hero — which
 * removed a second competing intro directly above the form.
 */
export async function EnquirySection() {
  const site = await getSite()

  return (
    <section
      id="prarambha"
      data-section="prarambha"
      data-has-content="true"
      className="border-b border-border bg-surface py-[var(--spacing-section)]"
    >
      <div className="u-shell grid gap-10 lg:grid-cols-[21rem_1fr] lg:items-start lg:gap-16 xl:gap-20">
        {/* `contents` on mobile so the three blocks are direct grid children and
            can be ordered independently; a plain column at lg so the rail reads
            as one piece. Placing the escape hatch in an explicit second row
            instead left a gap the height of the form's overhang. */}
        <div className="contents lg:block lg:col-start-1 lg:row-start-1">
        <div className="order-1 lg:order-none">
          <p className="u-eyebrow">Prārambham · Begin the journey</p>
          <h1 className="mt-4 text-[length:var(--text-step-3)] font-[300] leading-[var(--lh-snug)]">
            Book a trial class.
          </h1>
          <p className="mt-5 text-text-secondary">
            Tell us who is learning and where suits you. We will call to arrange
            a time.
          </p>

          {/* The one thing a parent most wants to know before typing a phone
              number into a form belonging to a school they have not met. */}
          <p className="mt-8 border-l-2 border-gold-hairline pl-5 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-muted">
            We ask for your name and number, never your child’s. Nothing is
            shared with anyone, and you can ask us to delete your enquiry at any
            time. See our{' '}
            <a href="/privacy" className="text-accent underline underline-offset-4">
              privacy notice
            </a>
            .
          </p>
        </div>

        <div className="order-3 border-t border-border pt-8 lg:order-none lg:mt-8">
          <p className="font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            Would rather not fill a form?
          </p>
          <a
            href={whatsappHref('FORM_ASIDE')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2.5 font-[var(--font-ui)] text-[length:var(--text-step-0)] font-medium text-accent underline decoration-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] underline-offset-[6px] hover:decoration-current"
          >
            <WhatsAppIcon />
            Message us on WhatsApp
          </a>
          <p className="mt-4 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            or call{' '}
            <a href={telHref()} className="text-accent underline underline-offset-4">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
        </div>

        <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1">
          <EnquiryForm whatsappHref={whatsappHref('FORM')} />
        </div>
      </div>
    </section>
  )
}
