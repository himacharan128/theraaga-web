import type { Metadata } from 'next'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { SwaraDivider } from '@/components/ui/Ornament'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * A real 200-status route, not an inline success swap.
 *
 * A distinct URL gives analytics a conversion to fire on, is A/B testable, and
 * has a 100% view rate against 20–30% for a follow-up email.
 *
 * The secondary action is "Confirm on WhatsApp": it verifies the phone number
 * for free, opens Meta's 24-hour service window at zero API cost, and skips OTP
 * entirely — which would have cost ~20% of legitimate users plus ₹5,900 of DLT
 * registration and biometric authentication.
 */
export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <section className="u-shell py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="u-eyebrow">Prārambham · The beginning</p>
        <h1 className="mt-5 text-[length:var(--text-step-4)] font-[300]">
          Thank you for reaching out to RAAGA.
        </h1>
        <p className="u-measure mx-auto mt-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
          We are delighted to hear of your interest in Carnatic Sangeetham. A
          member of our team will connect with you shortly to understand your
          musical journey and help you choose the learning experience best
          suited to you.
        </p>

        <div className="my-12">
          <SwaraDivider index={0} />
        </div>

        <p className="u-measure mx-auto text-text-secondary">
          If you’d rather not wait for a call, message us on WhatsApp now — it
          reaches us straight away, and it means we already have your number.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={whatsappHref(
              'THANKYOU',
              'Hello RAAGA — I have just submitted the trial class form.',
            )}
          >
            <WhatsAppIcon />
            Confirm on WhatsApp
          </ButtonLink>
          <ButtonLink variant="secondary" href="/">
            Back to the school
          </ButtonLink>
        </div>

        <p className="mt-14 font-[var(--font-display)] italic text-text-muted">
          <span className="deva not-italic text-accent">नादब्रह्म</span> — sound
          is the divine.
        </p>
      </div>
    </section>
  )
}
