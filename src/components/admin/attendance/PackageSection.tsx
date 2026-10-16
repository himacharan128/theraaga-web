import {
  changeDateAction,
  markAttendanceAction,
  removeAttendanceAction,
  reopenPackageAction,
  sendCorrectedCalendarAction,
} from '@/app/admin/students/actions'
import type { AttendanceRow, PackageView } from '@/data/attendance-queries'
import { ActionForm, SubmitButton } from './ActionForm'
import { NotificationList } from './NotificationList'
import { formatClassDate, formatDateTime } from './format'
import { ProgressBar, ProgressPill, dangerButtonClass, inputClass, primaryButtonClass, secondaryButtonClass } from './Parts'

const summaryClass =
  'inline-flex min-h-12 cursor-pointer list-none items-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-400 [&::-webkit-details-marker]:hidden'

function AttendanceItem({ row, canRemove, studentId, today }: { row: AttendanceRow; canRemove: boolean; studentId: string; today: string }) {
  const removed = row.status === 'removed'
  const last = row.history.at(-1)
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={removed ? 'text-stone-500 line-through' : 'font-semibold text-stone-900'}>{formatClassDate(row.classDate)}</p>
        <p className="text-xs text-stone-500">{removed ? 'Removed' : `Marked ${formatDateTime(row.markedAt)} by ${row.markedBy}`}</p>
      </div>
      {last?.reason ? <p className="mt-1 text-xs text-stone-500">{last.action.replaceAll('_', ' ')}: {last.reason}</p> : null}
      {removed ? null : (
        <div className="mt-2 flex flex-wrap gap-2">
          <details className="w-full sm:w-auto">
            <summary className={summaryClass}>Change date</summary>
            <ActionForm action={changeDateAction} className="mt-2 grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
              <input type="hidden" name="attendanceId" value={row.id} />
              <input type="hidden" name="studentId" value={studentId} />
              <label className="text-sm font-medium text-stone-800">New date<input type="date" name="newDate" required min="2016-01-01" max={today} defaultValue={row.classDate} className={inputClass} /></label>
              <label className="text-sm font-medium text-stone-800">Reason<input name="reason" required minLength={3} maxLength={200} autoComplete="off" className={inputClass} /></label>
              <div><SubmitButton className={primaryButtonClass}>Save new date</SubmitButton></div>
            </ActionForm>
          </details>
          {canRemove ? (
            <details className="w-full sm:w-auto">
              <summary className={summaryClass}>Remove</summary>
              <ActionForm action={removeAttendanceAction} className="mt-2 grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
                <input type="hidden" name="attendanceId" value={row.id} />
                <input type="hidden" name="studentId" value={studentId} />
                <label className="text-sm font-medium text-stone-800">Reason<input name="reason" required minLength={3} maxLength={200} autoComplete="off" className={inputClass} /></label>
                <div><SubmitButton className={dangerButtonClass}>Remove this class</SubmitButton></div>
              </ActionForm>
            </details>
          ) : null}
        </div>
      )}
    </li>
  )
}

