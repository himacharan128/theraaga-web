import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { ProgrammeHeader } from '@/components/layout/PageHero'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * A real 200-status route, not an inline success swap.
 *
 * A distinct URL gives analytics a conversion to fire on, is A/B testable, and
 * has a 100% view rate against 20-30% for a follow-up email.
 *
 * The secondary action is "Confirm on WhatsApp": it verifies the phone number
 * for free, opens Meta's 24-hour service window at zero API cost, and skips OTP
 * entirely, which would have cost ~20% of legitimate users plus ₹5,900 of DLT
 * registration and biometric authentication.
 *
 * Composed as the maroon close every other page ends on, because for this
 * visitor it is the close: the stage slides up under the header like the dark
 * heroes, the thanks at display scale, and beside it what happens next. The
 * one ornament is Sa, the first swara, on a brass rule.
 */
export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
}

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function ThankYouPage() {
  return (
    <section
      data-hero-tone="maroon"
      data-tone="dark"
      className="tone-maroon relative -mt-[var(--header-h)] pt-[calc(var(--header-h)+clamp(3rem,8vw,7rem))] pb-[clamp(3.5rem,8vw,7rem)]"
    >
      <div className="u-shell">
        <ProgrammeHeader text="Prārambham · The beginning" />

        <div className="mt-6 grid gap-x-10 gap-y-10 md:mt-8 lg:grid-cols-12">
          <h1 className="on-load t-display max-w-[14ch] text-fg lg:col-span-7" style={d(60)}>
            Thank you for reaching out to RAAGA.
          </h1>

          <div className="on-load lg:col-span-5 lg:pt-3" style={d(240)}>
            <p className="t-standfirst max-w-[40ch] text-fg-2">
              We are delighted to hear of your interest in Carnatic Sangeetham. A
              member of our team will connect with you shortly to understand your
              musical journey and help you choose the learning experience best
              suited to you.
            </p>

            <div aria-hidden="true" className="my-9 flex items-center gap-4 md:my-10">
              <span lang="sa" className="deva text-[1.375rem] leading-none text-kicker">
                सा
              </span>
              <span className="on-load-draw draw-x h-px flex-1 bg-mark" />
            </div>

            <p className="t-body max-w-[44ch] text-fg-2">
              If you’d rather not wait for a call, message us on WhatsApp now. It
              reaches us straight away, and it means we already have your number.
            </p>

            <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
              <ButtonLink
                href={whatsappHref(
                  'THANKYOU',
                  'Hello RAAGA, I have just submitted the trial class form.',
                )}
              >
                <WhatsAppIcon />
                Confirm on WhatsApp
              </ButtonLink>
              <ButtonLink variant="secondary" href="/">
                Back to the school
              </ButtonLink>
            </div>
          </div>
        </div>

        <p
          className="on-load t-caption mt-[clamp(3.5rem,8vw,6rem)] border-t border-line pt-8 text-fg-2 md:text-[1.0625rem]"
          style={d(420)}
        >
          <span lang="sa" className="deva text-[1.2em] leading-none not-italic text-fg">
            नादब्रह्म
          </span>
          : sound is the divine.
        </p>
      </div>
    </section>
  )
}
