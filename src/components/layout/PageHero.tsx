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
    <section className="border-b border-border">
      <div className="u-shell py-16 md:py-24">
        <p className="u-eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-[22ch] text-[length:var(--text-step-4)] font-[300]">
          {title}
        </h1>
        {lede && (
          <div className="u-measure mt-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
            {lede}
          </div>
        )}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  )
}

/** Long-form legal/prose shell. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <section className="u-shell py-16 md:py-24">
      <div
        className="u-measure
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
