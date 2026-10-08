'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { WhatsAppIcon } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Wordmark'
import { track } from '@/lib/analytics'

/**
 * Plain English items, in the client's own order. Gallery and Journal show only
 * once they have something in them: see `hasGallery` and `hasJournal`.
 *
 * The Sanskrit kickers (Nāda, Parampara, Sādhana…) were removed at the client's
 * request. That also resolves the usability problem they carried: Bailey &
 * Wolfson found a correct first click yields 87% task success against 46% for a
 * wrong one, and simultaneously unfamiliar labels give a cold parent no
 * anchor. "Prārambham" for Contact was worse than merely unfamiliar: it
 * collides with *Prarambhik*, a real beginner exam grade.
 *
 * The Sanskrit still carries the meaning where it belongs: as the programme
 * header on each page's own hero, and in the vanity paths that 301 here.
 */
const NAV: { label: string; href: string; needs?: 'gallery' | 'journal' }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'The Gurus', href: '/gurus' },
  { label: 'Learning', href: '/learning' },
  { label: 'Events', href: '/events' },
  { label: 'Journal', href: '/journal', needs: 'journal' },
  { label: 'Gallery', href: '/gallery', needs: 'gallery' },
  { label: 'Contact', href: '/contact' },
]

type Menu = 'closed' | 'open' | 'closing'

/** Matches the menu-close keyframes in app/styles/chrome.css. */
const CLOSE_MS = 300

