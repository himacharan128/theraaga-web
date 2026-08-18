import { Section } from '@/components/layout/Section'
import { SwaraStrip } from '@/components/ui/SwaraStrip'
import { getGalleryItems } from '@/data/content'

/**
 * The artefact only a music school can make — and the section that solves its
 * own empty state.
 *
 * When populated: a clip of the guru singing, capped at 60 SECONDS (Wistia's
 * 2025 data across 13M+ videos: sub-1-minute video averages 50% engagement vs
 * 46% at 1–3 minutes), behind a poster facade. Never a raw YouTube iframe —
 * web.dev measures those at 500 KB+ and up to 2 MB of JavaScript, against
 * ~28 KB for the lite-youtube facade, which took a test page from LCP 8.8s to
 * 3.8s.
 *
 * When empty: the seven playable swaras. The client's "easter egg" idea is
 * promoted to load-bearing, so this section is never blank.
 */
export async function ListenWatch() {
  const media = await getGalleryItems()
  const clips = media.filter((m) => m.kind === 'video' || m.kind === 'audio')

  return (
    <Section
      id="listen"
      eyebrow="Anubhava · Listen"
      title="Hear what a first lesson sounds like."
      tone="surface"
      renderIf={clips.length > 0}
      fallback={
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,#fffdf7,#f4ece0)] px-5 py-8 shadow-[var(--shadow-soft)] sm:px-8 md:px-12 md:py-12">
          <span
            aria-hidden="true"
            className="absolute -right-20 -top-20 size-64 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_10%,transparent)]"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="max-w-sm">
              <p className="font-[var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent-muted">
                An instrument for the ear
              </p>
              <p className="mt-4 font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] leading-[var(--lh-snug)] text-accent">
                Every lesson begins by finding Sa.
              </p>
              <p className="mt-4 text-[length:var(--text-step--1)] text-text-secondary">
                Tap through the seven swaras, then use the tuning sequence that
                gives a Carnatic voice its ground.
              </p>
            </div>
            <SwaraStrip />
          </div>
        </div>
      }
    >
      <ul className="grid gap-8 md:grid-cols-2">
        {clips.map((c) => (
          <li key={c.id}>
            {/* TODO(v1.1): lite-youtube-embed facade. Never a bare iframe. */}
            <div className="border border-border bg-bg p-6">
              <p className="font-[400]">{c.caption ?? c.media.alt}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
