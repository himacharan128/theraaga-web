import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

/**
 * Long-form legal and policy text, set as a document: each section numbered,
 * and the sections listed in a contents rail beside the reading column on a
 * wide screen and above it on a phone, the way a guide is set.
 *
 * The contents are read from the document's own top-level <h2>s, so a heading
 * added or reworded on a policy page appears in the contents without a second
 * edit, and the page's wording is never restated anywhere else.
 */
export function Prose({ children }: { children: ReactNode }) {
  const contents: { id: string; label: string }[] = []
  const taken = new Set<string>()

  const body = Children.toArray(children).map((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child) || child.type !== 'h2') return child
    const label = textOf(child.props.children)
    const base = slug(label) || 'section'
    let id = base
    for (let n = 2; taken.has(id); n++) id = `${base}-${n}`
    taken.add(id)
    contents.push({ id, label })
    return (
      <header
        key={id}
        id={id}
        className="mt-14 scroll-mt-[calc(var(--header-h)+1.5rem)] border-t border-line pt-8 md:mt-16"
      >
        <span aria-hidden="true" className="t-numeral block text-[1.5rem] text-accent-muted">
          {String(contents.length).padStart(2, '0')}
        </span>
        {cloneElement(child as ReactElement<{ className?: string }>, {
          className: 't-subhead mt-3 text-balance text-fg',
        })}
      </header>
    )
  })

  return (
    <div className="u-shell pad-section-sm">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
        {contents.length > 1 && (
          <nav aria-label="In this document" className="mb-14 lg:col-span-3 lg:mb-0">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="t-label text-fg-3">In this document</p>
              <ol className="mt-4 border-t border-line">
                {contents.map((entry, i) => (
                  <li key={entry.id} className="border-b border-line">
                    <a
                      href={`#${entry.id}`}
                      className="group grid min-h-11 grid-cols-[1.75rem_1fr] items-baseline gap-x-2 py-3 no-underline"
                    >
                      <span aria-hidden="true" className="t-meta text-fg-3">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="t-small text-fg-2 transition-colors duration-[var(--dur-1)] group-hover:text-kicker">
                        {entry.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}
        <article className="prose-raaga lg:col-span-7 lg:col-start-5">{body}</article>
      </div>
    </div>
  )
}

/** The plain text of a heading, however it is marked up inside. */
function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/** "Why we use it, and for how long" becomes "why-we-use-it-and-for-how-long". */
function slug(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
