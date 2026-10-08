import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { ScholarlyWork } from '@/content/seed'

/**
 * The Gurus' books, shown as a small exhibition: each cover mounted on paper,
 * the title in the display italic beneath it, the note in small type.
 *
 * Every cover is set at the same 150px width. One of the two source scans is
 * only 150px across, so rendering any larger would only show its pixels, and
 * two books at different sizes would read as a ranking. A work without a
 * `cover` is a finished caption with no empty frame above it.
 */
export function ScholarlyWorks({ works }: { works: ScholarlyWork[] }) {
  return (
    <ul className="flex flex-wrap gap-x-[clamp(2rem,6vw,5rem)] gap-y-14">
      {works.map((w, i) => (
        <li key={w.order} className="reveal w-[9.375rem] sm:w-[14rem]" style={{ '--i': i } as CSSProperties}>
          {/* Covers stand on a common baseline, like books on a shelf, so the
              titles beneath them line up whatever the scans' proportions. */}
          {w.cover ? (
            <div className="flex h-[13.75rem] items-end">
              <div className="plate inline-block p-1.5">
                <Image
                  src={w.cover}
                  alt={`Cover of ${w.title}`}
                  sizes="150px"
                  placeholder="blur"
                  loading="lazy"
                  className="h-auto w-[8.625rem]"
                />
              </div>
            </div>
          ) : null}
          <h3 className={`t-title italic text-fg ${w.cover ? 'mt-6' : ''}`}>{w.title}</h3>
          <p className="t-small mt-1 text-fg-3">{w.note}</p>
        </li>
      ))}
    </ul>
  )
}
