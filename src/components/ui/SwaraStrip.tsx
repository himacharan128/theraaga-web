'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
      <ul className="flex flex-wrap justify-center gap-3 md:gap-4">
        {SWARAS.map((s) => (
          <li key={s.label}>
            <button
              type="button"
              onClick={() => play(s.label, SA * s.ratio)}
              aria-label={`Play note ${s.label}: ${s.gloss}`}
              data-active={active === s.label}
              className="flex size-16 flex-col items-center justify-center rounded-full border border-border-strong
                         bg-surface transition-[transform,background-color,border-color,box-shadow]
                         duration-[var(--dur-fast)] ease-[var(--ease-raaga)]
                         hover:border-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)]
                         data-[active=true]:scale-[1.06] data-[active=true]:border-accent
                         data-[active=true]:bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)]
                         data-[active=true]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]
                         motion-reduce:transition-none motion-reduce:data-[active=true]:scale-100
                         md:size-[4.5rem]"
            >
              <span className="deva text-[length:var(--text-step-1)] leading-none text-accent">
                {s.devanagari}
              </span>
              <span className="mt-1 font-[var(--font-ui)] text-[0.68rem] tracking-[0.14em] text-text-muted">
                {s.label.toUpperCase()}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={playSequence}
          disabled={sequencing}
          className="inline-flex min-h-11 items-center gap-2.5 border border-border-strong bg-surface px-5
                     font-[var(--font-ui)] text-[length:var(--text-step--1)] text-accent
                     transition-colors duration-[var(--dur-fast)] hover:border-accent
                     disabled:opacity-60"
        >
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l10 5.5-10 5.5V1.5Z" fill="currentColor" />
          </svg>
          {sequencing ? 'Playing…' : 'Play Sa · Pa · Sa'}
        </button>
      </div>

      {/* The active swara, announced once rather than on every re-render. */}
      <p className="sr-only" aria-live="polite">
        {active ? `Playing ${active}` : ''}
      </p>

      <p className="u-measure mx-auto mt-8 text-center text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-muted">
        Tap a swara to hear it. Sa and Pa never move. They are the two fixed
        notes a tanpura is tuned to, and the reference every other note is heard
        against. These seven are the whole of Carnatic music; everything else is
        what you do with them.
      </p>
    </div>
  )
}
