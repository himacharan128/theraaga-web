'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

/**
 * The FAQ, set as a numbered index rather than a stack of boxes: hairline
 * rows, the question in the display face beside its number, a plus that
 * resolves to a minus, and the answer in the reading face under the question.
 * The open row's number turns maroon, so the eye can find its place again.
 *
 * Accessibility is the disclosure pattern exactly: each question is a button
 * inside a heading, with aria-expanded and aria-controls, and the answer is a
 * labelled region that is `hidden` while closed, so a closed answer is neither
 * read nor tabbed into. The answer appears at once (the a11y check asserts it
 * is visible immediately); only its type eases in, and not under reduced
 * motion.
 *
 * Plain server-rendered content, no FAQPage JSON-LD. Google switched FAQ rich
 * results off on 7 May 2026 and removed the docs on 15 June 2026, so the
 * markup is inert. The content still earns its keep for conversion and for AI
 * answer surfaces, which need no special markup.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { id: string | number; question: string; answer: string }[]
  defaultOpen?: number
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <ol className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <li key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                onClick={() => {
                  const next = isOpen ? null : i
                  setOpen(next)
                  if (next !== null) track('faq_expand', { question: item.question })
                }}
                className="group grid min-h-16 w-full grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 py-6 text-left md:grid-cols-[3.5rem_1fr_auto] md:gap-x-5 md:py-7"
              >
                <span
                  aria-hidden="true"
                  className="t-numeral text-[1.0625rem] text-fg-3 transition-colors duration-[var(--dur-2)] group-hover:text-kicker group-aria-expanded:text-kicker md:text-[1.25rem]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="t-title text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
                  {item.question}
                </span>
                <span aria-hidden="true" className="relative ml-2 size-3.5 self-center text-kicker">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-[var(--dur-2)] ease-[var(--ease-out-expo)] group-aria-expanded:scale-y-0" />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              hidden={!isOpen}
            >
              <p className="faq-answer t-prose max-w-[60ch] pb-8 pl-[2.75rem] text-fg-2 md:pl-[4.75rem] md:pb-10">
                {item.answer}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
