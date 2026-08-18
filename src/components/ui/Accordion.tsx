'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

/**
 * Plain server-rendered accordion content — no FAQPage JSON-LD.
 * Google switched FAQ rich results off on 7 May 2026 and removed the docs on
 * 15 June 2026, so the markup is inert. The content still earns its keep for
 * conversion and for AI answer surfaces, which need no special markup.
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
    <ul className="grid gap-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <li
            key={item.id}
            className={`rounded-[var(--radius-sm)] border bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)] transition-[border-color,box-shadow] duration-[var(--dur-fast)] ${
              isOpen
                ? 'border-[color-mix(in_srgb,var(--color-accent)_60%,transparent)] shadow-[var(--shadow-soft)]'
                : 'border-border hover:border-border-strong'
            }`}
          >
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
                className="flex min-h-16 w-full items-start justify-between gap-6 px-5 py-5 text-left sm:px-6"
              >
                <span className="text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_7%,transparent)] text-accent transition-transform duration-[var(--dur-fast)] ease-[var(--ease-raaga)]"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 1v16M1 9h16"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              hidden={!isOpen}
            >
              <p className="u-measure px-5 pb-6 text-text-secondary sm:px-6">{item.answer}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
