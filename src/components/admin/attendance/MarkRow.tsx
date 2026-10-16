import Link from 'next/link'
import { LEARNING_PLACE_LABELS, type LearningPlace } from '@/lib/attendance-rules'
import { markAttendanceAction } from '@/app/admin/students/actions'
import type { StudentRow } from '@/data/attendance-queries'
import { ActionForm, SubmitButton } from './ActionForm'
import { formatClassDate } from './format'
import { ProgressPill, primaryButtonClass } from './Parts'

/** One student on the phone attendance screen. */
export function MarkRow({ student, date, today }: { student: StudentRow; date: string; today: string }) {
  const active = student.activePackage
  const marked = date === today && active?.markedToday
  const day = formatClassDate(date)
  return (
    <li className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/admin/students/${student.id}`} className="block break-words text-lg font-semibold text-stone-900 hover:text-[#6b1f2a]">
            {student.name}
          </Link>
          <p className="mt-0.5 text-xs text-stone-500">
            {LEARNING_PLACE_LABELS[student.place as LearningPlace] ?? student.place}
            {student.batch ? ` · ${student.batch}` : ''}
            {active?.lastClassDate ? ` · Last class ${formatClassDate(active.lastClassDate)}` : ''}
          </p>
        </div>
        {active ? <ProgressPill attended={active.attended} target={active.target} /> : <span className="text-xs text-stone-500">No package</span>}
      </div>
      {marked ? (
        <p className="mt-3 flex min-h-12 items-center rounded-xl bg-emerald-50 px-4 text-base font-semibold text-emerald-900">
          Marked for {day}
        </p>
      ) : (
        <ActionForm action={markAttendanceAction} className="mt-3">
          <input type="hidden" name="studentId" value={student.id} />
          <input type="hidden" name="classDate" value={date} />
          {active ? null : <input type="hidden" name="startIfNeeded" value="1" />}
          <SubmitButton className={`${primaryButtonClass} w-full`} label={`${active ? 'Mark' : 'Start new package and mark'} ${student.name} attended on ${day}`}>
            {active ? 'Mark attended' : 'Start new package and mark'}
          </SubmitButton>
        </ActionForm>
      )}
    </li>
  )
}
