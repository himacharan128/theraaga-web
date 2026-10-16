import { Suspense } from 'react'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAdminDatabaseConfigured } from '@/data/admin-mongo'
import { getStudentDetail } from '@/data/attendance-queries'
import { requireAdmin } from '@/lib/admin-auth'
import { ID_PATTERN, formatWhatsApp, todayAtSchool } from '@/lib/attendance-rules'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ActionForm, SubmitButton } from '@/components/admin/attendance/ActionForm'
import { DatabasePanel } from '@/components/admin/attendance/DatabasePanel'
import { PackageSection } from '@/components/admin/attendance/PackageSection'
import { EmptyState, dangerButtonClass, inputClass, primaryButtonClass, secondaryButtonClass } from '@/components/admin/attendance/Parts'
import { StudentForm } from '@/components/admin/attendance/StudentForm'
import { formatDateTime } from '@/components/admin/attendance/format'
import { eraseStudentAction, setStudentStatusAction, startPackageAction, updateStudentAction } from '../actions'

type Search = { created?: string | string[]; shared?: string | string[] }

async function StudentContent({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Search> }) {
  await connection()
  const session = await requireAdmin()
  if (!isAdminDatabaseConfigured()) return <DatabasePanel />

  const { id } = await params
  if (!ID_PATTERN.test(id)) notFound()
  const detail = await getStudentDetail(id)
  if (!detail) notFound()
  const query = await searchParams
  const { student, packages } = detail
  const today = todayAtSchool()
  const hasActive = packages.some((pkg) => pkg.status === 'active')
  const inactive = student.status === 'inactive'

  return (
    <div className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <AdminHeader
          current="students"
          title={student.name}
          description={`${student.isMinor ? 'Parent or guardian' : 'Contact'}: ${student.contactName} · ${formatWhatsApp(student.whatsapp)}${inactive ? ' · Inactive' : ''}`}
          username={session.username}
        />
        <p className="mt-4 text-sm"><Link href="/admin/students" className="font-semibold text-[#6b1f2a]">Back to students</Link></p>

        {query.created ? <p role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Student added.</p> : null}
        {query.shared ? <p role="status" className="mt-3 rounded-xl border border-stone-300 bg-white p-3 text-sm text-stone-700">This WhatsApp number is also used by another student. That is fine for siblings.</p> : null}

        <div className="mt-5 grid gap-5">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2>Packages</h2>
            {inactive ? <p className="mt-2 text-sm text-stone-600">This student is inactive. Reactivate them to mark attendance or start a package.</p> : null}
            {!hasActive && !inactive ? (
              <ActionForm action={startPackageAction} className="mt-3">
                <input type="hidden" name="studentId" value={student.id} />
                <SubmitButton className={primaryButtonClass}>{packages.length ? 'Start next package' : 'Start first package'}</SubmitButton>
              </ActionForm>
            ) : null}
          </section>

          {packages.length ? (
            packages.map((pkg) => (
              <PackageSection key={pkg.id} pkg={pkg} studentId={student.id} studentName={student.name} today={today} canReopen={!hasActive} />
            ))
          ) : (
            <EmptyState title="No package started yet">Start the first package to begin marking classes.</EmptyState>
          )}

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2>Details</h2>
            <p className="mt-1 text-xs text-stone-500">
              Added {formatDateTime(student.createdAt)}
              {student.consentRecordedAt ? ` · WhatsApp consent recorded ${formatDateTime(student.consentRecordedAt)}` : ''}
            </p>
            <div className="mt-4">
              <StudentForm
                action={updateStudentAction}
                studentId={student.id}
                submitLabel="Save details"
                defaults={{
                  name: student.name,
                  contactName: student.contactName,
                  whatsapp: formatWhatsApp(student.whatsapp),
                  place: student.place,
                  batch: student.batch ?? '',
                  isMinor: student.isMinor,
                  whatsappConsent: student.whatsappConsent,
                }}
              />
            </div>
            <ActionForm action={setStudentStatusAction} className="mt-5 border-t border-stone-100 pt-4">
              <input type="hidden" name="id" value={student.id} />
              <input type="hidden" name="status" value={inactive ? 'active' : 'inactive'} />
              <SubmitButton className={secondaryButtonClass}>{inactive ? 'Reactivate student' : 'Mark inactive'}</SubmitButton>
              {!inactive ? <p className="mt-2 text-xs text-stone-500">Inactive students cannot be marked present. Their history is kept.</p> : null}
            </ActionForm>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-5">
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-red-900">Erase this student</summary>
              <ActionForm action={eraseStudentAction} className="mt-3 grid gap-3">
                <input type="hidden" name="id" value={student.id} />
                <p className="text-sm leading-6 text-stone-700">
                  This permanently deletes {student.name}, every package, every attendance record and every WhatsApp message record. It cannot be undone. Use it for a deletion request, not for a student who has simply left.
                </p>
                <label className="text-sm font-medium text-stone-800">
                  Type the student’s name to confirm
                  <input name="confirmName" required autoComplete="off" className={inputClass} />
                </label>
                <div><SubmitButton className={dangerButtonClass}>Erase permanently</SubmitButton></div>
              </ActionForm>
            </details>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function StudentPage(props: { params: Promise<{ id: string }>; searchParams: Promise<Search> }) {
  return (
    <Suspense fallback={<section className="min-h-dvh bg-stone-100" aria-label="Loading student" />}>
      <StudentContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  )
}
