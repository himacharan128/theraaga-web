import { deleteLead, updateLeadStatus } from '@/app/admin/actions'
import { LEAD_STATUSES, type LeadStatus } from '@/data/admin-dashboard'
import type { AGE_BANDS } from '@/lib/enquiry-schema'

/*
 * Pieces shared by the dashboard and the enquiries list. Each page renders a
 * lead twice, as a stacked card on phones and as a table row from `md` up, so
 * anything with behaviour lives here once rather than in both layouts.
 */

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  trial_booked: 'Trial booked',
  enrolled: 'Enrolled',
  lost: 'Closed',
}

export const AGE_LABELS: Record<(typeof AGE_BANDS)[number], string> = {
  under_7: 'Under 7',
  '7_12': '7–12',
  '13_17': '13–17',
  adult: 'Adult',
}

export function LeadContact({ name, phone }: { name: string; phone: string }) {
  return (
    <>
      <p className="font-medium text-stone-900">{name}</p>
      <a className="mt-1 inline-block text-stone-600 hover:text-[#6b1f2a]" href={`https://wa.me/91${phone}`} target="_blank" rel="noopener noreferrer">
        +91 {phone}
      </a>
    </>
  )
}

export function LeadStatusForm({ id, name, status }: { id: string; name: string; status: LeadStatus }) {
  return (
    <form action={updateLeadStatus} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} aria-label={`Status for ${name}`} className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm">
        {LEAD_STATUSES.map((value) => <option key={value} value={value}>{LEAD_STATUS_LABELS[value]}</option>)}
      </select>
      <button className="rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-400">Save</button>
    </form>
  )
}

/**
 * Two-step erasure with no JavaScript: a native <details> keeps the permanent
 * action one deliberate click behind a warning, so a thumb brushing a phone
 * screen cannot delete a parent's enquiry.
 */
export function DeleteLeadControl({ id, name }: { id: string; name: string }) {
  return (
    <details>
      <summary
        aria-label={`Delete enquiry from ${name}`}
        className="inline-flex min-h-[42px] cursor-pointer list-none items-center rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-400 [&::-webkit-details-marker]:hidden"
      >
        Delete
      </summary>
      <form action={deleteLead} className="mt-2 grid max-w-xs gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
        <input type="hidden" name="id" value={id} />
        <p className="text-xs leading-5 text-red-900">
          This removes the enquiry for good. It cannot be undone.
        </p>
        <button
          aria-label={`Delete permanently, enquiry from ${name}`}
          className="rounded-lg bg-red-800 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-900"
        >
          Delete permanently
        </button>
      </form>
    </details>
  )
}
