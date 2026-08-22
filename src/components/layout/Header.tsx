'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { track } from '@/lib/analytics'

/**
 * Eight plain English items, in the client's own order.
 *
 * The Sanskrit kickers (Nāda, Parampara, Sādhana…) were removed at the client's
 * request. That also resolves the usability problem they carried: Bailey &
 * Wolfson found a correct first click yields 87% task success against 46% for a
 * wrong one, and eight simultaneously unfamiliar labels give a cold parent no
 * anchor. "Prārambham" for Contact was worse than merely unfamiliar — it
 * collides with *Prarambhik*, a real beginner exam grade.
 *
 * The Sanskrit still carries the meaning where it belongs: as the eyebrow on
 * each page's own hero, and in the vanity paths that 301 to these slugs.
 */
const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'The Gurus', href: '/gurus' },
  { label: 'Learning', href: '/learning' },
  { label: 'Events', href: '/events' },
  { label: 'Journal', href: '/journal' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export function Header({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Escape closes the drawer AND returns focus to the control that opened it.
  // Without the focus return, a keyboard user is dropped at the top of the
  // document and has to tab all the way back — which is the most common way a
  // technically-correct disclosure still fails WCAG 2.4.3 in practice.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // A route change must never leave the drawer open over the new page — most
  // visibly on browser back/forward, where no link handler fires.
  //
  // Adjusted DURING RENDER rather than in an effect. This is React's documented
  // "storing information from previous renders" pattern: an effect here would
  // paint the new route with the drawer still open and then close it on a
  // second pass, which is both a visible flash and a cascading render.
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setOpen(false)
  }

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-border)_72%,transparent)] bg-[color-mix(in_srgb,var(--color-bg)_78%,transparent)] backdrop-blur-xl">
      <div className="u-shell flex h-16 items-center justify-between gap-3 md:h-20 md:gap-5">
        <Link
          href="/"
          aria-label="RAAGA Home"
          className="flex h-9 shrink-0 items-center sm:h-11"
        >
          <Image
            src="/brand/raaga-wordmark.webp"
            alt="RAAGA, Sa. Pa. Sa."
            width={600}
            height={324}
            priority
            className="h-full w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-7 rounded-full border border-[color-mix(in_srgb,var(--color-border)_85%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] px-6 py-2.5 shadow-[0_8px_24px_rgba(71,49,34,0.05)]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="block whitespace-nowrap font-[var(--font-ui)] text-[0.88rem] text-text-primary no-underline transition-colors hover:text-accent aria-[current=page]:text-accent"
                >
                  {item.label}
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
              the base class wins — which is exactly what happened once: the CTA
              stayed visible at 360px and wrapped over the wordmark. */}
          <div className="hidden sm:block">
            <ButtonLink
              href="/contact"
              onClick={() => track('cta_click', { cta_location: 'header' })}
            >
              Book a trial
            </ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="flex size-11 items-center justify-center rounded-full border border-transparent text-accent transition-colors hover:border-border-strong hover:bg-surface xl:hidden"
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
          className="border-t border-border bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] shadow-[0_16px_30px_rgba(71,49,34,0.08)] xl:hidden"
        >
          <ul className="u-shell py-3">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-border last:border-0">
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[54px] items-center justify-between gap-4 rounded-[var(--radius-sm)] px-3 py-3 no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)] aria-[current=page]:bg-[color-mix(in_srgb,var(--color-accent)_7%,transparent)] aria-[current=page]:text-accent"
                >
                  <span className="font-[var(--font-ui)] text-[length:var(--text-step-0)]">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
