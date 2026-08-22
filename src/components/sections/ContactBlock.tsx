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
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-border bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)] p-7 shadow-[0_10px_24px_rgba(71,49,34,0.05)] md:p-9">
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
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="block text-accent underline underline-offset-4"
              >
                {site.email}
              </a>
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Book a trial</ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('CONTACT')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] bg-[linear-gradient(145deg,#7a2934,#511721)] p-7 text-on-accent shadow-[var(--shadow-soft)] md:p-9">
          <h3 className="u-eyebrow !text-[color-mix(in_srgb,var(--color-on-accent)_70%,transparent)]">When we teach</h3>
          <dl className="mt-5 space-y-3 text-[length:var(--text-step--1)]">
            <div className="flex justify-between gap-6 border-b border-[color-mix(in_srgb,var(--color-on-accent)_16%,transparent)] pb-3">
              <dt className="text-[color-mix(in_srgb,var(--color-on-accent)_88%,transparent)]">Weekday evenings</dt>
              <dd className="text-right text-[color-mix(in_srgb,var(--color-on-accent)_62%,transparent)]">Institute &amp; online</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-[color-mix(in_srgb,var(--color-on-accent)_16%,transparent)] pb-3">
              <dt className="text-[color-mix(in_srgb,var(--color-on-accent)_88%,transparent)]">Weekend mornings</dt>
              <dd className="text-right text-[color-mix(in_srgb,var(--color-on-accent)_62%,transparent)]">Jubilee Hills &amp; Hitech City</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-[color-mix(in_srgb,var(--color-on-accent)_88%,transparent)]">Early mornings IST</dt>
              <dd className="text-right text-[color-mix(in_srgb,var(--color-on-accent)_62%,transparent)]">Online, for the US and UK</dd>
            </div>
          </dl>
          <p className="mt-6 text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_68%,transparent)]">
            Exact batch timings vary by term. Message us and we’ll tell you what
            is running now.
          </p>
        </div>
      </div>
    </Section>
  )
}
