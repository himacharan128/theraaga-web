import { alt, size, contentType } from '@/app/opengraph-image'

/**
 * The default social preview card, as an explicit `images` entry.
 *
 * Why this exists: Next merges metadata shallowly, so any page that exports its
 * own `openGraph` (or `twitter`) object replaces the root's wholesale and drops
 * the image the `opengraph-image.tsx` file convention injects there. Twelve
 * pages shipped no `og:image` at all, and the forwarded WhatsApp card is seen
 * far more often than the page. Spread this into every page-level `openGraph`
 * and `twitter`.
 *
 * It points at the same, frozen image route and takes its alt text and size
 * from that file, so the card cannot drift from the homepage's. `/opengraph-image`
 * is served directly (HTTP 200, image/png); relative URLs resolve against
 * `metadataBase`.
 */
export const defaultOgImages = [
  { url: '/opengraph-image', width: size.width, height: size.height, type: contentType, alt },
]