export function PackageSection({
  pkg,
  studentId,
  studentName,
  today,
  canReopen,
}: {
  pkg: PackageView
  studentId: string
  studentName: string
  today: string
  canReopen: boolean
}) {
  const active = pkg.status === 'active'
  return (
    <section id={`package-${pkg.id}`} className="scroll-mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg">Package {pkg.number}</h3>
        <ProgressPill attended={pkg.attended} target={pkg.target} />
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Started {formatDateTime(pkg.startedAt)}
        {pkg.completedAt ? ` · Completed ${formatDateTime(pkg.completedAt)}` : ' · In progress'}
      </p>
      <div className="mt-3"><ProgressBar attended={pkg.attended} target={pkg.target} /></div>
      {active && pkg.attended < pkg.target ? <p className="mt-2 text-sm text-stone-600">{pkg.target - pkg.attended} to go.</p> : null}
      {active && pkg.attended >= pkg.target ? (
        <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
          Reopened with all {pkg.target} classes still counted. Remove the class that should not count below, then mark the correct one to complete it again.
        </p>
      ) : null}

      {active ? (
        <ActionForm action={markAttendanceAction} className="mt-4 grid gap-2 rounded-xl bg-stone-50 p-3">
          <input type="hidden" name="studentId" value={studentId} />
          <label className="text-sm font-medium text-stone-800">Class date<input type="date" name="classDate" required min="2016-01-01" max={today} defaultValue={today} className={inputClass} /></label>
          <div><SubmitButton className={`${primaryButtonClass} w-full sm:w-auto`}>Mark attended</SubmitButton></div>
        </ActionForm>
      ) : null}

      {pkg.status === 'completed' ? (
        <div className="mt-4">
          {pkg.amended ? (
            <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              A class date changed after completion. The calendar already sent shows the old dates.
            </p>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- private admin PNG; next/image would cache it publicly */}
          <img
            src={`/admin/calendar/${pkg.id}${pkg.revision > 0 ? `?revision=${pkg.revision}` : ''}`}
            alt={`Attendance calendar for ${studentName}, package ${pkg.number}`}
            width={540}
            height={540}
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-w-md rounded-xl border border-stone-200 bg-[#f7f3ea]"
          />
        </div>
      ) : null}

      <h4 className="mt-5 text-sm font-semibold text-stone-900">Classes</h4>
      {pkg.attendance.length ? (
        <ul className="mt-1 divide-y divide-stone-100">
          {pkg.attendance.map((row) => <AttendanceItem key={row.id} row={row} canRemove={active} studentId={studentId} today={today} />)}
        </ul>
      ) : <p className="mt-1 text-sm text-stone-500">No classes marked yet.</p>}
      {!active ? <p className="mt-2 text-xs text-stone-500">To remove a class from a completed package, reopen it first. Changing a date is always allowed.</p> : null}

      {pkg.completionHistory.length ? (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-stone-900">Earlier completions</h4>
          <ul className="mt-1 grid gap-1 text-sm text-stone-600">
            {pkg.completionHistory.map((entry) => (
              <li key={entry.seq}>
                Completion {entry.seq}, {formatDateTime(entry.completedAt)}
                {entry.reopenedAt ? `. Reopened ${formatDateTime(entry.reopenedAt)}${entry.reopenReason ? `: ${entry.reopenReason}` : ''}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {pkg.status === 'completed' || pkg.notifications.length ? (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-stone-900">WhatsApp messages</h4>
          <div className="mt-2"><NotificationList notifications={pkg.notifications} packageId={pkg.id} studentId={studentId} /></div>
        </div>
      ) : null}

      {pkg.status === 'completed' ? (
        <div className="mt-5 grid gap-3">
          {pkg.amended ? (
            <ActionForm action={sendCorrectedCalendarAction}>
              <input type="hidden" name="packageId" value={pkg.id} />
              <input type="hidden" name="studentId" value={studentId} />
              <SubmitButton className={primaryButtonClass}>Send corrected calendar</SubmitButton>
            </ActionForm>
          ) : null}
          {canReopen ? (
            <details>
              <summary className={summaryClass}>Reopen package</summary>
              <ActionForm action={reopenPackageAction} className="mt-2 grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
                <input type="hidden" name="packageId" value={pkg.id} />
                <input type="hidden" name="studentId" value={studentId} />
                <p className="text-xs leading-5 text-stone-600">Use this when a class was marked by mistake. Messages already sent are not recalled.</p>
                <label className="text-sm font-medium text-stone-800">Reason<input name="reason" required minLength={3} maxLength={200} autoComplete="off" className={inputClass} /></label>
                <div><SubmitButton className={secondaryButtonClass}>Reopen package</SubmitButton></div>
              </ActionForm>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
