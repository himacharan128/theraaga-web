import { Section } from '@/components/layout/Section'
import { getGalleryItems } from '@/data/content'

/**
 * HIDDEN BELOW SIX ITEMS. A two-photo gallery reads as unfinished, which is
 * worse than no gallery at all.
 *
 * The consent gate has already been applied in the DAL — anything depicting a
 * minor without recorded guardian consent never reaches this component. That
 * filter lives in the query on purpose, so no UI change can bypass it.
 *
 * EXIF/GPS is stripped on ingest (v1.1, with the upload pipeline).
 */
const MIN_ITEMS = 6

export async function Gallery() {
  const items = (await getGalleryItems()).filter((i) => i.kind === 'image')

  return (
    <Section
      id="anubhava"
      eyebrow="Anubhava"
      title="Moments from the school."
      renderIf={items.length >= MIN_ITEMS}
    >
      <ul className="columns-2 gap-4 md:columns-3 [&>li]:mb-4">
        {items.map((item) => (
          <li key={item.id} className="break-inside-avoid">
            <div
              style={{ aspectRatio: item.media.aspect }}
              className="w-full border border-border bg-surface"
            />
            {item.caption && (
              <p className="mt-2 text-[length:var(--text-step--1)] text-text-muted">
                {item.caption}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
