import Link from 'next/link'
import type { CSSProperties } from 'react'
import { EnquiryForm } from './EnquiryForm'
import { ProgrammeHeader } from '@/components/layout/PageHero'
import { WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref, telHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * Prārambham: the beginning.
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
      className="relative pt-[clamp(2rem,5vw,4.5rem)] pb-[var(--space-section)]"
    >
      <div className="u-shell grid gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-10">
        {/* `contents` on mobile so the three blocks are direct grid children and
            can be ordered independently; one sticky column at lg so the rail
            reads as a single piece and the WhatsApp route stays in view while
            the form is filled. */}
        <div className="contents lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-5 lg:block xl:col-span-4">
          <div className="order-1 lg:order-none">
            <ProgrammeHeader text="Prārambham · Begin the journey" />
            <h1 className="t-display on-load mt-6 text-fg md:mt-8" style={{ '--d': '60ms' } as CSSProperties}>
              Book a trial class.
            </h1>
            <p className="t-standfirst on-load mt-6 max-w-[34ch] text-fg-2" style={{ '--d': '200ms' } as CSSProperties}>
              Tell us who is learning and where suits you. We will call to arrange
              a time.
            </p>

            {/* The one thing a parent most wants to know before typing a phone
                number into a form belonging to a school they have not met. */}
            <p className="t-small on-load mt-8 max-w-[44ch] border-l border-mark pl-5 text-fg-3" style={{ '--d': '320ms' } as CSSProperties}>
              We ask for your name and number, never your child’s. Nothing is
              shared with anyone, and you can ask us to delete your enquiry at any
              time. See our{' '}
              <Link href="/privacy" className="link">
                privacy notice
              </Link>
              .
            </p>
          </div>

          <div className="order-3 border-t border-line pt-8 lg:order-none lg:mt-14">
            <p className="t-small text-fg-3">Would rather not fill a form?</p>
            <a
              href={whatsappHref('FORM_ASIDE')}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow mt-3"
            >
              <WhatsAppIcon />
              Message us on WhatsApp
            </a>
            <p className="t-small mt-4 text-fg-3">
              or call{' '}
              <a href={telHref()} className="link">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
        </div>

        {/* The form on a sheet of paper: the one grouped object on the page. */}
        <div className="order-2 lg:order-none lg:col-span-7 xl:col-span-7 xl:col-start-6">
          <div className="tone-paper on-load -mx-[var(--gutter)] border-y border-line px-[var(--gutter)] py-8 sm:mx-0 sm:border sm:p-8 md:p-10 xl:p-12" style={{ '--d': '160ms' } as CSSProperties}>
            <EnquiryForm whatsappHref={whatsappHref('FORM')} />
          </div>
        </div>
      </div>
    </section>
  )
}
