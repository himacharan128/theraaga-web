import Image from 'next/image'
import type { ScholarlyWork } from '@/content/seed'

/**
 * The Gurus' books, set out like a publisher's catalogue: the cover, then the
 * title and note beside it, stacked on a phone.
 *
 * The cover is a fixed ~150px wide. One of the two source scans is only 150px
 * across, so rendering any larger would only show its pixels. A work without a
 * `cover` is a finished text entry — there is no empty frame waiting for one.
 */
export function ScholarlyWorks({ works }: { works: ScholarlyWork[] }) {
  return (
    <ul
      className={`grid gap-px overflow-hidden border border-border bg-border ${
        works.length > 1 ? 'lg:grid-cols-2' : ''
      }`}
    >
      {works.map((w) => (
        <li
          key={w.order}
          className="flex flex-col gap-6 bg-surface p-7 sm:flex-row sm:items-start sm:gap-8 md:p-9"
        >
          {w.cover ? (
            <Image
              src={w.cover}
              alt={`Cover of ${w.title}`}
              sizes="150px"
              placeholder="blur"
              loading="lazy"
              className="h-auto w-[150px] shrink-0 rounded-[4px] shadow-[0_2px_4px_rgba(71,49,34,0.18),0_14px_30px_rgba(71,49,34,0.18)]"
            />
          ) : null}
          <div>
            <h3 className="font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] italic text-accent">
              {w.title}
            </h3>
            <p className="mt-3 text-[length:var(--text-step--1)] text-text-secondary">
              {w.note}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
