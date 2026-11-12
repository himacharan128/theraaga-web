/**
 * The homepage intro's score: every time, curve, opacity and scale it uses,
 * named once. Intro.tsx draws the parts, runtime.ts plays them, and
 * app/styles/intro.css holds their geometry and colours (`.intro`), so a change
 * of pacing is made here and nowhere else.
 *
 * The phrasing, in milliseconds from the first frame:
 *
 *      0  silence: the ivory field, a light rising in it
 *     60  a fine axis is drawn where the mark will stand, and drawn back in
 *    500  the first ring is released from that point; two more follow, each
 *         wider and fainter
 *    800  the mark opens out of the line where the axis stood
 *   1040  the wordmark settles beside it
 *   1300  नादतनुमनिशम्, then its transliteration, under a short brass rule
 *   2040  resolution: the words leave in the order they came, a last brass
 *         ring carries outward, and the veil lifts onto the real hero, whose
 *         own entrance begins as the veil clears (`hand`)
 *   2900  the page
 *
 * Phones and short windows play the compact score: the same phrasing at 0.85
 * of the time, without the widest ring or the rule. Every new tab plays it in
 * full, once; with reduced motion, it is `still`, a plain fade.
 */

/**
 * A curve. A name is one of the design system's own (`--ease-<name>` in
 * app/styles/tokens.css, read at run time so the intro and the site move with
 * one hand); anything else must be a CSS easing keyword.
 */
export type Ease = 'raaga' | 'out-expo' | 'in-out' | 'linear'

/** The parts of the composition, marked in Intro.tsx with `data-part`. `veil` is the overlay itself. */
export type Part =
  | 'veil'
  | 'glow'
  | 'axis'
  | 'ring1'
  | 'ring2'
  | 'ring3'
  | 'echo'
  | 'emblem'
  | 'word'
  | 'rule'
  | 'deva'
  | 'roman'

export type Track = {
  part: Part
  /** Start, in ms from the first frame. */
  at: number
  dur: number
  ease: Ease
  /**
   * An entrance holds its first frame until it starts. A leaving track
   * (`out`) holds nothing before it starts and gives only its last frame, so
   * it fades a part from wherever the part actually is, never revealing one
   * that did not arrive.
   */
  frames: Keyframe[]
  out?: boolean
  /** Only where the full composition has room (see `wide`). */
  wide?: boolean
  /** Shown only in Tiro Devanagari: dropped, never set in a fallback face, if the font is late. */
  script?: boolean
}

export type Mode = {
  tracks: Track[]
  /** When the hero's own entrance begins, and how much faster than usual it runs. */
  hand: number
  pace: number
  /** When the veil starts to lift. From here, input passes through to the page. */
  exit: number
  /** When the last track has finished. */
  end: number
}

export type IntroScore = {
  /** The overlay's element id. */
  id: string
  /**
   * The flag that the intro has played in this tab, in sessionStorage, so a
   * reload or a second arrival in the same tab does not replay it. It stays
   * in the visitor's own browser, is never sent anywhere, and goes when the
   * tab is closed.
   */
  key: string
  /** Room for the full composition. Below it, the compact score. */
  wide: string
  /** The compact score's share of the full score's times. */
  compact: number
  /**
   * A page whose first paint comes later than this after the visitor asked for
   * it skips the intro: a slow connection has made them wait enough.
   */
  late: number
  /** How long after `hand` every hero entrance has finished, at any pace up to 1. */
  settle: number
  /** Any key, tap, wheel or scroll lifts the veil from wherever it is. */
  skip: { fade: number; ease: Ease; hand: number }
  modes: { full: Mode; still: Mode }
}

/** Ring diameters, in emblem heights. Each starts from the same small source. */
export const RINGS = [0.9, 1.4, 2.3]
/** The last, brass ring, which carries out as the veil lifts. */
export const ECHO = 4.8
const SOURCE = 0.2

/** Peak opacities: each ring fainter than the last, as a sound spreads thin. */
const LEVEL = { axis: 0.85, rings: [0.9, 0.7, 0.5], echo: 0.75 }

const fadeOut = (part: Part, at: number, dur: number, frame: Keyframe = {}): Track => ({
  part,
  at,
  dur,
  ease: 'in-out',
  out: true,
  frames: [{ opacity: 0, ...frame }],
})

/** A ring: expanding from the source while it brightens briefly and dies away. */
const ring = (part: Part, at: number, size: number, peak: number, dur: number, wide = false): Track[] => [
  {
    part,
    at,
    dur,
    ease: 'raaga',
    wide,
    frames: [{ transform: `scale(${(SOURCE / size).toFixed(3)})` }, { transform: 'none' }],
  },
  {
    part,
    at,
    dur,
    ease: 'linear',
    wide,
    frames: [{ opacity: 0 }, { opacity: peak, offset: 0.14 }, { opacity: 0 }],
  },
]

