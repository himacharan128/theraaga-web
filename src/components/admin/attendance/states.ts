/** Shape returned by every attendance Server Action, read by useActionState. */
export type ActionState = {
  ok?: boolean
  message?: string
  fieldErrors?: Record<string, string>
  /** Submitted text values, so a rejected form keeps what was typed. */
  values?: Record<string, string>
}

export type AttendanceAction = (previous: ActionState, formData: FormData) => Promise<ActionState>
