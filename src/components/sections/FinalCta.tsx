import type { CSSProperties } from 'react'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The closing ask, and the maroon close of every page except /contact.
 *
 * The full enquiry form lives on /contact, not here: a long form at the bottom
 * of a long page competes with the page rather than completing it. The
 * heading says "trial class" so it matches the buttons and does not repeat
 * the hero's "Begin Your Musical Journey".
 *
 * Composed as a closing statement rather than a centred banner: the heading
 * at display scale on the left, the terms and the two actions on the right,
 * on the same baseline. The only ornament is the brass rule it opens on.
 */
export function FinalCta() {
  return (
    <section id="begin" data-section="begin" data-has-content="true" data-tone="dark" className="tone-maroon">
      <div className="u-shell pad-section">
        <div aria-hidden="true" className="reveal reveal-draw draw-x mb-[clamp(2.5rem,6vw,4.5rem)] h-px bg-mark" />
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className="reveal lg:col-span-7">
            <p className="kicker mb-6">Prārambham · Begin</p>
            <h2 className="t-display max-w-[12ch] text-fg">Come for a trial class.</h2>
          </div>
          <div className="reveal lg:col-span-5 lg:pb-2" style={{ '--i': 1 } as CSSProperties}>
            <p className="t-standfirst max-w-[34ch] text-fg-2">
              Begin with a complete trial class at Jubilee Hills, Hitech City, or
              online. For children and adults, with no previous training needed.
            </p>
            <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
              <ButtonLink href="/contact" arrow>
                Book a trial
              </ButtonLink>
              <ButtonLink variant="secondary" href={whatsappHref('FINAL_CTA')}>
                <WhatsAppIcon />
                Ask on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