const full: Mode = {
  hand: 2520,
  pace: 0.6,
  exit: 2260,
  end: 2900,
  tracks: [
    // Silence. The axis is drawn out from its centre, then drawn back into it,
    // and the first ring is released from that point: one pluck. A line left
    // standing inside a ring would read as a sight, not a sound.
    { part: 'glow', at: 0, dur: 900, ease: 'raaga', frames: [{ opacity: 0 }, { opacity: 1 }] },
    {
      part: 'axis',
      at: 60,
      dur: 320,
      ease: 'in-out',
      frames: [
        { opacity: 0, transform: 'scaleY(0)' },
        { opacity: LEVEL.axis, transform: 'none' },
      ],
    },
    fadeOut('axis', 380, 180, { transform: 'scaleY(0)' }),

    // Resonance
    ...ring('ring1', 500, RINGS[0], LEVEL.rings[0], 1500),
    ...ring('ring2', 680, RINGS[1], LEVEL.rings[1], 1500),
    ...ring('ring3', 860, RINGS[2], LEVEL.rings[2], 1500, true),

    // The mark opens out of the line where the axis stood, rising a hair
    // into place
    {
      part: 'emblem',
      at: 800,
      dur: 1150,
      ease: 'out-expo',
      frames: [
        { clipPath: 'inset(0 50%)', transform: 'translateY(1.5%) scale(0.985)' },
        { clipPath: 'inset(0 0%)', transform: 'none' },
      ],
    },
    { part: 'emblem', at: 800, dur: 420, ease: 'linear', frames: [{ opacity: 0 }, { opacity: 1 }] },

    // The wordmark, uncovered from the mark outward
    {
      part: 'word',
      at: 1040,
      dur: 900,
      ease: 'raaga',
      frames: [
        { opacity: 0, transform: 'translateX(-2.5%)', clipPath: 'inset(0 12% 0 0)' },
        { opacity: 1, transform: 'none', clipPath: 'inset(0 0% 0 0)' },
      ],
    },

    // Nāda: long enough to be read, not long enough to be announced
    {
      part: 'rule',
      at: 1300,
      dur: 600,
      ease: 'raaga',
      wide: true,
      script: true,
      frames: [
        { opacity: 0, transform: 'scaleX(0)' },
        { opacity: 1, transform: 'none' },
      ],
    },
    {
      part: 'deva',
      at: 1340,
      dur: 700,
      ease: 'raaga',
      script: true,
      frames: [
        { opacity: 0, transform: 'translateY(0.25rem)' },
        { opacity: 1, transform: 'none' },
      ],
    },
    {
      part: 'roman',
      at: 1460,
      dur: 700,
      ease: 'raaga',
      script: true,
      frames: [
        { opacity: 0, transform: 'translateY(0.25rem)' },
        { opacity: 1, transform: 'none' },
      ],
    },

    // Resolution: the words leave in the order they came, a brass ring carries
    // out from the whole mark, and the mark is gone before the page shows
    // through the lifting veil.
    { ...fadeOut('rule', 2040, 360), wide: true },
    fadeOut('deva', 2040, 360),
    fadeOut('roman', 2080, 360),
    {
      part: 'echo',
      at: 2080,
      dur: 950,
      ease: 'raaga',
      frames: [{ transform: 'scale(0.3)' }, { transform: 'none' }],
    },
    {
      part: 'echo',
      at: 2080,
      dur: 950,
      ease: 'linear',
      frames: [{ opacity: 0 }, { opacity: LEVEL.echo, offset: 0.18 }, { opacity: 0 }],
    },
    fadeOut('word', 2080, 340, { transform: 'translateY(-4%)' }),
    fadeOut('emblem', 2140, 340),
    fadeOut('veil', 2260, 640),
  ],
}

/** Reduced motion: the brand at once, a quick dissolve, the page. Opacity only. */
const still: Mode = {
  hand: 0,
  pace: 1,
  exit: 450,
  end: 750,
  tracks: [
    { part: 'emblem', at: 0, dur: 200, ease: 'raaga', frames: [{ opacity: 0 }, { opacity: 1 }] },
    { part: 'word', at: 0, dur: 200, ease: 'raaga', frames: [{ opacity: 0 }, { opacity: 1 }] },
    { ...fadeOut('veil', 450, 300), ease: 'raaga' },
  ],
}

export const INTRO: IntroScore = {
  id: 'raaga-intro',
  key: 'raaga.intro',
  wide: '(min-width: 48rem) and (min-height: 30rem)',
  compact: 0.85,
  late: 2500,
  settle: 2400,
  skip: { fade: 280, ease: 'raaga', hand: 60 },
  modes: { full, still },
}
