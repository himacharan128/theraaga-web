'use client'

import { useEffect } from 'react'

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
