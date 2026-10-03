/**
 * The brand lockup: the client's paisley emblem beside the `raaga` wordmark.
 *
 * One definition, three call sites (header, footer, admin), because a logo that
 * is assembled by hand in each place drifts in each place.
 *
 * Emblem and wordmark are both vector traces of the client's artwork, painted
 * through a CSS mask as `currentColor` (see `.brand-emblem` and
 * `.brand-wordmark` in globals.css). They take the ink of whatever they sit in
 * rather than needing one file per colourway, and, being masks over true holes,
 * the counters of the `g` show whatever is behind the logo — never a white
 * fill. Both are `aria-hidden`; one `sr-only` name announces the lockup once.
 *
 * Size comes from `--wm`, the wordmark's nominal height; the emblem, the
 * wordmark ink and the gap are all derived from it. Set it on `className` at
 * the call site, responsively if the context needs it — e.g. `[--wm:2.25rem] sm:[--wm:2.75rem]`.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-lockup ${className}`}>
      <span aria-hidden="true" className="brand-emblem shrink-0" />
      <span aria-hidden="true" className="brand-wordmark shrink-0" />
      <span className="sr-only">RAAGA, Sa. Pa. Sa.</span>
    </span>
  )
}
