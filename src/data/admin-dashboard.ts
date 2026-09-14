import 'server-only'

import type { Filter } from 'mongodb'
import type { StoredLead } from '@/data/leads'
import { getAdminDb, isAdminDatabaseConfigured } from '@/data/admin-mongo'
import { dayBefore, type DailyMetric } from '@/data/analytics'

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'trial_booked',
  'enrolled',
  'lost',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const ENQUIRIES_PER_PAGE = 25

export type DashboardLead = Pick<
  StoredLead,
  'id' | 'contactName' | 'phone' | 'learner' | 'interest' | 'mode' | 'ageBand' | 'status' | 'submittedAt'
>

export type EnquiryLead = Pick<
  StoredLead,
  | 'id'
  | 'contactName'
  | 'phone'
  | 'learner'
  | 'interest'
  | 'mode'
  | 'ageBand'
  | 'timezone'
  | 'message'
  | 'status'
  | 'submittedAt'
>

export type EnquiryFilters = {
  page: number
  status?: LeadStatus
  mode?: StoredLead['mode']
  learner?: StoredLead['learner']
  interest?: StoredLead['interest']
}

export type AdminEnquiries = {
  leadCounts: CountRow[]
  leads: EnquiryLead[]
  page: number
  total: number
  totalPages: number
}

type CountRow = { label: string; count: number }
type TimelineRow = { day: string; count: number }

export type AdminDashboard = {
  since: string
  until: string
  days: number
  previous: Record<string, number>
  overdueLeads: number
  lastActivity: Date | null
  pageViews: number
  formViews: number
  formStarts: number
  submissions: number
  whatsappClicks: number
  pageViewsByDay: TimelineRow[]
  topPages: CountRow[]
  sources: CountRow[]
  locations: CountRow[]
  devices: CountRow[]
  events: CountRow[]
  leadCounts: CountRow[]
  recentLeads: DashboardLead[]
}

function label(value: unknown, fallback: string): string {
  return typeof value === 'string' && value ? value : fallback
}

async function metricCount(event: string, since: string): Promise<number> {
  const db = await getAdminDb()
  const rows = await db
    .collection<DailyMetric>('analytics_daily')
    .aggregate<{ count: number }>([
      { $match: { day: { $gte: since }, event } },
      { $group: { _id: null, count: { $sum: '$count' } } },
    ])
    .toArray()
  return rows[0]?.count ?? 0
}

