import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * The WhatsApp preview card is, functionally, the real homepage — far more
 * people see it than ever load the site.
 *
 * What the card is: the RAAGA brand lockup, the line "Carnatic music classes",
 * and one small supporting line. It names no locality on purpose; the page and
 * its search metadata carry Hyderabad, the forwarded card does not need to.
 *
 * Constraints encoded here:
 *  · 1200×630, the 1.91:1 that WhatsApp centre-crops to. Everything is centred
 *    and kept well inside the centre 80% so nothing is clipped on any client.
 *  · The lockup is the site's own vector artwork, not a raster or a typeset
 *    imitation: `public/brand/raaga-emblem.svg` and `raaga-wordmark.svg`, read
 *    from disk and handed to Satori as SVG data URIs. Both paint in
 *    `currentColor`, which an <img> cannot inherit, so it is replaced with the
 *    brand ink (#834848, `--color-accent`). The wordmark is `evenodd`, so the
 *    counters of the "g" are real holes that show the card's background.
 *    Proportions follow `.brand-lockup` in styles/chrome.css: emblem 1.35×,
 *    wordmark 0.756× of the unit, gap 0.3×.
 *  · Brand type, not Satori's default sans: Newsreader Light for the headline
 *    (the site's h1–h3 face, weight 300, -0.02em) and Inter Medium in tracked
 *    capitals for the supporting line (the site's `.u-eyebrow`). Satori needs
 *    static TTF, not the variable WOFF2 the site serves, so `_og/` holds static
 *    instances; the Inter file is cut to capitals only (5 KB).
 *  · The gold hairline is decorative only; it carries no meaning.
 *  · LATIN ONLY. `next/og` caps the whole bundle at 500 KB, and Satori has no
 *    automatic fallback for Devanagari. The नादब्रह्म line lives on the page.
 *
 * WhatsApp caches previews per-URL for weeks with no purge tool. When this card
 * changes, bump the `?v=` in `src/lib/og-image.ts` so the distributed URL changes.
 */
export const alt =
  'RAAGA: Carnatic music classes for children and adults, in person and online.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#834848'
const TEXT = '#1f1a17'
const GOLD = '#b39258'
const BG = '#f5f0e6'
const ACCENT_MUTED = '#7d5f0f'

// One unit of the site's lockup (`--wm`): the emblem is 1.35 units tall, the
// wordmark 0.756, the gap 0.3.
const UNIT = 200
const EMBLEM_H = Math.round(UNIT * 1.35)
const EMBLEM_W = Math.round((EMBLEM_H * 816) / 3282)
const WORDMARK_H = Math.round(UNIT * 0.756)
const WORDMARK_W = Math.round((WORDMARK_H * 1000) / 438.3)
const GAP = Math.round(UNIT * 0.3)

async function svgDataUri(file: string) {
  const svg = await readFile(join(process.cwd(), 'public', 'brand', file), 'utf8')
  return `data:image/svg+xml;base64,${Buffer.from(svg.replaceAll('currentColor', INK)).toString('base64')}`
}

export default async function OpengraphImage() {
  const fonts = join(process.cwd(), 'src', 'app', '_og')
  const [emblem, wordmark, newsreader, inter] = await Promise.all([
    svgDataUri('raaga-emblem.svg'),
    svgDataUri('raaga-wordmark.svg'),
    readFile(join(fonts, 'newsreader-display-300.ttf')),
    readFile(join(fonts, 'inter-500.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: BG,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={emblem} alt="" width={EMBLEM_W} height={EMBLEM_H} />
          <img
            src={wordmark}
            alt=""
            width={WORDMARK_W}
            height={WORDMARK_H}
            style={{ marginLeft: GAP }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 40,
            width: 96,
            height: 2,
            background: GOLD,
          }}
        />

        <div
          style={{
            display: 'flex',
            marginTop: 36,
            fontFamily: 'Newsreader',
            fontWeight: 300,
            fontSize: 72,
            letterSpacing: -1.44,
            color: TEXT,
          }}
        >
          Carnatic music classes
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 22,
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: 4.4,
            textTransform: 'uppercase',
            color: ACCENT_MUTED,
          }}
        >
          For children and adults · In person and online
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Newsreader', data: newsreader, weight: 300, style: 'normal' },
        { name: 'Inter', data: inter, weight: 500, style: 'normal' },
      ],
    },
  )
}
