import type { ReactNode } from 'react'
import { PACKAGE_TARGET, packageProgress, type NotificationStatus } from '@/lib/attendance-rules'
import { NOTIFICATION_LABELS, NOTIFICATION_TONES, RECIPIENT_LABELS } from './format'

/* Pure presentational pieces: no data access, so they render in tests. */

export function ProgressPill({ attended, target = PACKAGE_TARGET }: { attended: number; target?: number }) {
  const progress = packageProgress(attended, target)
  const complete = progress.done >= progress.target
  return (
    <span
      aria-label={`${progress.done} of ${progress.target} classes`}
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-semibold tabular-nums ring-1 ${
        complete ? 'bg-emerald-50 text-emerald-900 ring-emerald-200' : 'bg-[#6b1f2a]/5 text-[#6b1f2a] ring-[#6b1f2a]/20'
      }`}
    >
      {progress.label}
    </span>
  )
}

export function ProgressBar({ attended, target = PACKAGE_TARGET }: { attended: number; target?: number }) {
  const progress = packageProgress(attended, target)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={progress.target}
      aria-valuenow={progress.done}
      aria-label={`${progress.done} of ${progress.target} classes attended`}
      className="h-3 w-full overflow-hidden rounded-full bg-stone-200"
    >
      <div className="h-full rounded-full bg-[#6b1f2a]" style={{ width: `${(progress.done / progress.target) * 100}%` }} />
    </div>
  )
}

export function NotificationChip({ status, recipient }: { status: NotificationStatus; recipient?: 'student' | 'school' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${NOTIFICATION_TONES[status]}`}>
      {recipient ? `${RECIPIENT_LABELS[recipient]}: ` : ''}
      {NOTIFICATION_LABELS[status]}
    </span>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
      <p className="font-semibold text-stone-900">{title}</p>
      {children ? <div className="mt-2 text-sm leading-6 text-stone-600">{children}</div> : null}
    </div>
  )
}

export function StatCard({ label, value, help, tone }: { label: string; value: number; help: string; tone?: 'alert' }) {
  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${tone === 'alert' && value > 0 ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-white'}`}>
      <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-light tabular-nums">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-500">{help}</p>
    </article>
  )
}

export const inputClass =
  'mt-1 block min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 focus:border-[#6b1f2a]'
export const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-xl bg-[#6b1f2a] px-5 py-2 text-base font-semibold text-[#f7f3ea] transition hover:bg-[#5c1a20] disabled:cursor-not-allowed disabled:opacity-60'
export const secondaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-60'
export const dangerButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-xl bg-red-800 px-5 py-2 text-base font-semibold text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60'
