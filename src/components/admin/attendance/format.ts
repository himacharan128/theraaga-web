import type { NotificationStatus } from '@/lib/attendance-rules'

/** "2026-10-06" → "6 Oct 2026". Calendar dates have no time zone. */
export function formatClassDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(date)
}

export const NOTIFICATION_LABELS: Record<NotificationStatus, string> = {
  held: 'Held',
  skipped: 'Not sent: no consent',
  pending: 'Waiting to send',
  sending: 'Sending',
  accepted: 'Accepted by WhatsApp',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  uncertain: 'Check WhatsApp',
  failed: 'Failed',
}

export const NOTIFICATION_TONES: Record<NotificationStatus, string> = {
  held: 'bg-amber-50 text-amber-900 ring-amber-200',
  skipped: 'bg-stone-100 text-stone-700 ring-stone-300',
  pending: 'bg-sky-50 text-sky-900 ring-sky-200',
  sending: 'bg-sky-50 text-sky-900 ring-sky-200',
  accepted: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  sent: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  delivered: 'bg-emerald-100 text-emerald-950 ring-emerald-300',
  read: 'bg-emerald-100 text-emerald-950 ring-emerald-300',
  uncertain: 'bg-amber-50 text-amber-900 ring-amber-300',
  failed: 'bg-red-50 text-red-900 ring-red-200',
}

export const RECIPIENT_LABELS = { student: 'Student contact', school: 'School' } as const

export function pluralise(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}
