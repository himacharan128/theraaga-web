/**
 * A kolam between two chapters on the same ground: a small four-petal motif
 * on a dotted ring, with a brass thread fading in from either side. Decorative
 * only, and hidden from assistive tech.
 */
export function Kolam({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`kolam u-shell ${className}`}>
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="20" cy="20" r="4" />
        <path d="M20 4c6 6 6 10 0 16-6-6-6-10 0-16zM20 36c6-6 6-10 0-16-6 6-6 10 0 16zM4 20c6 6 10 6 16 0-6-6-10-6-16 0zM36 20c-6 6-10 6-16 0 6-6 10-6 16 0z" />
        <circle cx="20" cy="20" r="18" strokeDasharray="2 4" />
      </svg>
    </div>
  )
}
