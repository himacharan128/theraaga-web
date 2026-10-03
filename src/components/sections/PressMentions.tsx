import Image from 'next/image'
import type { PressMention } from '@/content/types'

/**
 * Newspaper coverage, as cards. Each card is one link to the full-size
 * clipping, so a visitor can read the article as it was printed.
 *
 * The thumbnail is a fixed-height window onto the TOP of the clipping
 * (`object-top`): the masthead is the attribution and must be what shows. The
 * link goes to the whole, uncropped image.
 */

const LANGUAGE_LABEL = { en: 'English', te: 'తెలుగు' } as const

function formatDate(iso: string): string {
  // Date-only ISO strings parse as UTC midnight; format in UTC so the printed
  // day never shifts with the viewer's timezone.
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function PressMentions({ items }: { items: PressMention[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3 lg:gap-8">
      {items.map((m) => {
        const date = formatDate(m.date)
        const telugu = m.language === 'te'
        return (
          <li key={m.id} className="flex">
            <a
              href={m.clipping.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read the ${m.publication} clipping, ${date}`}
              className="group flex w-full flex-col overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface shadow-[0_8px_20px_rgba(71,49,34,0.05)] transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_14px_30px_rgba(71,49,34,0.12)] motion-reduce:transition-none"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-bg">
                <Image
                  src={m.clipping}
                  alt={`Newspaper clipping from ${m.publication}`}
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 768px) 30vw, 100vw"
                  placeholder="blur"
                  loading="lazy"
                  className="object-cover object-top transition-transform duration-500 ease-[var(--ease-raaga)] motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                  <span className="font-[500] text-text-secondary">
                    {m.publication}
                  </span>
                  <span
                    lang={telugu ? 'te' : undefined}
                    className="rounded-[var(--radius-sm)] border border-border px-2 py-0.5 text-[length:var(--text-step--1)] leading-tight"
                  >
                    {LANGUAGE_LABEL[m.language]}
                  </span>
                  <time dateTime={m.date}>{date}</time>
                </p>
                <h3
                  lang={telugu ? 'te' : undefined}
                  className="mt-3 font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text transition-colors group-hover:text-accent"
                >
                  {m.headline}
                </h3>
                {m.headlineEnglish && (
                  <p className="mt-2 text-[length:var(--text-step--1)] text-text-muted">
                    {m.headlineEnglish}
                  </p>
                )}
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
