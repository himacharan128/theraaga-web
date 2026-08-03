/**
 * These four legal pages are DPDP-touching documents for an entity that
 * processes data relating to minors. They are drafted here so the site can ship
 * complete and so the client can see exactly what needs confirming — but they
 * carry operational facts (legal entity type, registered name, grievance
 * officer, refund timelines) that only the client can supply, and they should be
 * reviewed by an Indian lawyer before launch.
 *
 * This banner is intentionally visible. Remove it only when the content has
 * been confirmed and reviewed.
 */
export function LegalDraftNotice() {
  return (
    <aside
      role="note"
      className="mb-12 border-l-2 border-accent bg-surface px-5 py-4"
    >
      <p className="!mt-0 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-secondary">
        <strong className="text-accent">Draft — pending review.</strong> This
        policy is complete in structure but still needs the school’s registered
        entity details and a named grievance officer, and should be checked by a
        lawyer before launch.
      </p>
    </aside>
  )
}
