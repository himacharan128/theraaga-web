import { TanpuraRule } from '@/components/ui/Ornament'

/**
 * The navigation loading state.
 *
 * Deliberately NOT a skeleton. Skeletons draw a picture of content that does
 * not exist yet, which is the same promise a placeholder frame makes — and this
 * site renders designed empty states precisely so it never makes that promise.
 * A skeleton here would also be a lie about shape: most routes are prerendered,
 * so this only ever appears for the streamed part of a partially prerendered
 * page, whose layout it cannot know.
 *
 * So: one tanpura string, breathing. It occupies the same vertical space a
 * section would, so the page does not jump when the content arrives, and it
 * says "working" without describing what is coming.
 *
 * `role="status"` with a polite live region, because a sighted visitor sees the
 * motion and a screen-reader user otherwise gets silence.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[55vh] items-center justify-center py-[var(--spacing-section)]"
    >
      <span className="sr-only">Loading</span>
      <TanpuraRule className="motion-breathe h-24" />
    </div>
  )
}
