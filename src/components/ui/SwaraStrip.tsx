'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * The seven swaras, playable.
 *
 * This started life as the client's "easter egg" idea. It is promoted here into
 * the EMPTY STATE of the Listen & Watch section, so that section is never empty
 * — the gimmick becomes load-bearing.
 *
 * Implementation notes:
 *  · Raw Web Audio `OscillatorNode` additive synthesis. 0 KB over the wire.
 *    Tone.js would be 76.6 KB to play one note; twelve recorded samples would
 *    be ~108 KB plus twelve requests plus first-tap decode latency.
 *  · Tuned in JUST INTONATION, not 12-TET. A Carnatic school shipping
 *    equal-tempered semitones would be caught immediately.
 *  · The AudioContext is created lazily inside the first click handler, because
 *    a context created outside a user gesture starts in the 'suspended' state.
 *  · Never autoplays. Real <button>s, so keyboard reach and focus are free.
 *  · Skipped entirely when the user has Save-Data on.
 */

// Sa = C#4 (277.18 Hz). Ratios are the standard just intervals.
const SA = 277.18
const SWARAS = [
  { label: 'Sa', devanagari: 'सा', ratio: 1 },
  { label: 'Ri', devanagari: 'रि', ratio: 9 / 8 },
  { label: 'Ga', devanagari: 'ग', ratio: 5 / 4 },
  { label: 'Ma', devanagari: 'म', ratio: 4 / 3 },
  { label: 'Pa', devanagari: 'प', ratio: 3 / 2 },
  { label: 'Dha', devanagari: 'ध', ratio: 5 / 3 },
  { label: 'Ni', devanagari: 'नि', ratio: 15 / 8 },
] as const

// Relative amplitudes of the first six harmonics — a plucked-string spectrum.
const HARMONICS = [1, 0.5, 0.32, 0.18, 0.1, 0.06]

export function SwaraStrip() {
  const ctxRef = useRef<AudioContext | null>(null)
  const [active, setActive] = useState<string | null>(null)

  const play = useCallback((label: string, freq: number) => {
    // Respect Save-Data: no audio graph at all.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection
    if (conn?.saveData) return

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
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.6) // ~1.6s decay
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
      osc.stop(now + 1.7)
    })

    setActive(label)
    window.setTimeout(() => setActive((c) => (c === label ? null : c)), 320)
  }, [])

  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-3 md:gap-4">
        {SWARAS.map((s) => (
          <li key={s.label}>
            <button
              type="button"
              onClick={() => play(s.label, SA * s.ratio)}
              aria-label={`Play the note ${s.label}`}
              data-active={active === s.label}
              className="flex size-16 flex-col items-center justify-center rounded-full border border-border-strong
                         bg-surface transition-[transform,background-color,border-color]
                         duration-[var(--dur-fast)] ease-[var(--ease-raaga)]
                         hover:border-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)]
                         data-[active=true]:border-accent
                         data-[active=true]:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]
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
      <p className="mt-8 text-center text-[length:var(--text-step--1)] text-text-muted">
        Tap a swara. These seven notes are the whole of Carnatic music — everything
        else is what you do with them.
      </p>
    </div>
  )
}
