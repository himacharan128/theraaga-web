import Image from 'next/image'

/**
 * The brand lockup: the client's paisley emblem beside the `raaga` wordmark.
 *
 * One definition, three call sites (header, footer, admin), because a logo that
 * is assembled by hand in each place drifts in each place.
 *
 * The emblem is a vector trace of the client's master artwork. It is painted
 * through a CSS mask as `currentColor` (see `.brand-emblem` in globals.css), so
 * it takes the ink of whatever it sits in rather than needing one file per
 * colourway. It is `aria-hidden` on purpose: the wordmark image beside it
 * already carries the accessible name, and announcing the mark twice is worse
 * than not announcing the ornament at all.
 *
 * Size comes from `--wm`, the wordmark's height; the emblem and the gap are
 * both derived from it. Set it on `className` at the call site, responsively if
 * the context needs it — e.g. `[--wm:2.25rem] sm:[--wm:2.75rem]`.
 */
export function Wordmark({
  className = '',
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <span className={`brand-lockup ${className}`}>
      <span aria-hidden="true" className="brand-emblem shrink-0" />
      <Image
        src="/brand/raaga-wordmark.webp"
        alt="RAAGA, Sa. Pa. Sa."
        width={600}
        height={324}
        priority={priority}
      />
    </span>
  )
}
