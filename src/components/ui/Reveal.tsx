'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scroll reveal via IntersectionObserver + a CSS transition on opacity and
 * translateY. Zero animation libraries.
 *
 * Deliberately NOT Motion (45 KB) or GSAP (27 KB), and absolutely not Lenis —
 * smooth-scroll hijacking fights native fling physics and adds main-thread work
 * on every frame on exactly the mid-range Android the buyer is holding.
 *
 * Only `transform` and `opacity` are animated; neither triggers layout or paint.
 * `prefers-reduced-motion` is handled in CSS, so this stays a no-op there.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = 'true'
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/**
 * Fires one `section_view` per section per session at 50% visibility.
 * `data-has-content` rides along so we can measure whether placeholder
 * sections actually hurt conversion.
 */
export function SectionViewTracker() {
  useEffect(() => {
    const seen = new Set<string>()
    const els = document.querySelectorAll<HTMLElement>('[data-section]')

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute('data-section')
          if (!id || !e.isIntersecting || seen.has(id)) continue
          seen.add(id)
          import('@/lib/analytics').then(({ track }) =>
            track('section_view', {
              section: id,
              has_content:
                e.target.getAttribute('data-has-content') === 'true',
            }),
          )
        }
      },
      { threshold: 0.5 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
