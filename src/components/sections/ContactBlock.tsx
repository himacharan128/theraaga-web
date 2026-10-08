import type { CSSProperties } from 'react'
import { AddressLine } from '@/components/ui/AddressLine'
import { Arrow, ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { Section } from '@/components/layout/Section'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

const HOURS = [
  { when: 'Weekday evenings', where: 'Institute & online' },
  { when: 'Weekend mornings', where: 'Jubilee Hills & Hitech City' },
  { when: 'Early mornings IST', where: 'Online, for the US and UK' },
]

/**
 * Every institution studied puts full postal address and phone here. It is both
 * the trust anchor and the primary local-SEO NAP signal.
 *
 * We do NOT ship a map embed while there is no confirmed street address: a
 * click-to-load map of "Jubilee Hills" with no pin is worse than a line of text
 * and a WhatsApp button. It degrades to locality + city, which is honest.
 */
export async function ContactBlock() {
  const site = await getSite()

  return (
    <Section id="contact" tone="sand" eyebrow="Prārambha · Find us" title="Come and see us.">
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="reveal lg:col-span-6">
          <address className="t-subhead not-italic text-fg">
            {site.streetAddress ? (
              <span className="block text-balance">
                <AddressLine text={site.streetAddress} />
              </span>
            ) : null}
            <span className="block">
              {site.locality}, {site.city}
            </span>
          </address>
          <p className="t-small mt-3 text-fg-3">
            {site.region} {site.postalCode}, {site.country}
          </p>
          {site.mapsUrl && (
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6">
              Directions to Jubilee Hills
              <Arrow />
            </a>
          )}

          <p className="mt-8 flex flex-col items-start gap-1">
            <a
              href={`tel:+${site.whatsapp}`}
              className="t-title inline-flex min-h-11 items-center text-fg no-underline transition-colors hover:text-kicker"
            >
              {site.phoneDisplay}
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
            )}
          </p>

          {/* This block sits under the form on /contact, so the trial button
              returns to the form rather than reloading the page it is on. */}
          <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <ButtonLink href="/contact#prarambha" arrow>
              Book a trial
            </ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('CONTACT')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </div>

        {/* The timetable is a grouped set, so it is ruled like a programme;
            the address beside it needs no box at all. */}
        <div className="reveal lg:col-span-5 lg:col-start-8" style={{ '--i': 1 } as CSSProperties}>
          <h3 className="kicker">When we teach</h3>
          <dl className="mt-6 border-t border-line-strong/50">
            {HOURS.map((h) => (
              <div key={h.when} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                <dt className="t-title text-fg">{h.when}</dt>
                <dd className="t-small text-fg-2 sm:text-right">{h.where}</dd>
              </div>
            ))}
          </dl>
          <p className="t-small mt-6 max-w-[40ch] text-fg-3">
            Exact batch timings vary by term. Message us and we’ll tell you what
            is running now.
          </p>
        </div>
      </div>
    </Section>
  )
}
