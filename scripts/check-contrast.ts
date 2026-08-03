/**
 * CI guard: every text/background pair in the palette must actually pass WCAG.
 *
 * This exists because the client's own brand direction specified gold lettering
 * on ivory, and the computed contrast is 2.22:1 — a failure so far below the
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

const T = {
  bg: '#F7F3EA',
  surface: '#FFFCF5',
  elevated: '#FFFFFF',
  textPrimary: '#221E1A',
  textSecondary: '#4A423A',
  textMuted: '#6E655A',
  accent: '#6B1F2A',
  accentHover: '#5C1A20',
  accentMuted: '#8C6A15',
  goldHairline: '#C9A227',
  olive: '#5A6047',
  borderStrong: '#8F8070',
  onAccent: '#F7F3EA',
}

interface Check {
  name: string
  fg: string
  bg: string
  min: number
}

const CHECKS: Check[] = [
  // Body text on all three ground levels.
  { name: 'text-primary on bg', fg: T.textPrimary, bg: T.bg, min: 4.5 },
  { name: 'text-primary on surface', fg: T.textPrimary, bg: T.surface, min: 4.5 },
  { name: 'text-primary on elevated', fg: T.textPrimary, bg: T.elevated, min: 4.5 },
  { name: 'text-secondary on bg', fg: T.textSecondary, bg: T.bg, min: 4.5 },
  { name: 'text-secondary on surface', fg: T.textSecondary, bg: T.surface, min: 4.5 },
  { name: 'text-muted on bg', fg: T.textMuted, bg: T.bg, min: 4.5 },
  { name: 'text-muted on surface', fg: T.textMuted, bg: T.surface, min: 4.5 },

  // Accent used as ink.
  { name: 'accent on bg', fg: T.accent, bg: T.bg, min: 4.5 },
  { name: 'accent on surface', fg: T.accent, bg: T.surface, min: 4.5 },

  // The gold that IS allowed to carry text.
  { name: 'accent-muted (gold text) on bg', fg: T.accentMuted, bg: T.bg, min: 4.5 },
  { name: 'olive on bg', fg: T.olive, bg: T.bg, min: 4.5 },

  // Reversed: label on the maroon button.
  { name: 'on-accent on accent', fg: T.onAccent, bg: T.accent, min: 4.5 },
  { name: 'on-accent on accent-hover', fg: T.onAccent, bg: T.accentHover, min: 4.5 },

  // Bounded controls need 3:1, not 4.5:1.
  { name: 'border-strong on bg (UI)', fg: T.borderStrong, bg: T.bg, min: 3 },
  { name: 'border-strong on surface (UI)', fg: T.borderStrong, bg: T.surface, min: 3 },
]

/**
 * The gold hairline is EXPECTED to fail as text. Asserting that it fails is the
 * point: it documents why the token may only ever be a 1px rule or an icon
 * stroke, and it will fail this build if anyone "fixes" it into a text colour.
 */
const MUST_FAIL: Check[] = [
  { name: 'gold-hairline as text on bg', fg: T.goldHairline, bg: T.bg, min: 3 },
]

let failed = 0

console.log('\n  Contrast — WCAG 2.2 AA\n')

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
      `  ✗ ${c.name} now passes at ${ratio.toFixed(2)}:1 — it is documented as decorative-only. Update the docs or revert.`,
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
