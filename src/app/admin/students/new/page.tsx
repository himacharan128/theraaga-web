import { Suspense } from 'react'
import { connection } from 'next/server'
import Link from 'next/link'
import { isAdminDatabaseConfigured } from '@/data/admin-mongo'
import { requireAdmin } from '@/lib/admin-auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DatabasePanel } from '@/components/admin/attendance/DatabasePanel'
import { StudentForm } from '@/components/admin/attendance/StudentForm'
import { createStudentAction } from '../actions'

async function NewStudentContent() {
  await connection()
  const session = await requireAdmin()
  if (!isAdminDatabaseConfigured()) return <DatabasePanel />
  return (
    <div className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <AdminHeader current="students" title="Add a student" description="Adult contact details only. Never a child’s date of birth." username={session.username} />
        <p className="mt-4 text-sm"><Link href="/admin/students" className="font-semibold text-[#6b1f2a]">Back to students</Link></p>
        <section className="mt-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <StudentForm action={createStudentAction} submitLabel="Add student" />
        </section>
      </div>
    </div>
  )
}

export default function NewStudentPage() {
  return (
    <Suspense fallback={<section className="min-h-dvh bg-stone-100" aria-label="Loading form" />}>
      <NewStudentContent />
    </Suspense>
  )
}
