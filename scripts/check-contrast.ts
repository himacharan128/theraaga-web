/**
 * CI guard: every text/background pair in the palette must actually pass WCAG.
 *
 * This exists because the client's own brand direction specified gold lettering
 * on ivory, and the computed contrast is 2.22:1: a failure so far below the
 * 4.5:1 body threshold that it fails even the 3:1 floor for UI components. That
 * was caught by computing it rather than by looking at it, which is the whole
 * argument for this file.
 *
 * Run: npm run test:contrast
 */

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }) as RGB
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Mirror of CSS `color-mix(in srgb, fg pct%, bg)`: a straight per-channel
 * blend of the gamma-encoded values, which is what the browser computes.
 */
function mix(fg: string, bg: string, pct: number): string {
  const [f, b] = [hexToRgb(fg), hexToRgb(bg)]
  const ch = f.map((v, i) => Math.round(v * (pct / 100) + b[i] * (1 - pct / 100)))
  return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('')
}

const T = {
  // Grounds
  bg: '#F5F0E6',
  surface: '#FFFDF8',
  elevated: '#FFFFFF',
  sand: '#ECE4D5',
  night: '#1D1714',
  // Ink on the light grounds
  textPrimary: '#1F1A17',
  textSecondary: '#463D36',
  textMuted: '#5F554B',
  // Ink on the dark stage
  onNight: '#F3EBDF',
  onNightSecondary: '#CFC2B1',
  onNightMuted: '#A99B8C',
  // Maroon
  accent: '#834848',
  accentHover: '#6E3A3A',
  accentDeep: '#612A2C',
  onAccent: '#FBF7EF',
  onAccentSecondary: '#E8D5CC',
  // Brass
  accentMuted: '#7D5F0F',
  goldHairline: '#B39258',
  brassNight: '#CFAE72',
  brassMaroon: '#E2C48E',
  // Structure
  borderStrong: '#86786A',
}

// A choice chip's hover ground: 5% of accent over the control's white.
const CHIP_HOVER = mix(T.accent, T.elevated, 5)

interface Check {
  name: string
  fg: string
  bg: string
  min: number
}

const LIGHT = { bg: T.bg, surface: T.surface, sand: T.sand, elevated: T.elevated }

/** One ink checked on every light ground a chapter or control can have. */
const onLight = (ink: string, fg: string, min = 4.5): Check[] =>
  Object.entries(LIGHT).map(([ground, bg]) => ({ name: `${ink} on ${ground}`, fg, bg, min }))

const CHECKS: Check[] = [
  // Body text, secondary text and captions on parchment, paper, sand and the
  // white of a form control.
  ...onLight('text-primary', T.textPrimary),
  ...onLight('text-secondary', T.textSecondary),
  ...onLight('text-muted', T.textMuted),

  // Maroon as ink: labels, links and the outline button's text.
  ...onLight('accent', T.accent),

  // The brass that IS allowed to carry text: numerals and the curriculum's
  // Devanagari.
  ...onLight('accent-muted (brass text)', T.accentMuted),

  // The filled button on light grounds, at rest and hovered, and the chosen
  // chip; a hovered chip keeps its label on a faint maroon wash.
  { name: 'on-accent on accent', fg: T.onAccent, bg: T.accent, min: 4.5 },
  { name: 'on-accent on accent-hover', fg: T.onAccent, bg: T.accentHover, min: 4.5 },
  { name: 'on-accent on accent-deep', fg: T.onAccent, bg: T.accentDeep, min: 4.5 },
  { name: 'text-primary on chip hover', fg: T.textPrimary, bg: CHIP_HOVER, min: 4.5 },

  // The dark stage: headings, body, captions and brass labels, and its
  // inverted button, at rest and hovered.
  { name: 'on-night on night', fg: T.onNight, bg: T.night, min: 4.5 },
  { name: 'on-night-secondary on night', fg: T.onNightSecondary, bg: T.night, min: 4.5 },
  { name: 'on-night-muted on night', fg: T.onNightMuted, bg: T.night, min: 4.5 },
  { name: 'brass-night on night', fg: T.brassNight, bg: T.night, min: 4.5 },
  { name: 'night on on-night (button)', fg: T.night, bg: T.onNight, min: 4.5 },
  { name: 'night on white (button hover)', fg: T.night, bg: T.elevated, min: 4.5 },

  // The maroon close: the same four inks, and its inverted button.
  { name: 'on-accent-secondary on accent-deep', fg: T.onAccentSecondary, bg: T.accentDeep, min: 4.5 },
  { name: 'brass-maroon on accent-deep', fg: T.brassMaroon, bg: T.accentDeep, min: 4.5 },
  { name: 'accent-deep on on-accent (button)', fg: T.accentDeep, bg: T.onAccent, min: 4.5 },
  { name: 'accent-deep on white (button hover)', fg: T.accentDeep, bg: T.elevated, min: 4.5 },

  // Anything that bounds a control needs 3:1, not 4.5:1.
  ...onLight('border-strong (UI)', T.borderStrong, 3),
]

/**
 * The gold hairline is EXPECTED to fail as text. Asserting that it fails is the
 * point: it documents why the token may only ever be a 1px rule, a diamond or
 * a stroke, and it will fail this build if anyone "fixes" it into a text
 * colour.
 */
const MUST_FAIL: Check[] = [
  { name: 'gold-hairline as text on bg', fg: T.goldHairline, bg: T.bg, min: 3 },
  { name: 'gold-hairline as text on surface', fg: T.goldHairline, bg: T.surface, min: 3 },
]

let failed = 0

console.log('\n  Contrast: WCAG 2.2 AA\n')

for (const c of CHECKS) {
  const ratio = contrast(c.fg, c.bg)
  const ok = ratio >= c.min
  if (!ok) failed++
  console.log(
    `  ${ok ? '✓' : '✗'} ${c.name.padEnd(38)} ${ratio.toFixed(2)}:1  (min ${c.min})`,
  )
}

console.log('\n  Decorative-only tokens (must NOT pass as text)\n')

for (const c of MUST_FAIL) {
  const ratio = contrast(c.fg, c.bg)
  const correctlyFails = ratio < c.min
  if (!correctlyFails) {
    failed++
    console.log(
      `  ✗ ${c.name} now passes at ${ratio.toFixed(2)}:1, but it is documented as decorative-only. Update the docs or revert.`,
    )
  } else {
    console.log(
      `  ✓ ${c.name.padEnd(38)} ${ratio.toFixed(2)}:1  (decorative only, as intended)`,
    )
  }
}

if (failed > 0) {
  console.error(`\n  ${failed} contrast check(s) failed.\n`)
  process.exit(1)
}
console.log('\n  All contrast checks passed.\n')
