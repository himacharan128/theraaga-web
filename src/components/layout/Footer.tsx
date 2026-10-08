import Link from 'next/link'
import { Wordmark } from '@/components/ui/Wordmark'
import { getSite } from '@/data/content'

/**
 * A literal, not `new Date().getFullYear()`.
 *
 * Under `cacheComponents`, reading the clock in a Server Component without
 * first reading uncached or request data is a build error, and rightly so:
 * it would opt the footer, and therefore every page, out of static prerender
 * for a number that changes once a year.
 */
const COPYRIGHT_YEAR = 2026

/**
 * The close of every page: the school's line in Sanskrit as its last word,
 * then the address, the routes and the policies.
 *
 * Every institution studied (Berklee, RCM, Merit, ICMP) carries full postal
 * address and phone in the footer. It is simultaneously the trust anchor and
 * the primary local-SEO NAP signal.
 *
 * The legal links are non-negotiable: a payment aggregator checks for exactly
 * this list before activating a merchant ID, even pre-revenue.
 */
export async function Footer() {
  const site = await getSite()

  const columns = [
    {
      title: 'Learn',
      links: [
        { label: 'Getting started with Carnatic music', href: '/getting-started' },
        { label: 'Learning', href: '/learning' },
        { label: 'Classes in Jubilee Hills', href: '/music-classes/jubilee-hills' },
        { label: 'Classes in Hitech City', href: '/music-classes/hitech-city' },
        { label: 'Online classes', href: '/online-classes' },
      ],
    },
    {
      title: 'The school',
      links: [
        { label: 'About', href: '/about' },
        { label: 'The Gurus', href: '/gurus' },
        { label: 'Events', href: '/events' },
        { label: 'Journal', href: '/journal' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Contact', href: '/contact' },
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
    <footer data-site-footer data-tone="dark" className="tone-night">
      <div className="u-shell pt-[clamp(4rem,9vw,7.5rem)] pb-10">
        <p className="reveal max-w-4xl">
          <span lang="sa" className="deva block text-[clamp(2.5rem,1.6rem+4vw,4.75rem)] leading-[1.25] text-fg">
            {site.sanskritLine.devanagari}
          </span>
          <span className="mt-3 block font-display text-[length:var(--fs-standfirst)] italic text-fg-2">
            {site.sanskritLine.roman}: {site.sanskritLine.gloss}
          </span>
        </p>

        <div className="mt-[clamp(3rem,7vw,5.5rem)] grid gap-x-10 gap-y-12 border-t border-line pt-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="RAAGA Home" className="inline-flex min-h-11 items-center">
              <Wordmark className="[--wm:2.75rem]" />
            </Link>
            <address className="t-small mt-6 not-italic text-fg-2">
              School of Indian Classical Music
              <br />
              {site.streetAddress && (
                <>
                  {site.streetAddress}
                  <br />
                </>
              )}
              {site.locality}, {site.city} {site.postalCode}
              <br />
              <a
                href={`tel:+${site.whatsapp}`}
                className="mt-2 inline-flex min-h-7 items-center text-fg no-underline hover:text-kicker"
              >
                {site.phoneDisplay}
              </a>
              {site.email && (
                <>
                  <br />
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex min-h-7 items-center text-fg no-underline hover:text-kicker"
                  >
                    {site.email}
                  </a>
                </>
              )}
            </address>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="t-label mb-4 text-kicker">{col.title}</h2>
                <ul className="space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="nav-link inline-flex min-h-7 items-center text-[0.9375rem] leading-snug text-fg-2 no-underline hover:text-fg"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="t-meta mt-14 flex flex-col gap-2 border-t border-line pt-6 text-fg-3 md:flex-row md:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {site.shortName}. All rights reserved.
          </p>
          <p>Built to WCAG 2.2 AA and IS 17802. This site sets no tracking cookies.</p>
        </div>
      </div>
    </footer>
  )
}
