import { deleteLead } from '@/app/admin/actions'

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
