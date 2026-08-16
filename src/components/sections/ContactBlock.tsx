import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { Section } from '@/components/layout/Section'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * Every institution studied puts full postal address and phone here. It is both
 * the trust anchor and the primary local-SEO NAP signal.
 *
 * We do NOT ship a map embed while there is no confirmed street address — a
 * click-to-load map of "Jubilee Hills" with no pin is worse than a line of text
 * and a WhatsApp button. It degrades to locality + city, which is honest.
 */
export async function ContactBlock() {
  const site = await getSite()

  return (
    <Section id="contact" eyebrow="Prārambha · Find us" title="Come and see us.">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <address className="not-italic text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)]">
            {site.streetAddress ? (
              <span className="block whitespace-pre-line">{site.streetAddress}</span>
            ) : null}
            <span className="block">
              {site.locality}, {site.city}
            </span>
            <span className="block text-text-muted">
              {site.region}, {site.country}
            </span>
          </address>

          <p className="mt-6 space-y-1">
            <a
              href={`tel:+${site.whatsapp}`}
              className="block text-accent underline underline-offset-4"
            >
              {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block text-accent underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Book a trial</ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('CONTACT')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </div>

        <div className="border-l-0 border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <h3 className="u-eyebrow">When we teach</h3>
          <dl className="mt-5 space-y-3 text-[length:var(--text-step--1)]">
            <div className="flex justify-between gap-6 border-b border-border pb-3">
              <dt className="text-text-secondary">Weekday evenings</dt>
              <dd className="text-text-muted">Institute &amp; online</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-border pb-3">
              <dt className="text-text-secondary">Weekend mornings</dt>
              <dd className="text-text-muted">Jubilee Hills &amp; Hitech City</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-text-secondary">Early mornings IST</dt>
              <dd className="text-text-muted">Online, for the US and UK</dd>
            </div>
          </dl>
          <p className="mt-6 text-[length:var(--text-step--1)] text-text-muted">
            Exact batch timings vary by term. Message us and we’ll tell you what
            is running now.
          </p>
        </div>
      </div>
    </Section>
  )
}
