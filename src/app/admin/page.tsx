import { Suspense } from 'react'
import { connection } from 'next/server'
import { getAdminDashboard, LEAD_STATUSES, type DashboardLead } from '@/data/admin-dashboard'
import { requireAdmin } from '@/lib/admin-auth'
import { logoutAdmin } from './actions'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AiReferralReport } from '@/components/admin/AiReferralReport'
import { AGE_LABELS, LEAD_STATUS_LABELS, LeadContact, LeadStatusForm } from '@/components/admin/LeadParts'
import { REPORT_PERIODS, reportDays, changeLabel } from '@/lib/reporting'

function stat(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

function friendlyEvent(value: string): string {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function LeadRequest({ lead }: { lead: DashboardLead }) {
  return (
    <>
      <p>{lead.learner === 'my_child' ? 'For a child' : 'For myself'} · {AGE_LABELS[lead.ageBand]}</p>
      <p className="mt-1 capitalize">{lead.mode.replace('-', ' ')}</p>
    </>
  )
}

function MetricList({
  title,
  rows,
  empty,
}: {
  title: string
  rows: { label: string; count: number }[]
  empty: string
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="font-[var(--font-ui)] text-sm font-semibold text-stone-900">{title}</h2>
      {rows.length ? (
        <ol className="mt-4 divide-y divide-stone-100">
          {rows.map((row) => (
            <li key={row.label} className="flex items-start justify-between gap-4 py-3 text-sm">
              <span className="break-all text-stone-600">{row.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-stone-900">{stat(row.count)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm leading-6 text-stone-500">{empty}</p>
      )}
    </section>
  )
}

function LoadingDashboard() {
  return <section className="min-h-dvh bg-stone-100" aria-label="Loading admin dashboard" />
}

async function AdminDashboardContent({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  // Explicit request-time boundary: authentication and operational data must
  // never enter a shared prerendered shell or cache entry.
  await connection()
  const session = await requireAdmin()
  const days = reportDays((await searchParams).days)
  const dashboard = await getAdminDashboard(days)

  if (!dashboard) {
    return (
      <section className="min-h-dvh bg-stone-100 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-stone-800">
          <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6a15]">
            RAAGA operations
          </p>
          <h1 className="mt-3 text-3xl font-light">Connect the admin database</h1>
          <p className="mt-4 leading-7 text-stone-600">
            Sign-in is working, but the dashboard database has not been connected yet.
            Add the separate <code>MONGODB_ADMIN_URI</code> server environment variable
            in Vercel, then redeploy. Do not reuse the public enquiry write-only account.
          </p>
          <form action={logoutAdmin} className="mt-8">
            <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">
              Sign out
            </button>
          </form>
        </div>
      </section>
    )
  }

  const cards = [
    ['Page views', dashboard.pageViews, 'Page loads, not unique people', 'page_view'],
    ['Form views', dashboard.formViews, 'Times the enquiry form was shown', 'form_view'],
    ['Form starts', dashboard.formStarts, 'Recorded form starts', 'form_start'],
    ['Form completions', dashboard.submissions, 'Recorded successful submissions', 'form_submit_success'],
    ['WhatsApp clicks', dashboard.whatsappClicks, 'Clicks, not confirmed conversations', 'whatsapp_click'],
  ] as const

  return (
    <div className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          current="overview"
          title="Your school at a glance"
          description={`${dashboard.since} to ${dashboard.until} · India time · Includes today`}
          username={session.username}
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-stone-500">{dashboard.lastActivity ? `Last recorded activity: ${formatDate(dashboard.lastActivity.toISOString())}` : 'No activity recorded. Check collection setup before concluding there are no visitors.'}</p>
          <nav aria-label="Reporting period" className="flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
            {REPORT_PERIODS.map(period => <a key={period} href={`/admin?days=${period}`} aria-current={period === days ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === days ? 'bg-[#6b1f2a] text-white' : 'text-stone-600'}`}>{period} days</a>)}
          </nav>
        </div>
        {dashboard.overdueLeads > 0 && <a href="/admin/enquiries?status=new" className="mt-5 block rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><strong>{dashboard.overdueLeads} {dashboard.overdueLeads === 1 ? 'enquiry needs' : 'enquiries need'} attention.</strong> {dashboard.overdueLeads === 1 ? 'This contact has' : 'These contacts have'} remained New for more than 48 hours. Open the enquiry queue →</a>}

        <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map(([title, value, help, event]) => (
            <article key={title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">{title}</p>
              <p className="mt-3 text-4xl font-light tabular-nums">{stat(value)}</p>
              <p className="mt-2 text-xs leading-5 text-stone-500">{help}</p>
              <p className="mt-3 border-t border-stone-100 pt-3 text-xs text-stone-600">{changeLabel(value, dashboard.previous[event] ?? 0)}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-5"><h2>Enquiry pipeline</h2><p className="mt-2 text-xs text-stone-500">All saved enquiries, across all dates. Status is maintained by the school team.</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">{LEAD_STATUSES.map(status => <a key={status} href={`/admin/enquiries?status=${status}`} className="rounded-xl bg-stone-50 p-3 hover:bg-stone-100"><span className="block text-xs text-stone-500">{LEAD_STATUS_LABELS[status]}</span><strong className="mt-2 block text-2xl tabular-nums">{dashboard.leadCounts.find(row => row.label === status)?.count ?? 0}</strong></a>)}</div></div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5"><h2>Enquiry activity</h2><p className="mt-2 text-xs text-stone-500">Aggregate event ratios for the selected period. Events cannot be joined to individual people.</p><dl className="mt-5 space-y-3">{[
            ['Completions per 100 form starts', dashboard.submissions, dashboard.formStarts],
            ['WhatsApp clicks per 100 page views', dashboard.whatsappClicks, dashboard.pageViews],
          ].map(([label, numerator, denominator]) => <div key={label} className="flex justify-between gap-4 border-b border-stone-100 pb-3"><dt className="text-sm text-stone-600">{label}</dt><dd className="font-semibold tabular-nums">{Number(denominator) ? ((Number(numerator) / Number(denominator)) * 100).toFixed(1) : 'n/a'}</dd></div>)}</dl><p className="mt-4 text-xs text-stone-500">Repeat actions can produce ratios above 100. Missing or blocked telemetry can undercount activity.</p></div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-[var(--font-ui)] text-sm font-semibold">Daily page views</h2>
            {dashboard.pageViews > 0 ? (
              <div className="mt-5 flex h-40 items-end gap-1.5" aria-label="Daily page view chart">
                {dashboard.pageViewsByDay.map((row) => {
                  const max = Math.max(...dashboard.pageViewsByDay.map((entry) => entry.count), 1)
                  const height = (row.count / max) * 100
                  return (
                    <div key={row.day} tabIndex={0} aria-label={`${row.day}: ${row.count} page views`} className="group relative flex h-full flex-1 items-end" title={`${row.day}: ${row.count} page views`}>
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-stone-900 px-2 py-1 text-xs text-white group-hover:block group-focus:block">{row.day}: {row.count}</span>
                      <div className="w-full rounded-t bg-[#6b1f2a] transition-opacity group-hover:opacity-75" style={{ height: `${height}%` }} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-stone-500">
                No traffic data yet. Counts begin after the telemetry environment is connected and the new deployment receives visits.
              </p>
            )}
            <div className="mt-3 flex justify-between text-xs text-stone-500"><span>{dashboard.since}</span><span>{dashboard.until}</span></div>
          </div>
          <MetricList
            title="Engagement events"
            rows={dashboard.events.map((row) => ({ ...row, label: friendlyEvent(row.label) }))}
            empty="Events will appear here after visitors use the site."
          />
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricList title="Most viewed pages" rows={dashboard.topPages} empty="No page views recorded." />
          <MetricList title="Reported traffic sources" rows={dashboard.sources} empty="No traffic sources yet." />
          <MetricList title="Approximate locations" rows={dashboard.locations} empty="Location aggregates are available on Vercel-hosted traffic." />
          <MetricList title="Devices" rows={dashboard.devices} empty="No device aggregates yet." />
        </section>

        <AiReferralReport report={dashboard.aiReferrals} />

        <section className="mt-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6a15]">Enquiries</p>
              <h2 className="mt-1 text-3xl font-light">Recent adult contacts</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {dashboard.leadCounts.length > 0 && (
                <p className="text-sm text-stone-500">
                  {dashboard.leadCounts
                    .map((row) => `${LEAD_STATUS_LABELS[row.label as keyof typeof LEAD_STATUS_LABELS] ?? row.label}: ${row.count}`)
                    .join(' · ')}
                </p>
              )}
              <a href="/admin/enquiries" className="font-[var(--font-ui)] text-sm font-semibold text-[#6b1f2a] hover:text-[#5c1a20]">
                View all enquiries
              </a>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white shadow-sm">
            {dashboard.recentLeads.length ? (
              <>
                {/* Phones get a stacked card per lead; the 760px table needed a sideways swipe. */}
                <ul className="divide-y divide-stone-100 md:hidden">
                  {dashboard.recentLeads.map((lead) => (
                    <li key={lead.id} className="grid gap-3 p-4 text-sm">
                      <div><LeadContact name={lead.contactName} phone={lead.phone} /></div>
                      <div className="text-stone-600"><LeadRequest lead={lead} /></div>
                      <p className="text-xs text-stone-500">Received {formatDate(lead.submittedAt)}</p>
                      <LeadStatusForm id={lead.id} name={lead.contactName} status={lead.status} />
                    </li>
                  ))}
                </ul>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="bg-stone-50 text-xs uppercase tracking-[0.08em] text-stone-500">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Contact</th>
                        <th className="px-5 py-3 font-semibold">Learning request</th>
                        <th className="px-5 py-3 font-semibold">Received</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {dashboard.recentLeads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-5 py-4"><LeadContact name={lead.contactName} phone={lead.phone} /></td>
                          <td className="px-5 py-4 text-stone-600"><LeadRequest lead={lead} /></td>
                          <td className="px-5 py-4 text-stone-600">{formatDate(lead.submittedAt)}</td>
                          <td className="px-5 py-4"><LeadStatusForm id={lead.id} name={lead.contactName} status={lead.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="p-6 text-sm text-stone-500">No enquiries are available in the admin database yet.</p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#8c6a15]/25 bg-[#8c6a15]/5 p-5">
          <p className="font-[var(--font-ui)] text-sm font-semibold text-stone-900">Search visibility</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
            Review Google clicks, impressions and queries in Search Console. Connection status and report freshness appear there. Traffic counts above are aggregate events; they do not identify unique visitors or establish a person-by-person conversion funnel.
          </p>
          <a href="/admin/search-console" className="mt-4 inline-block font-[var(--font-ui)] text-sm font-semibold text-[#6b1f2a] hover:text-[#5c1a20]">Open Search Console reporting</a>
        </section>
      </div>
    </div>
  )
}

export default function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <AdminDashboardContent searchParams={searchParams} />
    </Suspense>
  )
}
