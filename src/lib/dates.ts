/**
 * "2026-09" → "September 2026".
 *
 * An ISO month parses as UTC; format in UTC so it cannot slip a month with the
 * viewer's timezone.
 */
export function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
