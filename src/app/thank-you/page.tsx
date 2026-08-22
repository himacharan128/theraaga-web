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
    <section className="u-shell py-16 md:py-24">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(145deg,#7a2934,#511721)] px-6 py-14 text-center text-on-accent shadow-[var(--shadow-lift)] sm:px-10 md:px-16 md:py-20">
        <span aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full border border-[color-mix(in_srgb,var(--color-on-accent)_16%,transparent)]" />
        <span aria-hidden="true" className="absolute -bottom-32 -left-24 size-72 rounded-full border border-[color-mix(in_srgb,var(--color-gold-hairline)_34%,transparent)]" />
        <div className="relative">
        <p className="u-eyebrow !text-[color-mix(in_srgb,var(--color-on-accent)_70%,transparent)]">Prārambham · The beginning</p>
        <h1 className="mt-5 text-[length:var(--text-step-4)] font-[300] text-on-accent">
          Thank you for reaching out to RAGA.
        </h1>
        <p className="u-measure mx-auto mt-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-[color-mix(in_srgb,var(--color-on-accent)_84%,transparent)]">
          We are delighted to hear of your interest in Carnatic Sangeetham. A
          member of our team will connect with you shortly to understand your
          musical journey and help you choose the learning experience best
          suited to you.
        </p>

        <div className="my-12 opacity-70">
          <SwaraDivider index={0} />
        </div>

        <p className="u-measure mx-auto text-[color-mix(in_srgb,var(--color-on-accent)_78%,transparent)]">
          If you’d rather not wait for a call, message us on WhatsApp now. It
          reaches us straight away, and it means we already have your number.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={whatsappHref(
              'THANKYOU',
              'Hello RAGA, I have just submitted the trial class form.',
            )}
            variant="onAccent"
          >
            <WhatsAppIcon />
            Confirm on WhatsApp
          </ButtonLink>
          <ButtonLink variant="onAccentGhost" href="/">
            Back to the school
          </ButtonLink>
        </div>

        <p className="mt-14 font-[var(--font-display)] italic text-[color-mix(in_srgb,var(--color-on-accent)_68%,transparent)]">
          <span className="deva not-italic text-on-accent">नादब्रह्म</span>: sound
          is the divine.
        </p>
        </div>
      </div>
    </section>
  )
}
