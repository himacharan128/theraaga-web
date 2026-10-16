'use client'

import { useActionState, useState } from 'react'
import { LEARNING_PLACES, LEARNING_PLACE_LABELS } from '@/lib/attendance-rules'
import { Message, SubmitButton } from './ActionForm'
import { inputClass, primaryButtonClass } from './Parts'
import type { ActionState, AttendanceAction } from './states'

export type StudentDefaults = {
  name: string
  contactName: string
  whatsapp: string
  place: string
  batch: string
  isMinor: boolean
  whatsappConsent: boolean
}

export const EMPTY_STUDENT: StudentDefaults = {
  name: '',
  contactName: '',
  whatsapp: '',
  place: 'jubilee-hills',
  batch: '',
  isMinor: false,
  whatsappConsent: false,
}

function FieldError({ state, name }: { state: ActionState; name: string }) {
  const text = state.fieldErrors?.[name]
  return text ? <span className="mt-1 block text-sm text-red-800">{text}</span> : null
}

export function StudentForm({
  action,
  defaults = EMPTY_STUDENT,
  studentId,
  submitLabel,
}: {
  action: AttendanceAction
  defaults?: StudentDefaults
  studentId?: string
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, {} as ActionState)
  // Controlled, so a rejected submit (React resets uncontrolled fields) keeps what was typed.
  const [values, setValues] = useState(defaults)
  const set = <K extends keyof StudentDefaults>(key: K, value: StudentDefaults[K]) => setValues((current) => ({ ...current, [key]: value }))
  const label = 'block text-sm font-medium text-stone-800'
  const help = 'mt-1 block text-xs leading-5 text-stone-500'

  return (
    <form action={formAction} className="grid gap-5">
      {studentId ? <input type="hidden" name="id" value={studentId} /> : null}
      <label className={label}>
        Student name
        <input name="name" required maxLength={60} autoComplete="off" className={inputClass} value={values.name} onChange={(event) => set('name', event.target.value)} />
        <span className={help}>The name RAAGA uses in class. A first name is enough. It appears on the completion calendar.</span>
        <FieldError state={state} name="name" />
      </label>

      <label className="flex min-h-12 items-start gap-3 text-sm font-medium text-stone-800">
        <input type="checkbox" name="isMinor" className="mt-1 size-5 shrink-0 accent-[#6b1f2a]" checked={values.isMinor} onChange={(event) => set('isMinor', event.target.checked)} />
        <span>
          The student is under 18
          <span className={help}>For a student under 18, enter the parent or guardian. RAAGA never messages a child directly.</span>
        </span>
      </label>

      <label className={label}>
        {values.isMinor ? 'Parent or guardian’s name' : 'Contact name'}
        <input name="contactName" required maxLength={60} autoComplete="off" className={inputClass} value={values.contactName} onChange={(event) => set('contactName', event.target.value)} />
        <FieldError state={state} name="contactName" />
      </label>

      <label className={label}>
        {values.isMinor ? 'Parent or guardian’s WhatsApp' : 'WhatsApp number'}
        <input name="whatsapp" required inputMode="tel" autoComplete="off" className={inputClass} value={values.whatsapp} onChange={(event) => set('whatsapp', event.target.value)} />
        <span className={help}>A 10-digit Indian mobile, or + and the country code.</span>
        <FieldError state={state} name="whatsapp" />
      </label>

      <label className="flex min-h-12 items-start gap-3 text-sm font-medium text-stone-800">
        <input type="checkbox" name="whatsappConsent" className="mt-1 size-5 shrink-0 accent-[#6b1f2a]" checked={values.whatsappConsent} onChange={(event) => set('whatsappConsent', event.target.checked)} />
        <span>The adult named here agreed to receive class updates from RAAGA on WhatsApp</span>
      </label>

      <label className={label}>
        Where they learn
        <select name="place" className={inputClass} value={values.place} onChange={(event) => set('place', event.target.value)}>
          {LEARNING_PLACES.map((place) => <option key={place} value={place}>{LEARNING_PLACE_LABELS[place]}</option>)}
        </select>
        <FieldError state={state} name="place" />
      </label>

      <label className={label}>
        Batch note (optional)
        <input name="batch" maxLength={60} autoComplete="off" className={inputClass} value={values.batch} onChange={(event) => set('batch', event.target.value)} />
        <span className={help}>For example, Saturday 5 pm.</span>
        <FieldError state={state} name="batch" />
      </label>

      <div>
        <SubmitButton className={`${primaryButtonClass} w-full sm:w-auto`}>{submitLabel}</SubmitButton>
        <Message state={state} />
      </div>
    </form>
  )
}
