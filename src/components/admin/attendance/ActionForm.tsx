'use client'

import { useActionState, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import type { ActionState, AttendanceAction } from './states'

export function SubmitButton({ children, className, label }: { children: ReactNode; className: string; label?: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} aria-label={label} className={className}>
      {pending ? 'Working…' : children}
    </button>
  )
}

export function Message({ state }: { state: ActionState }) {
  return (
    <p
      aria-live="polite"
      className={`min-h-6 text-sm leading-6 ${state.ok ? 'font-medium text-emerald-800' : 'text-red-800'}`}
    >
      {state.message ?? ''}
    </p>
  )
}

/**
 * A small form around one Server Action. It holds no business logic: the
 * server decides and returns the message that is shown here.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: AttendanceAction
  children: ReactNode
  className?: string
}) {
  const [state, formAction] = useActionState(action, {} as ActionState)
  return (
    <form action={formAction} className={className}>
      {children}
      <Message state={state} />
    </form>
  )
}
