'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { track } from '@/lib/analytics'

/**
 * Six items, not eight — and English-primary.
 *
 * Bailey & Wolfson: a correct first click yields 87% task success, a wrong one
 * 46%. Eight simultaneously unfamiliar Sanskrit labels give a cold parent no
 * anchor. "Prārambha" for Contact is worse than unfamiliar — it collides with
 * *Prarambhik*, a real beginner exam grade, which produces a confidently wrong
 * click. No heritage institution navigates in Sanskrit: Kalakshetra (1936) and
 * Music Academy Madras (1928) are both plain English, and Shankar Mahadevan
 * Academy — the category leader — ships a three-item nav.
 *
 * So: Sanskrit is the kicker, English is the function. On mobile the Sanskrit
 * is dropped entirely — there is no room and no patience.
 */
const NAV = [
  { sanskrit: 'Sādhana', label: 'Courses', href: '/carnatic-vocal-classes-hyderabad' },
  { sanskrit: 'Guru', label: 'Teachers', href: '/teachers' },
  { sanskrit: 'Samudāya', label: 'Communities', href: '/communities' },
  { sanskrit: 'Parampara', label: 'About', href: '/about' },
  { sanskrit: 'Sabha', label: 'Events', href: '/#sabha' },
  { sanskrit: 'Prārambha', label: 'Contact', href: '/contact' },
]

export function Header({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-sm">
      <div className="u-shell flex h-14 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="shrink-0 font-[var(--font-display)] text-[length:var(--text-step-1)] font-[400] tracking-[0.12em] text-accent no-underline"
        >
          RAAGA
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block text-center no-underline"
                >
                  <span className="block font-[var(--font-display)] text-[0.72rem] uppercase tracking-[0.18em] text-accent-muted">
                    {item.sanskrit}
                  </span>
                  <span className="block font-[var(--font-ui)] text-[0.94rem] text-text-primary group-hover:text-accent">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask on WhatsApp"
            onClick={() => track('whatsapp_click', { cta_location: 'header' })}
            className="flex size-11 items-center justify-center rounded-full border border-border-strong text-accent md:hidden"
          >
            <WhatsAppIcon />
          </a>
          {/* Visibility lives on a wrapper, not on the button. `hidden` and the
              button's own `inline-flex` are both display utilities in the same
              Tailwind layer, so putting them on one element is a coin-flip that
              the base class wins — which is exactly what happened: the CTA
              stayed visible at 360px and wrapped to two lines over the
              wordmark. On mobile the hero CTA and the sticky bar cover this. */}
          <div className="hidden sm:block">
            <ButtonLink
              href="/contact"
              onClick={() => track('cta_click', { cta_location: 'header' })}
            >
              Book a free trial class
            </ButtonLink>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="flex size-11 items-center justify-center text-accent lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.4" />
              ) : (
                <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.4" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer — English only, by design. */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-border bg-bg lg:hidden"
        >
          <ul className="u-shell py-2">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-border last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-[var(--font-ui)] text-[length:var(--text-step-0)] no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
