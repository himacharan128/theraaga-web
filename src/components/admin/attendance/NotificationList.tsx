import { formatWhatsApp } from '@/lib/attendance-rules'
import {
  retryNotificationAction,
} from '@/app/admin/students/actions'
import type { NotificationRow } from '@/data/attendance-queries'
import { ActionForm, SubmitButton } from './ActionForm'
import { RECIPIENT_LABELS, formatDateTime } from './format'
import { NotificationChip, secondaryButtonClass } from './Parts'

const RETRYABLE = new Set(['held', 'failed', 'uncertain', 'skipped'])

export function NotificationList({ notifications, packageId, studentId }: { notifications: NotificationRow[]; packageId: string; studentId: string }) {
  if (!notifications.length) return <p className="text-sm text-stone-500">No WhatsApp messages were created for this package.</p>
  return (
    <ul className="grid gap-3">
      {notifications.map((n) => (
        <li key={n.id} className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-stone-900">
              {RECIPIENT_LABELS[n.recipient]}
              {n.revision > 0 ? `, corrected calendar ${n.revision}` : n.completionSeq > 1 ? `, completion ${n.completionSeq}` : ''}
            </p>
            <NotificationChip status={n.status} />
          </div>
          <dl className="mt-2 grid gap-1 text-xs text-stone-600">
            {n.to ? <div className="flex gap-2"><dt className="text-stone-500">To</dt><dd>{formatWhatsApp(n.to)}</dd></div> : null}
            {n.statusNote ? <div className="flex gap-2"><dt className="text-stone-500">Note</dt><dd className="min-w-0 break-words">{n.statusNote}</dd></div> : null}
            <div className="flex gap-2"><dt className="text-stone-500">Attempts</dt><dd>{n.attempts}</dd></div>
            {n.lastError ? <div className="flex gap-2"><dt className="text-stone-500">Last error</dt><dd className="min-w-0 break-words">{n.lastError.title} ({formatDateTime(n.lastError.at)})</dd></div> : null}
            <div className="flex gap-2"><dt className="text-stone-500">Updated</dt><dd>{formatDateTime(n.updatedAt)}</dd></div>
          </dl>
          {RETRYABLE.has(n.status) ? (
            <ActionForm action={retryNotificationAction} className="mt-3 grid gap-2">
              <input type="hidden" name="notificationId" value={n.id} />
              <input type="hidden" name="packageId" value={packageId} />
              <input type="hidden" name="studentId" value={studentId} />
              {n.status === 'uncertain' ? (
                <label className="flex min-h-12 items-start gap-3 text-sm text-stone-800">
                  <input type="checkbox" name="confirmUncertain" className="mt-1 size-5 shrink-0 accent-[#6b1f2a]" />
                  <span>I checked WhatsApp and it was not received</span>
                </label>
              ) : null}
              <div><SubmitButton className={secondaryButtonClass}>{n.status === 'held' || n.status === 'skipped' ? 'Send now' : 'Retry'}</SubmitButton></div>
            </ActionForm>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