export async function getAdminDashboard(days: 7 | 30 | 90 = 30): Promise<AdminDashboard | null> {
  if (!isAdminDatabaseConfigured()) return null

  const since = dayBefore(days - 1)
  const until = dayBefore(0)
  const db = await getAdminDb()
  const analytics = db.collection<DailyMetric>('analytics_daily')
  const leads = db.collection<StoredLead>('leads')
  const metrics = { day: { $gte: since, $lte: until } }
  const [previousRows, overdueLeads, latest] = await Promise.all([
    analytics.aggregate<{ event: string; count: number }>([
      { $match: { day: { $gte: dayBefore(days * 2 - 1), $lt: since } } },
      { $group: { _id: '$event', count: { $sum: '$count' } } },
      { $project: { _id: 0, event: '$_id', count: 1 } },
    ]).toArray(),
    leads.countDocuments({ status: 'new', submittedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() } }),
    analytics.findOne({}, { sort: { updatedAt: -1 }, projection: { updatedAt: 1 } }),
  ])

  const [
    pageViews,
    formViews,
    formStarts,
    submissions,
    whatsappClicks,
    pageViewsByDay,
    topPages,
    sources,
    locations,
    devices,
    events,
    leadCounts,
    recentLeads,
  ] = await Promise.all([
    metricCount('page_view', since),
    metricCount('form_view', since),
    metricCount('form_start', since),
    metricCount('form_submit_success', since),
    metricCount('whatsapp_click', since),
    analytics
      .aggregate<TimelineRow>([
        { $match: { ...metrics, event: 'page_view' } },
        { $group: { _id: '$day', count: { $sum: '$count' } } },
        { $project: { _id: 0, day: '$_id', count: 1 } },
        { $sort: { day: 1 } },
      ])
      .toArray(),
    analytics
      .aggregate<CountRow>([
        { $match: { ...metrics, event: 'page_view' } },
        { $group: { _id: '$path', count: { $sum: '$count' } } },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { count: -1, label: 1 } },
        { $limit: 8 },
      ])
      .toArray(),
    analytics
      .aggregate<CountRow>([
        { $match: { ...metrics, event: 'page_view' } },
        {
          $group: {
            _id: { $ifNull: ['$utmSource', { $ifNull: ['$referrerHost', 'Direct'] }] },
            count: { $sum: '$count' },
          },
        },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { count: -1, label: 1 } },
        { $limit: 8 },
      ])
      .toArray(),
    analytics
      .aggregate<CountRow>([
        { $match: { ...metrics, event: 'page_view' } },
        {
          $group: {
            _id: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ['$city', ''] },
                    { $cond: [{ $ifNull: ['$city', false] }, ', ', ''] },
                    { $ifNull: ['$region', { $ifNull: ['$country', 'Unknown'] }] },
                  ],
                },
              },
            },
            count: { $sum: '$count' },
          },
        },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { count: -1, label: 1 } },
        { $limit: 8 },
      ])
      .toArray(),
    analytics
      .aggregate<CountRow>([
        { $match: { ...metrics, event: 'page_view' } },
        { $group: { _id: '$device', count: { $sum: '$count' } } },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { count: -1, label: 1 } },
      ])
      .toArray(),
    analytics
      .aggregate<CountRow>([
        { $match: metrics },
        { $group: { _id: '$event', count: { $sum: '$count' } } },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { count: -1, label: 1 } },
      ])
      .toArray(),
    leads
      .aggregate<CountRow>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { label: 1 } },
      ])
      .toArray(),
    leads
      .find(
        {},
        {
          projection: {
            id: 1,
            contactName: 1,
            phone: 1,
            learner: 1,
            interest: 1,
            mode: 1,
            ageBand: 1,
            status: 1,
            submittedAt: 1,
          },
        },
      )
      .sort({ submittedAt: -1 })
      .limit(12)
      .toArray() as Promise<DashboardLead[]>,
  ])

  return {
    since,
    until,
    days,
    previous: Object.fromEntries(previousRows.map(row => [row.event, row.count])),
    overdueLeads,
    lastActivity: latest?.updatedAt ?? null,
    pageViews,
    formViews,
    formStarts,
    submissions,
    whatsappClicks,
    pageViewsByDay: Array.from({ length: days }, (_, index) => {
      const day = dayBefore(days - 1 - index)
      return { day, count: pageViewsByDay.find(row => row.day === day)?.count ?? 0 }
    }),
    topPages: topPages.map((row) => ({ ...row, label: label(row.label, '/') })),
    sources: sources.map((row) => ({ ...row, label: label(row.label, 'Direct') })),
    locations: locations.map((row) => ({ ...row, label: label(row.label, 'Unknown') })),
    devices: devices.map((row) => ({ ...row, label: label(row.label, 'Unknown') })),
    events: events.map((row) => ({ ...row, label: label(row.label, 'Unknown') })),
    leadCounts: leadCounts.map((row) => ({ ...row, label: label(row.label, 'new') })),
    recentLeads,
  }
}

export async function getAdminEnquiries(filters: EnquiryFilters): Promise<AdminEnquiries | null> {
  if (!isAdminDatabaseConfigured()) return null

  const db = await getAdminDb()
  const leads = db.collection<StoredLead>('leads')
  const filter: Filter<StoredLead> = {}

  if (filters.status) filter.status = filters.status
  if (filters.mode) filter.mode = filters.mode
  if (filters.learner) filter.learner = filters.learner
  if (filters.interest) filter.interest = filters.interest

  const [total, leadCounts] = await Promise.all([
    leads.countDocuments(filter),
    leads
      .aggregate<CountRow>([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, label: '$_id', count: 1 } },
        { $sort: { label: 1 } },
      ])
      .toArray(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / ENQUIRIES_PER_PAGE))
  const page = Math.min(Math.max(1, filters.page), totalPages)
  const leadsForPage = (await leads
    .find(filter, {
      projection: {
        id: 1,
        contactName: 1,
        phone: 1,
        learner: 1,
        interest: 1,
        mode: 1,
        ageBand: 1,
        timezone: 1,
        message: 1,
        status: 1,
        submittedAt: 1,
      },
    })
    .sort({ submittedAt: -1 })
    .skip((page - 1) * ENQUIRIES_PER_PAGE)
    .limit(ENQUIRIES_PER_PAGE)
    .toArray()) as EnquiryLead[]

  return { leadCounts, leads: leadsForPage, page, total, totalPages }
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const db = await getAdminDb()
  await db.collection<StoredLead>('leads').updateOne({ id }, { $set: { status } })
}
