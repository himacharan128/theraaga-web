import Image from 'next/image'
import type { PressMention } from '@/content/types'

/**
 * Newspaper coverage, kept like a press archive: the newest clipping mounted
 * large, the others as ruled entries beside it with a small mounted print.
 * Each entry is one link to the full-size clipping, so a visitor can read the
 * article as it was printed.
 *
 * The print is a window onto the TOP of the clipping (`object-top`): the
 * masthead is the attribution and must be what shows. The link goes to the
 * whole, uncropped image.
 *
 * A Telugu headline is set in Telugu exactly as printed; the English beneath
 * it is our translation and is labelled as one, never presented as the
 * paper's own words.
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

function Byline({ m }: { m: PressMention }) {
  return (
    <span className="t-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-3">
      <span className="font-medium text-fg-2">{m.publication}</span>
      <span aria-hidden="true" className="size-1 rotate-45 bg-mark" />
      <span lang={m.language === 'te' ? 'te' : undefined}>{LANGUAGE_LABEL[m.language]}</span>
      <span aria-hidden="true" className="size-1 rotate-45 bg-mark" />
      <time dateTime={m.date}>{formatDate(m.date)}</time>
    </span>
  )
}

function Headline({ m, size }: { m: PressMention; size: 'lead' | 'entry' }) {
  const telugu = m.language === 'te'
  return (
    <>
      <span
        lang={telugu ? 'te' : undefined}
        className={`${size === 'lead' ? 't-subhead mt-4' : 't-title mt-3'} block text-balance text-fg transition-colors duration-[var(--dur-1)] group-hover:text-kicker`}
      >
        {m.headline}
      </span>
      {m.headlineEnglish && (
        <span className="t-small mt-2 block text-fg-3">
          <span className="t-label mr-2">Translation</span>
          {m.headlineEnglish}
        </span>
      )}
      <span className="sr-only"> (opens the full clipping in a new tab)</span>
    </>
  )
}

export function PressMentions({ items }: { items: PressMention[] }) {
  const [lead, ...rest] = items
  if (!lead) return null

  return (
    <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
      <a
        href={lead.clipping.src}
        target="_blank"
        rel="noopener noreferrer"
        className={`reveal group block no-underline ${rest.length ? 'lg:col-span-6' : 'lg:col-span-7'}`}
      >
        <span className="plate block">
          <span className="relative block aspect-[4/5] overflow-hidden bg-[var(--color-bg)] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={lead.clipping}
              alt={`Newspaper clipping from ${lead.publication}`}
              fill
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw"
              placeholder="blur"
              loading="lazy"
              className="object-cover object-top transition-transform duration-[var(--dur-3)] ease-[var(--ease-raaga)] motion-safe:lg:group-hover:scale-[1.02]"
            />
          </span>
        </span>
        <span className="mt-6 block">
          <Byline m={lead} />
          <Headline m={lead} size="lead" />
        </span>
      </a>

      {rest.length > 0 && (
        <ul className="border-t border-line lg:col-span-6">
          {rest.map((m) => (
            <li key={m.id} className="reveal border-b border-line">
              <a
                href={m.clipping.src}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[6rem_1fr] items-start gap-x-5 py-6 no-underline sm:grid-cols-[8.5rem_1fr] sm:gap-x-7 md:py-8"
              >
                <span className="plate block p-1.5">
                  <span className="relative block aspect-[3/4] overflow-hidden bg-[var(--color-bg)]">
                    <Image
                      src={m.clipping}
                      alt={`Newspaper clipping from ${m.publication}`}
                      fill
                      sizes="(min-width: 640px) 128px, 84px"
                      placeholder="blur"
                      loading="lazy"
                      className="object-cover object-top"
                    />
                  </span>
                </span>
                <span className="block">
                  <Byline m={m} />
                  <Headline m={m} size="entry" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
