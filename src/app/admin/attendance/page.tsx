import { Suspense } from 'react'
import { connection } from 'next/server'
import Link from 'next/link'
import { isAdminDatabaseConfigured } from '@/data/admin-mongo'
import { listStudents } from '@/data/attendance-queries'
import { requireAdmin } from '@/lib/admin-auth'
import { classDateSchema, todayAtSchool } from '@/lib/attendance-rules'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DatabasePanel } from '@/components/admin/attendance/DatabasePanel'
import { MarkRow } from '@/components/admin/attendance/MarkRow'
import { EmptyState, inputClass, secondaryButtonClass } from '@/components/admin/attendance/Parts'
import { formatClassDate } from '@/components/admin/attendance/format'

type Search = { q?: string | string[]; date?: string | string[] }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

async function AttendanceContent({ searchParams }: { searchParams: Promise<Search> }) {
  // Request-time boundary: sessions and student data never enter a cached shell.
  await connection()
  const session = await requireAdmin()
  if (!isAdminDatabaseConfigured()) return <DatabasePanel />

  const params = await searchParams
  const today = todayAtSchool()
  const requested = first(params.date).trim()
  const date = classDateSchema().safeParse(requested).success ? requested : today
  const q = first(params.q).trim().slice(0, 60)
  const students = await listStudents({ q, status: 'active' })

  return (
    <div className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <AdminHeader
          current="attendance"
          title="Mark attendance"
          description={`Class date: ${formatClassDate(date)}${date === today ? ' (today)' : ''}`}
          username={session.username}
        />

        <form method="get" className="mt-5 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-sm font-medium text-stone-800">
            Class date
            <input type="date" name="date" defaultValue={date} min="2016-01-01" max={today} className={inputClass} />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Find a student
            <input type="search" name="q" defaultValue={q} maxLength={60} autoComplete="off" placeholder="Name or phone" className={inputClass} />
          </label>
          <button className={secondaryButtonClass}>Show</button>
        </form>

        <p className="mt-4 text-sm text-stone-600">
          {students.length} active {students.length === 1 ? 'student' : 'students'}
          {q ? ` matching “${q}”` : ''}.{' '}
          <Link href="/admin/students/new" className="font-semibold text-[#6b1f2a]">Add a student</Link>
        </p>

        {students.length ? (
          <ul className="mt-3 grid gap-3">
            {students.map((student) => <MarkRow key={student.id} student={student} date={date} today={today} />)}
          </ul>
        ) : (
          <div className="mt-3">
            <EmptyState title={q ? 'No student matches that search' : 'No active students yet'}>
              {q ? 'Check the spelling, or search by phone number.' : <Link href="/admin/students/new" className="font-semibold text-[#6b1f2a]">Add the first student</Link>}
            </EmptyState>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AttendancePage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <Suspense fallback={<section className="min-h-dvh bg-stone-100" aria-label="Loading attendance" />}>
      <AttendanceContent searchParams={searchParams} />
    </Suspense>
  )
}