export function Header({
  whatsappHref,
  telHref,
  phoneDisplay,
  hasGallery,
  hasJournal,
}: {
  whatsappHref: string
  telHref: string
  phoneDisplay: string
  hasGallery: boolean
  hasJournal: boolean
}) {
  // An item that would lead to "nothing yet" is left out of the nav. The pages
  // themselves, the footer and the sitemap keep them, so nothing is lost and the
  // item returns by itself when content lands.
  const nav = NAV.filter(
    (item) =>
      (item.needs !== 'gallery' || hasGallery) &&
      (item.needs !== 'journal' || hasJournal),
  )
  const [menu, setMenu] = useState<Menu>('closed')
  const [scrolled, setScrolled] = useState(false)
  // Undefined until the observer below first reports; until then the
  // stylesheet's first-paint rule holds the ink (see app/styles/tones.css).
  const [overDark, setOverDark] = useState<'night' | 'maroon' | null>()
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Closing plays the curtain back up unless motion is reduced.
  const closeMenu = useCallback(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMenu(still ? 'closed' : 'closing')
  }, [])

  // A route change must never leave the menu open over the new page, most
  // visibly on browser back/forward, where no link handler fires.
  //
  // Adjusted DURING RENDER rather than in an effect. This is React's documented
  // "storing information from previous renders" pattern: an effect here would
  // paint the new route with the menu still open and then close it on a
  // second pass, which is both a visible flash and a cascading render.
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setMenu('closed')
  }

  // The header turns solid once the page moves. rAF-throttled; reads only
  // scrollY, never layout.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setScrolled(window.scrollY > 8)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Over a dark chapter (the stage, the maroon close, the footer) the header
  // takes that chapter's ink: maroon over the maroon close, night otherwise.
  // One observer, whose root is a 1px line through the middle of the header;
  // rebuilt per route and on resize. Next keeps up to three pages the visitor
  // has left in the document, hidden; a hidden element never intersects, so
  // only the page on screen counts. The footer is always observed, so the
  // first report always comes.
  useEffect(() => {
    const header = headerRef.current
    if (!header || !('IntersectionObserver' in window)) return
    let io: IntersectionObserver | undefined
    let timer = 0
    const inside = new Set<Element>()

    const build = () => {
      io?.disconnect()
      inside.clear()
      const line = Math.round(header.offsetHeight / 2)
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) inside.add(e.target)
            else inside.delete(e.target)
          }
          const under = [...inside]
          setOverDark(
            under.length === 0
              ? null
              : under.some((el) => el.classList.contains('tone-maroon'))
                ? 'maroon'
                : 'night',
          )
        },
        { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` },
      )
      for (const el of document.querySelectorAll('[data-tone="dark"]')) io.observe(el)
    }

    const onResize = () => {
      clearTimeout(timer)
      timer = window.setTimeout(build, 150)
    }

    build()
    window.addEventListener('resize', onResize)
    return () => {
      io?.disconnect()
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [pathname])

  // Escape closes the menu AND returns focus to the control that opened it.
  // Without the focus return, a keyboard user is dropped at the top of the
  // document, which is the most common way a technically-correct disclosure
  // still fails WCAG 2.4.3 in practice.
  useEffect(() => {
    if (menu !== 'open') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu, closeMenu])

  // While the sheet covers the page, the page behind it is inert and does not
  // scroll, and the phone bar steps aside (`html[data-menu]` in the bar's CSS).
  // Growing past the breakpoint with the sheet open closes it.
  useEffect(() => {
    if (menu !== 'open') return
    const root = document.documentElement
    const behind = [
      document.getElementById('main'),
      document.querySelector('[data-site-footer]'),
      document.querySelector('a[href="#main"]'),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement)

    root.dataset.menu = 'open'
    root.style.overflow = 'hidden'
    for (const el of behind) el.inert = true

    const wide = window.matchMedia('(min-width: 64rem)')
    const onWide = () => wide.matches && setMenu('closed')
    wide.addEventListener('change', onWide)

    return () => {
      delete root.dataset.menu
      root.style.overflow = ''
      for (const el of behind) el.inert = false
      wide.removeEventListener('change', onWide)
    }
  }, [menu])

  useEffect(() => {
    if (menu !== 'closing') return
    const t = window.setTimeout(() => setMenu('closed'), CLOSE_MS)
    return () => clearTimeout(t)
  }, [menu])

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const sheet = menu !== 'closed'
  // The sheet is night; otherwise whatever lies under the header.
  const ink = sheet ? 'night' : overDark === undefined ? undefined : (overDark ?? 'light')

  return (
    <header
      ref={headerRef}
      data-scrolled={scrolled && !sheet ? 'true' : 'false'}
      data-menu={menu === 'open' ? 'open' : undefined}
      data-ink={ink}
      className="site-header sticky top-0 z-50 border-b border-transparent text-fg [view-transition-name:site-header]"
    >
      <div className="u-shell relative z-10 flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="RAAGA Home"
          onClick={() => sheet && closeMenu()}
          className="flex min-h-11 shrink-0 items-center"
        >
          <Wordmark className="[--wm:2.25rem] lg:[--wm:2.625rem]" />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-8 xl:gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="nav-link inline-flex min-h-6 items-center whitespace-nowrap pb-0.5 font-ui text-[0.9rem] text-fg no-underline hover:text-kicker aria-[current=page]:text-kicker"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask on WhatsApp"
            onClick={() => track('whatsapp_click', { cta_location: 'header' })}
            className="flex size-11 items-center justify-center rounded-md text-[var(--btn-ink)] transition-colors duration-[var(--dur-1)] hover:bg-[var(--btn-wash)]"
          >
            <WhatsAppIcon />
          </a>
          {/* Visibility lives on a wrapper, not on the link: `hidden` and the
              button's own display are both set in CSS, and putting them on one
              element is a coin-flip that the wrong one wins. That happened once:
              the CTA stayed visible at 360px and wrapped over the wordmark. */}
          <div className="hidden sm:block">
            <Link
              href="/contact"
              onClick={() => track('cta_click', { cta_location: 'header' })}
              className="btn btn-primary min-h-11 px-5 text-[0.875rem]"
            >
              Book a trial
            </Link>
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menu === 'open'}
            aria-controls="mobile-nav"
            aria-label={menu === 'open' ? 'Close menu' : 'Open menu'}
            onClick={() => (menu === 'open' ? closeMenu() : setMenu('open'))}
            className="group flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-md px-2 text-fg lg:hidden"
          >
            <span aria-hidden="true" className="t-label hidden text-[0.6875rem] min-[22rem]:inline">
              {menu === 'open' ? 'Close' : 'Menu'}
            </span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-transform duration-[var(--dur-2)] ease-[var(--ease-out-expo)] ${menu === 'open' ? 'top-1.5 rotate-45' : 'top-0.5'}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-transform duration-[var(--dur-2)] ease-[var(--ease-out-expo)] ${menu === 'open' ? 'top-1.5 -rotate-45' : 'top-2.5'}`}
              />
            </span>
          </button>
        </div>
      </div>

      {sheet && (
        <div
          data-state={menu}
          inert={menu === 'closing'}
          className="menu-sheet tone-night fixed inset-0 z-0 overflow-y-auto overscroll-contain lg:hidden"
        >
          <div className="u-shell flex min-h-full flex-col pt-[calc(var(--header-h)+1rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
            <nav id={menu === 'open' ? 'mobile-nav' : undefined} aria-label="Main">
              <ul className="border-t border-line">
                {nav.map((item, i) => (
                  <li
                    key={item.href}
                    className="menu-item border-b border-line"
                    style={{ '--i': i } as CSSProperties}
                  >
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      onClick={closeMenu}
                      className="group/item flex min-h-[3.75rem] items-center justify-between gap-4 py-2 font-display text-[1.875rem] font-light leading-none tracking-[-0.02em] text-fg no-underline aria-[current=page]:italic aria-[current=page]:text-kicker"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="size-1.5 rotate-45 bg-mark opacity-0 transition-opacity duration-[var(--dur-2)] group-hover/item:opacity-100 group-aria-[current=page]/item:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className="menu-item mt-auto pt-12"
              style={{ '--i': nav.length } as CSSProperties}
            >
              <div className="grid gap-3 xs:grid-cols-2">
                <Link
                  href="/contact"
                  onClick={() => {
                    track('cta_click', { cta_location: 'header' })
                    closeMenu()
                  }}
                  className="btn btn-primary"
                >
                  Book a trial
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { cta_location: 'header' })}
                  className="btn btn-secondary"
                >
                  <WhatsAppIcon />
                  Ask on WhatsApp
                </a>
              </div>
              <a
                href={telHref}
                className="t-meta mt-6 inline-flex min-h-6 items-center gap-2 text-fg-2 no-underline hover:text-fg"
              >
                <span className="t-label text-kicker">Call</span>
                {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
