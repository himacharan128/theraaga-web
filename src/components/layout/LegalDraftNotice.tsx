/**
 * These four legal pages are DPDP-touching documents for an entity that
 * processes data relating to minors. They are drafted here so the site can ship
 * complete and so the client can see exactly what needs confirming, but they
 * carry operational facts (legal entity type, registered name, grievance
 * officer, refund timelines) that only the client can supply, and they should be
 * reviewed by an Indian lawyer before launch.
 *
 * This banner is intentionally visible. Remove it only when the content has
 * been confirmed and reviewed. It heads the document as a margin note on
 * paper, the one tinted block on the page, so it reads before the first
 * clause and is never mistaken for one.
 */
export function LegalDraftNotice() {
  return (
    <aside role="note" className="border-l-2 border-[var(--btn-ink)] bg-[var(--color-surface)] px-5 py-4 md:px-6 md:py-5">
      <p className="t-small mt-0 text-fg-2">
        <strong className="font-medium text-[var(--btn-ink)]">Draft, pending review.</strong> This
        policy is complete in structure but still needs the school’s registered
        entity details and a named grievance officer, and should be checked by a
        lawyer before launch.
      </p>
    </aside>
  )
}
