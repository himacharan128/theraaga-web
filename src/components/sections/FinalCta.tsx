import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The closing ask.
 *
 * The one closing ask on every page except /contact. The full enquiry form
 * lives on /contact, not here — a long form at the bottom of a long page
 * competes with the page rather than completing it. The heading says "trial
 * class" so it matches the buttons and does not repeat the hero's "Begin Your
 * Musical Journey".
 *
 * No ornament here. The ascending scale (Sa to Sa) that closes the metaphor the
 * hero opened with lives at the top of the Footer, which this band always sits
 * directly above; rendering it in both put the same ornament on screen twice,
 * back to back.
 */
export function FinalCta() {
  return (
    <Section id="begin" tone="accent">
      <div className="mx-auto max-w-2xl text-center">
        <p className="u-eyebrow mb-4 !text-[color-mix(in_srgb,var(--color-on-accent)_78%,transparent)]">
          Prārambham · Begin
        </p>
        <h2 className="text-[length:var(--text-step-3)] font-[300]">
          Come for a trial class.
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-[color-mix(in_srgb,var(--color-on-accent)_86%,transparent)]">
          Begin with a complete trial class at Jubilee Hills, Hitech City, or
          online. For children and adults, with no previous training needed.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/contact">
            Book a trial
          </ButtonLink>
          <ButtonLink variant="secondary" href={whatsappHref('FINAL_CTA')}>
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
