'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WhatsAppIcon } from '@/components/ui/Button'
import { track } from '@/lib/analytics'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * Revealed only after ~40% scroll, and hidden once the enquiry form is in view.
 *
 * Online Dialogue's meta-analysis of 33 sticky-element A/B tests found only a
 * 27% overall win rate — and a 0% win rate on homepages and list pages, where
 * "visitors are busy orienting". So this is the one element on the page that
 * must be A/B tested rather than assumed, and it is built to be switched off.
 *
 * Never both a sticky bar and a floating WhatsApp bubble.
 */
export function StickyMobileBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Hide whenever the form is on screen — the bar would be redundant there.
    const form = document.getElementById('prarambha')
    let formVisible = false

    const io = form
      ? new IntersectionObserver(
          ([e]) => {
            formVisible = e.isIntersecting
            if (formVisible) setShow(false)
          },
          { threshold: 0.15 },
        )
      : null
    if (form && io) io.observe(form)

    // rAF-throttled, and never reads layout inside the scroll handler.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const pct =
          window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
        setShow(pct > 0.4 && !formVisible)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  return (
    <div
      data-site-mobile-bar
      aria-hidden={!show}
      inert={!show}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg px-3 pt-2 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-raaga)] lg:hidden"
      style={{
        transform: show ? 'none' : 'translateY(110%)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
      }}
    >
      {/* Docked to the bottom edge as a plain bar, not a floating capsule with
          blur and a drop shadow. */}
      <div className="flex gap-2">
        <Link
          href="/contact"
          tabIndex={show ? 0 : -1}
          onClick={() => track('cta_click', { cta_location: 'sticky_bar' })}
          className="flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-accent font-[var(--font-ui)] text-[0.92rem] font-medium text-on-accent no-underline transition-colors duration-[var(--dur-fast)] active:bg-accent-deep"
        >
          Book a trial
        </Link>
        {/* This linked to /contact#prarambha rather than to WhatsApp, so the
            one control on the page labelled "Ask on WhatsApp" did not open
            WhatsApp. */}
        <a
          href={whatsappHref('STICKY_BAR')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ask on WhatsApp"
          tabIndex={show ? 0 : -1}
          onClick={() => track('whatsapp_click', { cta_location: 'sticky_bar' })}
          className="flex size-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong text-accent transition-colors duration-[var(--dur-fast)] hover:border-accent"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </div>
  )
}
