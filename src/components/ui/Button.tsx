import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * The action hierarchy, in four steps and no more:
 *
 *   primary    the one thing a section wants you to do (filled)
 *   secondary  the alternative beside it (outlined)
 *   ghost      a contextual text link with an arrow (`.link-arrow`)
 *   WhatsApp   the conversational route, which is a secondary button that
 *              carries the WhatsApp mark; see `WhatsAppIcon`.
 *
 * Colours come from the --btn-* variables of the chapter's tone
 * (app/styles/tones.css), so the same three variants invert on the dark stage
 * and the maroon close without needing names of their own.
 */
type Variant = 'primary' | 'secondary' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'link-arrow',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: { variant?: Variant; children: ReactNode } & ComponentProps<'button'>) {
  return (
    <button className={`${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  href,
  arrow = false,
  children,
  ...rest
}: { variant?: Variant; href: string; arrow?: boolean; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  'href'
>) {
  const external = href.startsWith('http') || href.startsWith('tel:')
  const cls = `${variants[variant]} ${className}`
  const body = (
    <>
      {children}
      {(arrow || variant === 'ghost') && <Arrow />}
    </>
  )

  if (external) {
    const { onClick } = rest
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {body}
      </a>
    )
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {body}
    </Link>
  )
}

/** The arrow that travels a quarter-rem when its link is hovered. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className={`btn-arrow shrink-0 ${className}`}
    >
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04s.87 2.37 1 2.53c.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}
