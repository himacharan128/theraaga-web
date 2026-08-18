import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: string
  lede?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="page-hero border-b border-border">
      <div className="u-shell relative py-16 md:py-28">
        <p className="u-eyebrow relative z-10">{eyebrow}</p>
        <h1 className="relative z-10 mt-5 max-w-[20ch] text-[length:var(--text-step-4)] font-[300] md:text-[length:var(--text-step-5)]">
          {title}
        </h1>
        {lede && (
          <div className="u-measure relative z-10 mt-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
            {lede}
          </div>
        )}
        {children && <div className="relative z-10 mt-9">{children}</div>}
      </div>
    </section>
  )
}

/** Long-form legal/prose shell. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <section className="u-shell py-16 md:py-24">
      <div
        className="u-measure rounded-[var(--radius-md)] border border-border bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] px-6 py-8 shadow-[0_10px_24px_rgba(71,49,34,0.04)] md:px-10 md:py-12
          [&_h2]:mt-12 [&_h2]:text-[length:var(--text-step-2)] [&_h2]:font-[300]
          [&_h3]:mt-8 [&_h3]:text-[length:var(--text-step-1)] [&_h3]:font-[400]
          [&_p]:mt-4 [&_p]:text-text-secondary
          [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-text-secondary
          [&_li]:mt-2
          [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4"
      >
        {children}
      </div>
    </section>
  )
}
