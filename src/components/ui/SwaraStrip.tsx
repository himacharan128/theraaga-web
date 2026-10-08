'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

/**
 * The seven swaras, playable. Educational, not a toy.
 *
 * Implementation notes:
 *  · Raw Web Audio `OscillatorNode` additive synthesis. 0 KB over the wire.
 *    Tone.js would be 76.6 KB to play one note; twelve recorded samples would
 *    be ~108 KB plus twelve requests plus first-tap decode latency.
 *  · Tuned in JUST INTONATION, not 12-TET. A Carnatic school shipping
 *    equal-tempered semitones would be caught immediately by the people whose
 *    respect this page is trying to earn.
 *  · The AudioContext is created lazily inside the first click handler, because
 *    a context created outside a user gesture starts 'suspended'.
 *  · Never autoplays. Real <button>s, so keyboard reach and focus come free.
 *  · Skipped entirely when the user has Save-Data on.
 */

// Sa = C#4 (277.18 Hz). Ratios are the standard just intervals.
const SA = 277.18
const SWARAS = [
  { label: 'Sa', devanagari: 'सा', ratio: 1, gloss: 'the tonic, where everything returns' },
  { label: 'Ri', devanagari: 'रि', ratio: 9 / 8, gloss: 'the second' },
  { label: 'Ga', devanagari: 'ग', ratio: 5 / 4, gloss: 'the third' },
  { label: 'Ma', devanagari: 'म', ratio: 4 / 3, gloss: 'the fourth' },
  { label: 'Pa', devanagari: 'प', ratio: 3 / 2, gloss: 'the fifth, the other fixed note' },
  { label: 'Dha', devanagari: 'ध', ratio: 5 / 3, gloss: 'the sixth' },
  { label: 'Ni', devanagari: 'नि', ratio: 15 / 8, gloss: 'the seventh' },
] as const

// Relative amplitudes of the first six harmonics — a plucked-string spectrum.
const HARMONICS = [1, 0.5, 0.32, 0.18, 0.1, 0.06]

const NOTE_MS = 1600

export function SwaraStrip() {
  const ctxRef = useRef<AudioContext | null>(null)
  const timers = useRef<number[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [sequencing, setSequencing] = useState(false)

  // Any pending sequence timers must die with the component, or they fire
  // setState on an unmounted tree after a route change.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    },
    [],
  )

  const playTone = useCallback((freq: number) => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection
    if (conn?.saveData) return false

    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      ctxRef.current = new Ctor()
    }
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') void ctx.resume()

    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.005) // ~5ms attack
    master.gain.exponentialRampToValueAtTime(0.0001, now + NOTE_MS / 1000)
    master.connect(ctx.destination)

    HARMONICS.forEach((amp, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      // A touch of detune on the upper partials gives the jawari shimmer that
      // makes a tanpura sound like a tanpura rather than a hearing test.
      osc.frequency.value = freq * (i + 1) * (i > 1 ? 1.0008 : 1)
      g.gain.value = amp
      osc.connect(g).connect(master)
      osc.start(now)
      osc.stop(now + NOTE_MS / 1000 + 0.1)
    })
    return true
  }, [])

  const play = useCallback(
    (label: string, freq: number) => {
      if (!playTone(freq)) return
      setActive(label)
      const t = window.setTimeout(
        () => setActive((c) => (c === label ? null : c)),
        NOTE_MS * 0.55,
      )
      timers.current.push(t)
    },
    [playTone],
  )

  /**
   * Sa · Pa · Sa — the tonic, the fifth, the tonic. This is literally how a
   * tanpura is tuned and how a singer finds their pitch, so the demonstration
   * teaches something real rather than just making noise.
   */
  const playSequence = useCallback(() => {
    if (sequencing) return
    const steps: { label: string; ratio: number }[] = [
      { label: 'Sa', ratio: 1 },
      { label: 'Pa', ratio: 3 / 2 },
      { label: 'Sa', ratio: 2 },
    ]
    setSequencing(true)
    steps.forEach((s, i) => {
      const t = window.setTimeout(() => {
        playTone(SA * s.ratio)
        setActive(s.label)
        if (i === steps.length - 1) {
          const done = window.setTimeout(() => {
            setActive(null)
            setSequencing(false)
          }, NOTE_MS * 0.75)
          timers.current.push(done)
        }
      }, i * 900)
      timers.current.push(t)
    })
  }, [playTone, sequencing])

  return (
    <div>
      {/* Seven items in a wrapping flex row break wherever they happen to fit,
          which gave 6 + 1, an orphaned "Ni" that read as a bug. The break is
          explicit: 4 + 3 below sm, one row of seven above it. Seven across at
          360px would put each key under the 44px tap minimum, so two rows on
          mobile is the honest answer; making the split deliberate is what
          stops it looking broken.

          Sa and Pa carry a small brass mark: they are the two fixed notes the
          explainer below talks about. */}
      <ul className="flex flex-wrap justify-center gap-2.5 sm:mx-auto sm:w-fit sm:gap-0 sm:divide-x sm:divide-line sm:border sm:border-line">
        {SWARAS.map((s, i) => (
          <Fragment key={s.label}>
            {i === 4 && <li aria-hidden="true" className="basis-full sm:hidden" />}
            <li>
              <button
                type="button"
                onClick={() => play(s.label, SA * s.ratio)}
                aria-label={`Play note ${s.label}: ${s.gloss}`}
                data-active={active === s.label}
                className="swara-key group relative flex h-[5.25rem] w-16 flex-col items-center justify-center gap-2 border border-line text-fg
                           transition-colors duration-[var(--dur-1)] ease-[var(--ease-raaga)]
                           hover:bg-[var(--btn-wash)]
                           data-[active=true]:bg-[rgb(207_174_114/0.16)]
                           sm:h-32 sm:w-[4.75rem] sm:border-0 md:w-24 lg:h-36 lg:w-28"
              >
                {(s.label === 'Sa' || s.label === 'Pa') && (
                  <span aria-hidden="true" className="absolute top-2.5 size-1 rotate-45 bg-mark sm:top-4" />
                )}
                <span className="deva text-[1.75rem] leading-none sm:text-[2.25rem] lg:text-[2.5rem]">
                  {s.devanagari}
                </span>
                <span className="t-label text-[0.625rem] text-kicker transition-colors group-data-[active=true]:text-fg">
                  {s.label}
                </span>
              </button>
            </li>
          </Fragment>
        ))}
      </ul>

      <div className="mt-8 flex justify-center md:mt-10">
        <button
          type="button"
          onClick={playSequence}
          disabled={sequencing}
          className="btn btn-secondary disabled:opacity-60"
        >
          <svg width="12" height="13" viewBox="0 0 13 14" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l10 5.5-10 5.5V1.5Z" fill="currentColor" />
          </svg>
          {sequencing ? 'Playing…' : 'Play Sa · Pa · Sa'}
        </button>
      </div>

      {/* The active swara, announced once rather than on every re-render. */}
      <p className="sr-only" aria-live="polite">
        {active ? `Playing ${active}` : ''}
      </p>

      <p className="t-small mx-auto mt-8 max-w-[58ch] text-center text-fg-3 md:mt-10">
        Tap a swara to hear it. Sa and Pa never move. They are the two fixed
        notes a tanpura is tuned to, and the reference every other note is heard
        against. These seven are the whole of Carnatic music; everything else is
        what you do with them.
      </p>
    </div>
  )
}
