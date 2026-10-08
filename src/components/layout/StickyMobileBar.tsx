'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WhatsAppIcon } from '@/components/ui/Button'
import { track } from '@/lib/analytics'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The phone dock: Book a trial and WhatsApp, docked to the bottom edge.
 *
 * It arrives only once the visitor has scrolled past the first screen, where
 * the hero's own buttons were, and it steps aside whenever the page already
 * offers the same actions in view (the enquiry form, the closing invitation,
 * the footer), so it never sits on top of a button that does what it does, and
 * the end of the page is never covered. It also steps aside while the menu is
 * open (`html[data-menu]`, set by the header).
 *
 * Online Dialogue's meta-analysis of 33 sticky-element A/B tests found only a
 * 27% overall win rate, and a 0% win rate on homepages and list pages, where
 * "visitors are busy orienting". So this is the one element on the page that
 * must be A/B tested rather than assumed, and it is built to be switched off.
 *
 * Never both a sticky bar and a floating WhatsApp bubble.
 */
const SAME_ACTIONS = ['#prarambha', '#begin', '[data-site-footer]']

export function StickyMobileBar() {
  const [past, setPast] = useState(false)
  const [covered, setCovered] = useState(false)
  const pathname = usePathname()

  // rAF-throttled, and reads only scrollY and innerHeight, never layout.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setPast(window.scrollY > window.innerHeight * 0.85)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const inView = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target)
        else inView.delete(e.target)
      }
      setCovered(inView.size > 0)
    })
    for (const el of document.querySelectorAll(SAME_ACTIONS.join(','))) io.observe(el)
    return () => io.disconnect()
  }, [pathname])

  const show = past && !covered

  return (
    <div
      data-site-mobile-bar
      aria-hidden={!show}
      inert={!show}
      className="phone-dock tone-night fixed inset-x-0 bottom-0 z-40 border-t border-line px-[var(--gutter)] pt-3 lg:hidden"
      data-show={show ? 'true' : 'false'}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2.5">
        <Link
          href="/contact"
          onClick={() => track('cta_click', { cta_location: 'sticky_bar' })}
          className="btn btn-primary min-h-12 flex-1"
        >
          Book a trial
        </Link>
        {/* This once linked to /contact#prarambha rather than to WhatsApp, so
            the one control on the page labelled "Ask on WhatsApp" did not open
            WhatsApp. */}
        <a
          href={whatsappHref('STICKY_BAR')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { cta_location: 'sticky_bar' })}
          className="btn btn-secondary min-h-12 gap-2 px-4"
        >
          <WhatsAppIcon />
          <span className="sr-only xs:not-sr-only">Ask on WhatsApp</span>
          <span className="xs:hidden" aria-hidden="true">
            WhatsApp
          </span>
        </a>
      </div>
    </div>
  )
}
