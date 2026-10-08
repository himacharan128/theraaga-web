'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scroll reveals for every `.reveal` element on the page.
 *
 * An element below the fold is held at its first keyframe by a paused Web
 * Animation and played as it is about to be seen. Nothing here writes an
 * attribute, a class or an inline style: an earlier version marked elements
 * `data-reveal="pending"`, and because this component sits in the layout, its
 * effect ran before the page's own markup had hydrated, so React reported every
 * marked element as a server/client mismatch. Animations live outside the DOM
 * React compares, however the page streams in.
 *
 * Fails open. Without this script, under reduced motion, or in a browser
 * without the APIs, every element is simply visible. Content above the fold is
 * never touched, so nothing the visitor can already see disappears.
 *
 * Variants: `.reveal` rises and fades in, `.reveal-unveil` is uncovered upward
 * (photographs), `.reveal-draw` draws a rule from the left (pair it with
 * `.draw-x`). An inline `--i` staggers siblings.
 */
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

const VARIANTS = {
  rise: {
    duration: 1000,
    frames: [
      { opacity: 0, transform: 'translateY(1.5rem)' },
      { opacity: 1, transform: 'none' },
    ],
  },
  unveil: {
    duration: 1400,
    frames: [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  },
  draw: {
    duration: 1300,
    frames: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
  },
} satisfies Record<string, { duration: number; frames: Keyframe[] }>

function variantOf(el: Element) {
  if (el.classList.contains('reveal-unveil')) return VARIANTS.unveil
  if (el.classList.contains('reveal-draw')) return VARIANTS.draw
  return VARIANTS.rise
}

export function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (!('IntersectionObserver' in window) || typeof Element.prototype.animate !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const held = new Map<Element, Animation>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.unobserve(entry.target)
          held.get(entry.target)?.play()
          held.delete(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    // Read every position first, then start animations, so the page is laid
    // out once rather than once per element.
    const fold = window.innerHeight * 0.92
    const below = [...document.querySelectorAll<HTMLElement>('.reveal')].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.height > 0 && r.top >= fold
    })

    for (const el of below) {
      const { duration, frames } = variantOf(el)
      const stagger = Number.parseFloat(el.style.getPropertyValue('--i')) || 0
      // `backwards` holds the first frame through the delay and while paused;
      // once finished the element falls back to its own styles, which match
      // the last frame, so no animation lingers on the page.
      const anim = el.animate(frames, { duration, delay: stagger * 90, easing: EASE, fill: 'backwards' })
      anim.pause()
      held.set(el, anim)
      io.observe(el)
    }

    return () => {
      io.disconnect()
      for (const anim of held.values()) anim.cancel()
    }
  }, [pathname])

  return null
}
