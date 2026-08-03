import localFont from 'next/font/local'

/**
 * Self-hosted, hyper-subsetted. Built by `npm run build:fonts`.
 *
 * Why not `next/font/google`: it can only serve Google's stock unicode-range
 * slices. That came to 540 KB across six files for this stack — Tiro
 * Devanagari alone was 117 KB to render about forty characters of fixed brand
 * vocabulary. Subsetting to the glyphs actually used brings the whole stack to
 * ~112 KB, self-hosted, with zero third-party requests.
 *
 * Why this stack at all — the client proposed Cormorant Garamond + Cinzel +
 * Poppins, and all three were replaced:
 *  · Cormorant and Cinzel have NO Devanagari coverage, so नादब्रह्म would
 *    silently fall back to a system Noto — a visible seam at exactly the point
 *    the brand is most concentrated.
 *  · Cormorant is a display Garamond whose light stems go grey at 16px on the
 *    mid-range Android LCD that is our actual target device.
 *  · Cinzel has no lowercase at all — it is a logotype face, not a subhead face.
 *  · Poppins' geometric Devanagari reads as 2016-Indian-startup, the precise
 *    opposite of the positioning.
 */

export const newsreader = localFont({
  src: [
    {
      path: '../../public/fonts/newsreader-latin-normal.woff2',
      weight: '300 600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/newsreader-latin-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-newsreader',
  // Metric-matched fallback. The LCP element is H1 text on flat ivory, so an
  // unmatched swap would show up directly as CLS on the most important paint.
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
})

export const inter = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  weight: '400 600',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: 'Arial',
})

/**
 * Tiro Devanagari Sanskrit — by John Hudson & Fiona Ross at Tiro Typeworks,
 * drawn for Sanskrit specifically, with correct conjuncts and Vedic marks. Noto
 * is generic; this is scholarly, and it shows on नादतनुमनिशं.
 *
 * The `size-adjust` is the important part. Newsreader's native line box is
 * 1.000 and a Devanagari serif's is around 1.55 — drop one Sanskrit word into a
 * Latin line and the whole line visibly jumps, and `line-height` cannot fix it
 * because inline box height comes from each run's own font metrics.
 *
 * Devanagari has no x-height, so the calibration target is NOT x-height
 * matching: it is getting the shirorekha (the head-stroke) to sit at Latin
 * cap-height. 108% is that alignment for this pairing.
 */
export const tiroDevanagari = localFont({
  src: '../../public/fonts/tiro-devanagari.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-tiro-deva',
  adjustFontFallback: false,
  declarations: [
    { prop: 'size-adjust', value: '108%' },
    { prop: 'ascent-override', value: '102%' },
    { prop: 'descent-override', value: '30%' },
    { prop: 'line-gap-override', value: '0%' },
  ],
})

export const fontVariables = [
  newsreader.variable,
  inter.variable,
  tiroDevanagari.variable,
].join(' ')
