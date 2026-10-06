/**
 * The ornament family. One idea, drawn five ways: sound leaving an instrument.
 *
 *  · Strings: the four strings of a tanpura, humming.
 *  · NadaRings: rings of sound leaving a point.
 *  · SwaraMarquee: the seven swaras, passing.
 *  · Kolam: the dot-grid floor drawing of a South Indian threshold, generated
 *    from two rosette curves so it is geometry, not clip art.
 *  · ZariBand: the woven gold border between a night section and an ivory one.
 *
 * All decorative, all aria-hidden, none ever the sole carrier of a boundary or
 * a meaning. Every one of them is CSS or inline SVG: zero bytes of JavaScript
 * and zero image requests.
 */

const SWARA_GLYPHS = ['सा', 'रि', 'ग', 'म', 'प', 'ध', 'नि']
const SWARA_LATIN = ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni']

/** A hairline rule with a swara centred on it. */
export function SwaraDivider({ index = 0 }: { index?: number }) {
  return (
    <div className="flex items-center gap-6" aria-hidden="true">
      <hr className="u-hairline flex-1" />
      <span className="deva text-[length:var(--text-step-0)] leading-none text-gold-hairline">
        {SWARA_GLYPHS[index % SWARA_GLYPHS.length]}
      </span>
      <hr className="u-hairline flex-1" />
    </div>
  )
}

/** The ascending scale, Sa to Sa. Pure type, zero payload. */
export function AscendingScale() {
  return (
    <div className="flex items-end justify-center gap-3 md:gap-5" aria-hidden="true">
      {[...SWARA_GLYPHS, 'सा'].map((g, i) => (
        <span
          key={i}
          className="deva leading-none text-gold-hairline"
          style={{
            fontSize: `calc(var(--text-step--1) + ${i * 0.11}rem)`,
            opacity: 0.4 + i * 0.06,
          }}
        >
          {g}
        </span>
      ))}
    </div>
  )
}

/**
 * Four tanpura strings in the left margin of a `relative` parent, each humming
 * at its own period so the group never settles into one rhythm. Shown only
 * where the margin is wide enough that they never cross the copy.
 */
export function Strings({ className = '' }: { className?: string }) {
  const strings = [
    { left: '2.5%', period: '3.1s', phase: '0s' },
    { left: '4.5%', period: '2.6s', phase: '-1.2s' },
    { left: '6.5%', period: '3.7s', phase: '-0.6s' },
    { left: '8.5%', period: '2.9s', phase: '-2.1s' },
  ]
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {strings.map((s) => (
        <span
          key={s.left}
          className="string"
          style={
            {
              left: s.left,
              '--period': s.period,
              '--phase': s.phase,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Three rings of sound, centred on the parent's centre. */
export function NadaRings({ size = '48rem', className = '' }: { size?: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ width: size, height: size }}
    >
      {['0s', '-3s', '-6s'].map((d) => (
        <span key={d} className="ring inset-0" style={{ '--delay': d } as React.CSSProperties} />
      ))}
    </div>
  )
}

/** The seven swaras passing along a hairline, Devanagari with the Latin name. */
export function SwaraMarquee({ className = '' }: { className?: string }) {
  const run = (key: string) => (
    <ul key={key} className="flex shrink-0 items-baseline" aria-hidden="true">
      {SWARA_GLYPHS.map((g, i) => (
        <li key={g} className="flex items-baseline gap-3 px-6 md:px-9">
          <span className="deva text-[length:var(--text-step-1)] leading-none text-gold-hairline">
            {g}
          </span>
          <span className="font-[var(--font-ui)] text-[0.7rem] uppercase tracking-[0.22em] text-text-muted">
            {SWARA_LATIN[i]}
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee__track">
        {run('a')}
        {run('b')}
      </div>
    </div>
  )
}

/**
 * A kolam. Two closed rosette curves woven through a dot grid, generated from
 * the polar form r = R + A·cos(kθ). Eight lobes outside, four inside, which is
 * the symmetry every threshold kolam in Telangana and Tamil Nadu shares. The
 * stroke is drawn in by the scroll (see `.rv-draw`) when placed in a `.rv`
 * parent, otherwise it simply sits.
 */
function rosette(R: number, A: number, k: number, steps = 144) {
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = R + A * Math.cos(k * t)
    pts.push(`${(100 + r * Math.cos(t)).toFixed(1)} ${(100 + r * Math.sin(t)).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}

export function Kolam({ className = '' }: { className?: string }) {
  const dots: [number, number][] = []
  for (const x of [-2, -1, 0, 1, 2]) {
    for (const y of [-2, -1, 0, 1, 2]) {
      if (Math.abs(x) + Math.abs(y) <= 2) dots.push([100 + x * 22, 100 + y * 22])
    }
  }
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {dots.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.4" fill="currentColor" stroke="none" />
      ))}
      <path d={rosette(62, 20, 8)} strokeLinejoin="round" />
      <path d={rosette(34, 14, 4)} strokeLinejoin="round" />
      <path d={rosette(86, 8, 8)} opacity="0.5" />
      <circle cx="100" cy="100" r="6" />
    </svg>
  )
}

/** The woven border between a night section and the ivory page. */
export function ZariBand({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`zari ${className}`} />
}
