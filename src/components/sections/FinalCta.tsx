import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { AscendingScale } from '@/components/ui/Ornament'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The closing ask.
 *
 * The full enquiry form lives on /contact, not here — the homepage's job is to
 * get a decided visitor to a decision point, and a long form at the bottom of a
 * long page competes with the page rather than completing it.
 *
 * The ascending scale closes the metaphor the hero opened with: Sa to Sa.
 */
export function FinalCta() {
  return (
    <Section id="begin" tone="accent">
      <div className="mx-auto max-w-2xl text-center">
        <p className="u-eyebrow mb-4 !text-[color-mix(in_srgb,var(--color-on-accent)_78%,transparent)]">
          Prārambham · Begin your journey
        </p>
        <h2 className="text-[length:var(--text-step-3)] font-[300]">
          Start your musical journey.
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-[color-mix(in_srgb,var(--color-on-accent)_86%,transparent)]">
          Begin with a complete trial class at Jubilee Hills, Hitech City, or
          online. For children and adults, with no previous training needed.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink variant="onAccent" href="/contact">
            Book a trial
          </ButtonLink>
          <ButtonLink variant="onAccentGhost" href={whatsappHref('FINAL_CTA')}>
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>

        <div className="mt-14 opacity-70">
          <AscendingScale />
        </div>
      </div>
    </Section>
  )
}
