import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Section } from '@/components/layout/Section'
import { getPressMentions } from '@/data/content'

/**
 * The newspaper clippings on the homepage, three mounted prints on the sand
 * chapter: one at a time on a phone, side by side from a tablet. Each is a
 * link to the whole clipping. The print is a window onto the TOP of the
 * clipping, because the masthead is the attribution. A Telugu headline is set
 * as printed; the English beneath it is our translation and is labelled so.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export async function PressHome() {
  const items = (await getPressMentions()).slice(0, 3)

  return (
    <Section
      id="press"
      tone="sand"
      eyebrow="In the papers"
      title="Our concerts, as the city reported them."
      renderIf={items.length > 0}
    >
      <ul className="clip-row md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
        {items.map((m, i) => (
          <li key={m.id} className="reveal" style={{ '--i': i } as CSSProperties}>
            <a
              href={m.clipping.src}
              target="_blank"
              rel="noopener noreferrer"
              className="bracket tone-paper group block h-full p-3 no-underline"
            >
              <span className="media relative block h-64 md:h-auto md:aspect-[4/3]">
                <Image
                  src={m.clipping}
                  alt={`Newspaper clipping from ${m.publication}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 60vw"
                  quality={50}
                  placeholder="blur"
                  loading="lazy"
                  className="object-cover object-top"
                />
              </span>
              <span className="t-label mt-4 block text-accent-muted">
                {m.publication} · <time dateTime={m.date}>{formatDate(m.date)}</time>
              </span>
              <span
                lang={m.language === 'te' ? 'te' : undefined}
                className="t-title mt-1.5 block text-balance text-fg transition-colors duration-[var(--dur-1)] group-hover:text-kicker"
              >
                {m.headline}
              </span>
              {m.headlineEnglish && (
                <span className="t-small mt-1 block italic text-fg-3">Translation: {m.headlineEnglish}</span>
              )}
              <span className="sr-only"> (opens the full clipping in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
