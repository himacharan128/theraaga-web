import type { ReactNode } from 'react'

/**
 * The graceful-degradation wrapper. Implements the whole plan §6 rule table in
 * ONE place so no section can quietly invent its own empty-state behaviour.
 *
 * Hard rules encoded by callers via `renderIf`:
 *   · never a testimonial carousel below 1 item
 *   · never a gallery below 6 items
 *   · never a faculty silhouette placeholder
 *   · never a zero-valued counter
 *
 * Three outcomes:
 *   renderIf true            → children
 *   renderIf false + fallback → the designed empty state
 *   renderIf false, no fallback → nothing at all (section vanishes cleanly)
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  fallback,
  renderIf = true,
  tone = 'default',
  className = '',
}: {
  id?: string
  eyebrow?: string
  title?: ReactNode
  lede?: ReactNode
  children?: ReactNode
  fallback?: ReactNode
  renderIf?: boolean
  tone?: 'default' | 'surface' | 'accent'
  className?: string
}) {
  if (!renderIf && !fallback) return null

  const body = renderIf ? children : fallback

  const toneClass =
    tone === 'accent'
      ? 'bg-accent text-on-accent'
      : tone === 'surface'
        ? 'bg-surface'
        : ''

  return (
    <section
      id={id}
      data-section={id}
      data-has-content={renderIf ? 'true' : 'false'}
      className={`py-[var(--spacing-section)] ${toneClass} ${className}`}
    >
      <div className="u-shell">
        {(eyebrow || title || lede) && (
          <header className="mb-10 md:mb-16">
            {eyebrow && (
              <p
                className={`u-eyebrow mb-4 ${tone === 'accent' ? '!text-[color-mix(in_srgb,var(--color-on-accent)_78%,transparent)]' : ''}`}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-[length:var(--text-step-3)] max-w-[20ch]">
                {title}
              </h2>
            )}
            {lede && (
              <div
                className={`u-measure mt-6 text-[length:var(--text-step-0)] ${
                  tone === 'accent'
                    ? 'text-[color-mix(in_srgb,var(--color-on-accent)_86%,transparent)]'
                    : 'text-text-secondary'
                }`}
              >
                {lede}
              </div>
            )}
          </header>
        )}
        {body}
      </div>
    </section>
  )
}

/**
 * A designed empty state — never a grey box, never a skeleton, never a zero.
 * Reads as "not yet", which is honest, rather than "broken", which is fatal.
 */
export function EmptyState({
  children,
  action,
}: {
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="border border-border bg-surface px-6 py-12 text-center md:px-12 md:py-16">
      <p className="u-measure mx-auto text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
        {children}
      </p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  )
}
