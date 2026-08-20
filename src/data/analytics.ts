import 'server-only'

import { getAdminDb, isAdminDatabaseConfigured } from '@/data/admin-mongo'

export type AggregateTelemetry = {
  event: string
  path: string
  label?: string
  device: 'mobile' | 'tablet' | 'desktop'
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrerHost?: string
  country?: string
  region?: string
  city?: string
}

export type DailyMetric = AggregateTelemetry & {
  key: string
  day: string
  count: number
  createdAt: Date
  updatedAt: Date
  retentionUntil: Date
}

let analyticsIndexesPromise: Promise<void> | undefined

function indiaDay(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

function metricKey(day: string, metric: AggregateTelemetry): string {
  // The key creates a bounded daily roll-up. It is never derived from an IP,
  // cookie, user agent, or personal detail.
  return [
    'v1',
    day,
    metric.event,
    metric.path,
    metric.label ?? '',
    metric.device,
    metric.utmSource ?? '',
    metric.utmMedium ?? '',
    metric.utmCampaign ?? '',
    metric.referrerHost ?? '',
    metric.country ?? '',
    metric.region ?? '',
    metric.city ?? '',
  ].join('\u001f')
}

async function ensureIndexes() {
  if (!analyticsIndexesPromise) {
    analyticsIndexesPromise = (async () => {
      const db = await getAdminDb()
      await Promise.all([
        db.collection<DailyMetric>('analytics_daily').createIndex({ key: 1 }, { unique: true }),
        db.collection<DailyMetric>('analytics_daily').createIndex({ day: -1, event: 1 }),
        db.collection<DailyMetric>('analytics_daily').createIndex(
          { retentionUntil: 1 },
          { expireAfterSeconds: 0 },
        ),
      ])
    })()
  }
  return analyticsIndexesPromise
}

export async function recordAggregateTelemetry(metric: AggregateTelemetry): Promise<void> {
  if (!isAdminDatabaseConfigured()) return

  await ensureIndexes()
  const now = new Date()
  const day = indiaDay(now)
  const key = metricKey(day, metric)
  const retentionUntil = new Date(now)
  retentionUntil.setMonth(retentionUntil.getMonth() + 24)
  const db = await getAdminDb()

  await db.collection<DailyMetric>('analytics_daily').updateOne(
    { key },
    {
      $setOnInsert: { ...metric, key, day, createdAt: now, retentionUntil },
      $set: { updatedAt: now },
      $inc: { count: 1 },
    },
    { upsert: true },
  )
}

export function dayBefore(daysAgo: number, now = new Date()): string {
  const prior = new Date(now)
  prior.setDate(prior.getDate() - daysAgo)
  return indiaDay(prior)
}
