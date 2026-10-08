import type { CSSProperties } from 'react'
import { ECHO, INTRO, RINGS } from './score'
import { runIntro } from './runtime'

/**
 * The homepage intro: "sound becoming form". A quiet ivory field, a fine axis,
 * three rings of resonance, then the mark opens out of the axis, the wordmark
 * settles beside it, नादतनुमनिशम् is felt for a moment, and the veil lifts onto
 * the real hero, whose headline begins to rise as it clears. The timing is in
 * score.ts; how it decides, plays and gets out of the way is in runtime.ts.
 *
 * It is a veil over the page, not a page: the homepage renders and loads
 * underneath it from the first byte. It sits first in the site layout, so its
 * script runs before anything else in the body has been parsed, let alone
 * painted; and it is display:none until that script claims the document, so
 * without JavaScript, on any other route, on a reload or on a second arrival
 * in the same tab there is nothing here at all.
 *
 * The mark is the client's own artwork through the same lockup as the header
 * (`.brand-lockup`), at the master proportions, never redrawn or distorted.
 * The Sanskrit line is the school's own, from the site record, never invented
 * here. Everything is decorative and hidden from assistive technology; the
 * page beneath stays reachable throughout, and any key, tap or scroll lifts
 * the veil.
 *
 * The script is emitted inside a wrapper's innerHTML: the browser runs it when
 * the document is parsed, and a later client render (a navigation into the
 * site from the admin portal, a dev refresh) inserts it inert, so it can never
 * play twice in one document.
 */
export function Intro({ line }: { line: { devanagari: string; roman: string } }) {
  const script = `(${runIntro.toString()})(${JSON.stringify(INTRO).replace(/</g, '\\u003c')})`

  return (
    <div id={INTRO.id} aria-hidden="true" className="intro fixed inset-0" style={{ display: 'none' }}>
      <span data-part="glow" className="intro-glow absolute inset-0 opacity-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* The lockup's box. The axis and the rings stand on the emblem's
            centre line, so the resonance comes from the mark itself; the last
            ring carries out from the whole lockup. */}
        <div className="relative flex">
          <span
            data-part="axis"
            className="intro-axis absolute top-1/2 w-px -translate-y-1/2 bg-mark opacity-0"
          />
          {RINGS.map((r, i) => (
            <span
              key={r}
              data-part={`ring${i + 1}`}
              className="intro-ring absolute top-1/2 rounded-full border -translate-x-1/2 -translate-y-1/2 opacity-0"
              style={{ '--r': r } as CSSProperties}
            />
          ))}
          <span
            data-part="echo"
            className="intro-ring absolute top-1/2 left-1/2 rounded-full border border-mark -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={{ '--r': ECHO } as CSSProperties}
          />
          <span className="brand-lockup">
            <span data-part="emblem" className="brand-emblem shrink-0 opacity-0" />
            <span data-part="word" className="brand-wordmark shrink-0 opacity-0" />
          </span>
        </div>
        <span data-part="rule" className="mt-8 h-px w-6 bg-mark opacity-0" />
        <span data-part="deva" lang="sa" className="deva mt-4 text-[1.375rem] leading-[1.3] text-fg opacity-0">
          {line.devanagari}
        </span>
        <span data-part="roman" className="t-caption mt-1 text-fg-2 opacity-0">
          {line.roman}
        </span>
      </div>
      <span hidden dangerouslySetInnerHTML={{ __html: `<script>${script}</script>` }} />
    </div>
  )
}
