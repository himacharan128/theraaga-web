import type { ReactNode } from 'react'

/**
 * The chapter: one section of a page, with its ground, its heading and the
 * graceful-degradation rule. Implements the whole plan §6 rule table in ONE
 * place so no section can quietly invent its own empty-state behaviour.
 *
 * Hard rules encoded by callers via `renderIf`:
 *   · never a testimonial carousel below 1 item
 *   · never a gallery below 6 items
 *   · never a faculty silhouette placeholder
 *   · never a zero-valued counter
 *
 * Three outcomes:
 *   renderIf true             → children
 *   renderIf false + fallback → the designed empty state
 *   renderIf false, no fallback → nothing at all (section vanishes cleanly)
 *
 * TONE is the chapter's ground. Colour is used architecturally: a page changes
 * ground between chapters (parchment, paper, sand, the dark stage, the maroon
 * close) rather than colouring boxes in.
 *
 * LAYOUT is how the heading meets the content. The old site gave every section
 * the same eyebrow, heading and grid; these four shapes exist so that the
 * variation carries meaning:
 *   stack   heading above the content, the default
 *   split   heading left, lede right on the same baseline (wide screens)
 *   rail    heading held in a left rail beside the content (wide screens)
 *   center  an intimate, centred chapter
 */
type Tone = 'default' | 'paper' | 'surface' | 'sand' | 'night' | 'accent'
type Layout = 'stack' | 'split' | 'rail' | 'center'

const TONE: Record<Tone, string> = {
  default: 'tone-light',
  paper: 'tone-paper',
  surface: 'tone-paper',
  sand: 'tone-sand',
  night: 'tone-night',
  accent: 'tone-maroon',
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  fallback,
  renderIf = true,
  tone = 'default',
  layout = 'stack',
  compact = false,
  className = '',
}: {
  id?: string
  eyebrow?: string
  title?: ReactNode
  lede?: ReactNode
  children?: ReactNode
  fallback?: ReactNode
  renderIf?: boolean
  tone?: Tone
  layout?: Layout
  compact?: boolean
  className?: string
}) {
  if (!renderIf && !fallback) return null

  const body = renderIf ? children : fallback
  const dark = tone === 'night' || tone === 'accent'
  const hasHeading = Boolean(eyebrow || title || lede)

  return (
    <section
      id={id}
      data-section={id}
      data-has-content={renderIf ? 'true' : 'false'}
      data-tone={dark ? 'dark' : undefined}
      className={`relative ${TONE[tone]} ${compact ? 'pad-section-sm' : 'pad-section'} ${className}`}
    >
      <div className="u-shell">
        {layout === 'rail' && hasHeading ? (
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <Heading eyebrow={eyebrow} title={title} lede={lede} layout="rail" />
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-7 xl:col-start-6">{body}</div>
          </div>
        ) : (
          <>
            {hasHeading && (
              <Heading eyebrow={eyebrow} title={title} lede={lede} layout={layout} flush={body == null} />
            )}
            {body}
          </>
        )}
      </div>
    </section>
  )
}

/**
 * The section heading in each of its four shapes.
 *
 * A chapter with an eyebrow and no title still needs a heading for anyone
 * navigating by headings, so the eyebrow itself becomes the heading element
 * then, set exactly as before. `flush` drops the space reserved for a body
 * when the heading is the whole chapter.
 */
export function Heading({
  eyebrow,
  title,
  lede,
  layout = 'stack',
  as: Tag = 'h2',
  flush = false,
}: {
  eyebrow?: string
  title?: ReactNode
  lede?: ReactNode
  layout?: Layout
  as?: 'h2' | 'h3'
  flush?: boolean
}) {
  const Eyebrow = title ? 'p' : Tag
  const gap = flush ? '' : 'mb-10 md:mb-14'

  if (layout === 'center') {
    return (
      <header className={`reveal mx-auto flex max-w-3xl flex-col items-center text-center ${gap}`}>
        {eyebrow && <Eyebrow className="kicker kicker-center mb-5">{eyebrow}</Eyebrow>}
        {title && <Tag className="t-headline text-fg">{title}</Tag>}
        {lede && <div className="t-standfirst mt-5 max-w-[46ch] text-fg-2">{lede}</div>}
      </header>
    )
  }

  if (layout === 'split') {
    return (
      <header className={`reveal grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end ${gap}`}>
        <div className="lg:col-span-7">
          {eyebrow && <Eyebrow className="kicker mb-5">{eyebrow}</Eyebrow>}
          {title && <Tag className="t-headline max-w-[18ch] text-fg">{title}</Tag>}
        </div>
        {lede && (
          <div className="t-standfirst max-w-[44ch] text-fg-2 lg:col-span-5 lg:pb-1">{lede}</div>
        )}
      </header>
    )
  }

  if (layout === 'rail') {
    return (
      <header className="reveal">
        {eyebrow && <Eyebrow className="kicker mb-5">{eyebrow}</Eyebrow>}
        {title && <Tag className="t-headline max-w-[14ch] text-fg">{title}</Tag>}
        {lede && <div className="t-standfirst mt-5 max-w-[40ch] text-fg-2">{lede}</div>}
      </header>
    )
  }

  return (
    <header className={`reveal ${gap}`}>
      {eyebrow && <Eyebrow className="kicker mb-5">{eyebrow}</Eyebrow>}
      {title && <Tag className="t-headline max-w-[20ch] text-fg">{title}</Tag>}
      {lede && <div className="t-standfirst mt-5 max-w-[52ch] text-fg-2">{lede}</div>}
    </header>
  )
}

/**
 * A designed empty state: never a grey box, never a skeleton, never a zero.
 * Reads as "not yet", which is honest, rather than "broken", which is fatal.
 * It is set as a quiet line of type between two rules, like a programme note.
 */
export function EmptyState({
  children,
  action,
}: {
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="reveal border-y border-line py-10 md:py-14">
      <div className="mx-auto max-w-[44ch] text-center">
        <span aria-hidden="true" className="mx-auto mb-6 block size-1.5 rotate-45 bg-mark" />
        <p className="t-standfirst italic text-fg-2">{children}</p>
        {action && <div className="mt-8 flex justify-center">{action}</div>}
      </div>
    </div>
  )
}
