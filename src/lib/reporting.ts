export const REPORT_PERIODS = [7, 30, 90] as const
export function reportDays(value: unknown): 7 | 30 | 90 {
  const days = Number(value)
  return days === 7 || days === 90 ? days : 30
}
export function changeLabel(current: number, previous: number): string {
  if (!previous) return current ? 'No previous activity to compare' : 'No change'
  const change = ((current - previous) / previous) * 100
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}% vs previous period`
}
