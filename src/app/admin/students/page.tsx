import { Suspense } from 'react'
import { connection } from 'next/server'
import Link from 'next/link'
import { isAdminDatabaseConfigured } from '@/data/admin-mongo'
import { getAttendanceSummary, listStudents } from '@/data/attendance-queries'
import { requireAdmin } from '@/lib/admin-auth'
import type { NotificationStatus } from '@/lib/attendance-rules'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DatabasePanel } from '@/components/admin/attendance/DatabasePanel'
import { EmptyState, NotificationChip, ProgressPill, StatCard, inputClass, primaryButtonClass, secondaryButtonClass } from '@/components/admin/attendance/Parts'
import { RECIPIENT_LABELS, formatDateTime } from '@/components/admin/attendance/format'

type Search = { q?: string | string[]; status?: string | string[] }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

async function StudentsContent({ searchParams }: { searchParams: Promise<Search> }) {
  await connection()
  const session = await requireAdmin()
  if (!isAdminDatabaseConfigured()) return <DatabasePanel />

  const params = await searchParams
  const q = first(params.q).trim().slice(0, 60)
  const rawStatus = first(params.status)
  const status = rawStatus === 'inactive' || rawStatus === 'all' ? rawStatus : 'active'
  const [summary, students] = await Promise.all([getAttendanceSummary(), listStudents({ q, status })])

  return (
    <div className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <AdminHeader current="students" title="Students and packages" description="Eight-class packages, completions and WhatsApp updates." username={session.username} />

        <section aria-label="Summary" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Active students" value={summary.activeStudents} help="Can be marked present" />
          <StatCard label="Active packages" value={summary.activePackages} help="Started, not yet complete" />
          <StatCard label="Nearly complete" value={summary.approaching.length} help="Two classes or fewer to go" />
          <StatCard label="Needs attention" value={summary.needsAttention.length} help="Messages held, failed or unclear" tone="alert" />
        </section>

        {summary.needsAttention.length > 0 && (
          <section className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <h2>Needs attention</h2>
            <ul className="mt-3 divide-y divide-amber-200">
              {summary.needsAttention.map((item) => (
                <li key={item.notificationId} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900">{item.studentName}</p>
                    <p className="text-stone-600">{RECIPIENT_LABELS[item.recipient as 'student' | 'school'] ?? item.recipient}{item.statusNote ? `: ${item.statusNote}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <NotificationChip status={item.status as NotificationStatus} />
                    <Link href={`/admin/students/${item.studentId}#package-${item.packageId}`} className="font-semibold text-[#6b1f2a]">Open</Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6">
          <h2>Recent completions</h2>
          {summary.recentCompletions.length ? (
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {summary.recentCompletions.map((item) => (
                <li key={item.packageId} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <Link href={`/admin/students/${item.studentId}#package-${item.packageId}`} className="font-semibold text-stone-900 hover:text-[#6b1f2a]">
                    {item.studentName}, package {item.number}
                  </Link>
                  <p className="mt-0.5 text-xs text-stone-500">Completed {formatDateTime(item.completedAt)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.notifications.map((n) => <NotificationChip key={n.id} status={n.status as NotificationStatus} recipient={n.recipient as 'student' | 'school'} />)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3"><EmptyState title="No packages completed in the last 45 days">Completed packages and their WhatsApp status appear here.</EmptyState></div>
          )}
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2>All students</h2>
            <Link href="/admin/students/new" className={primaryButtonClass}>Add student</Link>
          </div>
          <form method="get" className="mt-3 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <label className="text-sm font-medium text-stone-800">
              Find a student
              <input type="search" name="q" defaultValue={q} maxLength={60} autoComplete="off" placeholder="Name or phone" className={inputClass} />
            </label>
            <label className="text-sm font-medium text-stone-800">
              Show
              <select name="status" defaultValue={status} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="all">All</option>
              </select>
            </label>
            <button className={secondaryButtonClass}>Search</button>
          </form>
          {students.length ? (
            <ul className="mt-3 divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white shadow-sm">
              {students.map((student) => (
                <li key={student.id}>
                  <Link href={`/admin/students/${student.id}`} className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 hover:bg-stone-50">
                    <span className="min-w-0">
                      <span className="block break-words font-semibold text-stone-900">{student.name}</span>
                      <span className="block text-xs text-stone-500">
                        {student.status === 'inactive' ? 'Inactive' : student.activePackage ? `Package ${student.activePackage.number}` : 'No active package'}
                        {student.isMinor ? ' · Under 18' : ''}
                      </span>
                    </span>
                    {student.activePackage ? <ProgressPill attended={student.activePackage.attended} target={student.activePackage.target} /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3"><EmptyState title={q ? 'No student matches that search' : 'No students yet'}>{q ? 'Try a different spelling or phone number.' : 'Use Add student to create the first record.'}</EmptyState></div>
          )}
        </section>
      </div>
    </div>
  )
}

export default function StudentsPage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <Suspense fallback={<section className="min-h-dvh bg-stone-100" aria-label="Loading students" />}>
      <StudentsContent searchParams={searchParams} />
    </Suspense>
  )
}
