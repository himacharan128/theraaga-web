import Link from 'next/link'
import Image from 'next/image'
import { AscendingScale } from '@/components/ui/Ornament'
import { getSite } from '@/data/content'

/**
 * A literal, not `new Date().getFullYear()`.
 *
 * Under `cacheComponents`, reading the clock in a Server Component without
 * first reading uncached or request data is a build error — and rightly so:
 * it would opt the footer, and therefore every page, out of static prerender
 * for a number that changes once a year.
 */
const COPYRIGHT_YEAR = 2026

/**
 * Every institution studied — Berklee, RCM, Merit, ICMP — carries full postal
 * address and phone in the footer. It is simultaneously the trust anchor and
 * the primary local-SEO NAP signal.
 *
 * The five legal links are non-negotiable: a payment aggregator checks for
 * exactly this list before activating a merchant ID, even pre-revenue.
 */
export async function Footer() {
  const site = await getSite()

  const columns = [
    {
      title: 'Learn',
      links: [
        { label: 'Learning · Sādhana', href: '/learning' },
        { label: 'Carnatic vocal classes in Hyderabad', href: '/carnatic-vocal-classes-hyderabad' },
        { label: 'Classes in Jubilee Hills', href: '/music-classes/jubilee-hills' },
        { label: 'Classes in Hitech City', href: '/music-classes/hitech-city' },
        { label: 'Online classes', href: '/online-classes' },
      ],
    },
    {
      title: 'The school',
      links: [
        { label: 'About · Parampara', href: '/about' },
        { label: 'The Gurus · Guru Parampara', href: '/gurus' },
        { label: 'Events · Sabha', href: '/events' },
        { label: 'Journal · Manana', href: '/journal' },
        { label: 'Gallery · Anubhava', href: '/gallery' },
        { label: 'Contact · Prārambham', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms of use', href: '/terms' },
        { label: 'Refund & cancellation', href: '/refund-policy' },
        { label: 'Child safeguarding', href: '/child-safeguarding' },
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] bg-ink text-on-accent">
      <span
        aria-hidden="true"
        className="absolute -right-24 -top-36 size-[34rem] rounded-full border border-[color-mix(in_srgb,var(--color-on-accent)_10%,transparent)]"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-40 -left-32 size-[30rem] rounded-full border border-[color-mix(in_srgb,var(--color-gold-hairline)_26%,transparent)]"
      />
      <div className="u-shell relative py-16 md:py-24">
        <div className="opacity-75">
          <AscendingScale />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex rounded-[var(--radius-sm)] bg-on-accent p-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
              {/* ASSET MISMATCH — needs the client to settle it.
              This file renders the wordmark as "raaga"; the client's content
              master and their own poster both spell the school "RAGA", which is
              what every string on the site now says. The image is theirs, so it
              is left alone rather than swapped for type — but the wordmark has
              to be regenerated as RAGA (or the copy reverted to Raaga) before
              launch, and the OG card frozen only after that. See README. */}
          <Image
                src="/brand/raaga-wordmark.webp"
                alt="RAGA, Sa. Pa. Sa."
                width={600}
                height={324}
                className="h-10 w-auto"
              />
            </div>
            <p className="mt-4 text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_72%,transparent)]">
              School of Carnatic Sangeetham
              <br />
              {site.locality}, {site.city}
            </p>
            <p className="mt-6">
              <span className="deva block text-[length:var(--text-step-1)] text-on-accent">
                {site.sanskritLine.devanagari}
              </span>
              <span className="mt-1 block font-[var(--font-display)] italic text-[color-mix(in_srgb,var(--color-on-accent)_72%,transparent)]">
                {site.sanskritLine.roman}: {site.sanskritLine.gloss}
              </span>
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="u-eyebrow mb-5 !text-[color-mix(in_srgb,var(--color-on-accent)_64%,transparent)]">{col.title}</h2>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_86%,transparent)] no-underline transition-colors hover:text-on-accent hover:underline hover:underline-offset-4"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="my-12 border-0 border-t border-[color-mix(in_srgb,var(--color-on-accent)_18%,transparent)]" />

        <address className="grid gap-6 not-italic md:grid-cols-2">
          <p className="text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_82%,transparent)]">
            {/* Street address is intentionally absent until the client confirms one.
                We do not invent a postal address or geo coordinates. */}
            {site.streetAddress ?? `${site.locality}, ${site.city}, ${site.region}`}
            <br />
            <a href={`tel:+${site.whatsapp}`} className="hover:text-on-accent">
              {site.phoneDisplay}
            </a>
            {' · '}
            <a href={`mailto:${site.email}`} className="hover:text-on-accent">
              {site.email}
            </a>
          </p>
          <p className="text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_62%,transparent)] md:text-right">
            © {COPYRIGHT_YEAR} {site.shortName}. All rights reserved.
            <br />
            Built to WCAG 2.2 AA and IS 17802. This site sets no tracking cookies.
          </p>
        </address>
      </div>
    </footer>
  )
}
