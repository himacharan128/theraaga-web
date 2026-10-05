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
