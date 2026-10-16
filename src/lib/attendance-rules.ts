import { z } from 'zod'

/**
 * Business rules for student attendance and eight-class packages. Pure: no
 * database, no server-only import, so the browser form, the Server Actions
 * and the test scripts all parse with the same schema.
 *
 * DPDP NOTE: read before adding a field.
 * This is an internal record of ENROLLED students, which the privacy policy
 * already describes ("a child's own details are taken at enrolment"). Keep it
 * minimal anyway:
 *   · `name` is the name the school uses for the student. A first name is
 *     enough. It appears on the calendar image.
 *   · Never a date of birth, school, address or photograph. `isMinor` is the
 *     only age signal.
 *   · `contactName` and `whatsapp` belong to an ADULT. For a minor that is the
 *     parent or guardian: the safeguarding page promises that no teacher
 *     messages a student under eighteen directly.
 *   · `whatsappConsent` records that the adult agreed to class updates on
 *     WhatsApp. Without it, the student-side message is never sent.
 */

export const PACKAGE_TARGET = 8
export const EARLIEST_CLASS_DATE = '2016-01-01'
export const SCHOOL_TIME_ZONE = 'Asia/Kolkata'

export const STUDENT_STATUSES = ['active', 'inactive'] as const
export type StudentStatus = (typeof STUDENT_STATUSES)[number]

export const LEARNING_PLACES = ['jubilee-hills', 'phoenix-arena', 'online', 'clubhouse'] as const
export type LearningPlace = (typeof LEARNING_PLACES)[number]

export const LEARNING_PLACE_LABELS: Record<LearningPlace, string> = {
  'jubilee-hills': 'Jubilee Hills',
  'phoenix-arena': 'Phoenix Arena',
  online: 'Online',
  clubhouse: 'Clubhouse',
}

export const PACKAGE_STATUSES = ['active', 'completed'] as const
export type PackageStatus = (typeof PACKAGE_STATUSES)[number]

/**
 * Notification lifecycle. Only `pending` is picked up automatically.
 *   held       recorded, not sent automatically (WhatsApp not connected, a
 *              re-completion, or a corrected calendar): an admin sends it.
 *   skipped    never sent: no WhatsApp consent recorded for this student.
 *   pending    queued; sent when nextAttemptAt passes.
 *   sending    claimed by one worker until leaseUntil.
 *   accepted   WhatsApp returned a message id. Webhooks then move it on.
 *   uncertain  the send request failed in a way that may still have reached
 *              WhatsApp (timeout, 5xx). Never re-sent automatically.
 *   failed     WhatsApp refused it, or retries ran out.
 */
export const NOTIFICATION_STATUSES = [
  'held',
  'skipped',
  'pending',
  'sending',
  'accepted',
  'sent',
  'delivered',
  'read',
  'uncertain',
  'failed',
] as const
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number]

export const NOTIFICATION_RECIPIENTS = ['student', 'school'] as const
export type NotificationRecipient = (typeof NOTIFICATION_RECIPIENTS)[number]

/** Ids are random UUIDs generated server-side. */
export const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Today's date at the school, as YYYY-MM-DD. */
export function todayAtSchool(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHOOL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-30). */
export function isCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

/** A class date: a real date, not in the future at the school, not before 2016. */
export function classDateSchema(now: Date = new Date()) {
  return z
    .string()
    .trim()
    .refine(isCalendarDate, 'Choose a valid date.')
    .refine((value) => value >= EARLIEST_CLASS_DATE, 'That date is too far in the past.')
    .refine((value) => value <= todayAtSchool(now), 'A class cannot be marked for a future date.')
}

/**
 * WhatsApp numbers are stored as E.164 digits WITHOUT the plus sign, the form
 * the Cloud API takes in `to`. A bare 10-digit number starting 6 to 9 is an
 * Indian mobile and gains 91. Anything else must carry its country code with
 * a leading + (online students abroad).
 */
export function normaliseWhatsApp(input: string): string | null {
  const compact = input.trim().replace(/[\s().-]/g, '')
  if (/^[6-9]\d{9}$/.test(compact)) return `91${compact}`
  if (/^0[6-9]\d{9}$/.test(compact)) return `91${compact.slice(1)}`
  const international = compact.match(/^(?:\+|00)(\d{8,15})$/)
  if (!international) return null
  const digits = international[1]
  if (digits.startsWith('91') && !/^91[6-9]\d{9}$/.test(digits)) return null
  return digits
}

/** "919848012345" → "+91 98480 12345"; other countries → "+<digits>". */
export function formatWhatsApp(digits: string): string {
  if (/^91\d{10}$/.test(digits)) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  return `+${digits}`
}

/** Lower-cased, single-spaced name used for duplicate detection and search. */
export function nameKey(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-IN')
}

/*
 * Names are rendered into the calendar PNG by next/og, which only carries a
 * Latin font. Latin letters with accents are fine; other scripts would render
 * as empty boxes on the image the parent receives, so they are refused here.
 */
const PERSON_NAME = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ\s.'-]*$/

const personName = (label: string) =>
  z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, `${label} needs at least two letters.`)
        .max(60, `${label} must be 60 characters or fewer.`)
        .regex(PERSON_NAME, 'Use English letters, spaces, full stops, hyphens and apostrophes.'),
    )

const checkbox = z
  .union([z.literal('on'), z.literal('true'), z.boolean(), z.undefined(), z.null(), z.literal('')])
  .transform((value) => value === true || value === 'on' || value === 'true')

export const studentInputSchema = z
  .object({
    name: personName('The student’s name'),
    isMinor: checkbox,
    contactName: personName('The contact’s name'),
    whatsapp: z
      .string()
      .transform((value, ctx) => {
        const normalised = normaliseWhatsApp(value)
        if (!normalised) {
          ctx.addIssue({
            code: 'custom',
            message: 'Enter a 10-digit Indian mobile, or + and the country code for other countries.',
          })
          return z.NEVER
        }
        return normalised
      }),
    whatsappConsent: checkbox,
    place: z.enum(LEARNING_PLACES),
    batch: z
      .string()
      .trim()
      .max(60, 'Keep the batch note to 60 characters.')
      .regex(/^[\p{L}\p{N}\s.,:'&/()-]*$/u, 'Letters, numbers and simple punctuation only.')
      .optional()
      .transform((value) => value || undefined),
  })
  .strict()

export type StudentInput = z.output<typeof studentInputSchema>

export const reasonSchema = z
  .string()
  .trim()
  .min(3, 'Add a short reason so the change can be understood later.')
  .max(200, 'Keep the reason to 200 characters.')

/** Progress shown on every package. Derived from attended records only. */
export function packageProgress(attended: number, target: number = PACKAGE_TARGET) {
  const done = Math.min(Math.max(attended, 0), target)
  return { done, target, remaining: target - done, label: `${done}/${target}` }
}

/**
 * Automatic retry schedule for a `pending` notification after a retryable
 * failure (rate limit, media upload error, WhatsApp briefly unavailable
 * before a send was attempted). After the last step, or once the completion
 * is older than AUTO_SEND_WINDOW_MS, the row becomes `failed` and waits for a
 * person.
 */
export const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 3_600_000, 12 * 3_600_000]
export const AUTO_SEND_WINDOW_MS = 72 * 3_600_000
export const SEND_LEASE_MS = 90_000
