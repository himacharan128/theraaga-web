/**
 * The single motif family: a tanpura string and the seven swaras.
 *
 * One motif family is luxury; three is decoration. The client's lotus line-art
 * was dropped (the most generic possible signifier of "Indian") and the veena
 * string pattern folded into this one.
 *
 * The same vertical rule does three jobs across the site: the scroll spine, the
 * Sadhana ladder spine, and the guru lineage thread. All decorative, all
 * aria-hidden, none ever the sole carrier of a section boundary.
 */

const SWARA_GLYPHS = ['सा', 'रि', 'ग', 'म', 'प', 'ध', 'नि']

/** A hairline rule with a swara centred on it. Ornament that does a layout job. */
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

/**
 * The ascending scale, Sa to Sa. Pure type, zero payload, and it closes the
 * ladder metaphor the page opened with. The best idea in the client's brief.
 */
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

/** The tanpura string — a static hairline. Desktop only, decorative. */
export function TanpuraRule({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-px bg-gradient-to-b from-transparent via-gold-hairline to-transparent opacity-40 ${className}`}
    />
  )
}

/**
 * The image placeholder contract (plan §2.4).
 *
 * Never a grey box, never a silhouette, never a broken-image icon. A composed
 * frame with the aspect ratio RESERVED, so swapping in a real photograph later
 * costs exactly zero layout shift.
 */
export function PlaceholderFrame({
  aspect = '4/5',
  label,
  className = '',
}: {
  aspect?: '4/5' | '3/2' | '1/1' | '16/9'
  label?: string
  className?: string
}) {
  return (
    <div
      style={{ aspectRatio: aspect }}
      className={`relative flex items-center justify-center overflow-hidden border border-border bg-surface ${className}`}
      role="img"
      aria-label={label ?? 'Photograph to follow'}
    >
      {/* inset corner rules — ornament doing a framing job */}
      <span className="pointer-events-none absolute inset-4 border border-gold-hairline/25" />
      <svg
        viewBox="0 0 48 132"
        className="h-[58%] w-auto text-gold-hairline/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* tanpura: gourd, tapered neck joint, bridge, four strings, pegs */}
        <ellipse cx="24" cy="104" rx="19" ry="23" />
        <path d="M24 81c-4.5 0-6.5-2.5-6.5-6V20h13v55c0 3.5-2 6-6.5 6Z" />
        <path d="M15 92h18" opacity="0.75" />
        <path
          d="M19 92V22M22.3 92V22M25.7 92V22M29 92V22"
          opacity="0.5"
          strokeWidth="0.8"
        />
        <path d="M17.5 20h13" />
        <path d="M20 20v-7M28 20v-7" opacity="0.7" strokeWidth="0.9" />
      </svg>
      {label && (
        <span className="absolute bottom-3 left-0 right-0 px-4 text-center font-[var(--font-ui)] text-[0.65rem] uppercase tracking-[0.16em] text-text-muted/70">
          {label}
        </span>
      )}
    </div>
  )
}
