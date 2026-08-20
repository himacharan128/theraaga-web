import { Suspense } from 'react'
import { connection } from 'next/server'
import { getAdminDashboard, LEAD_STATUSES } from '@/data/admin-dashboard'
import { requireAdmin } from '@/lib/admin-auth'
import { logoutAdmin, updateLeadStatus } from './actions'

const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  new: 'New',
  contacted: 'Contacted',
  trial_booked: 'Trial booked',
  enrolled: 'Enrolled',
  lost: 'Closed',
}

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

async function AdminDashboardContent() {
  // Explicit request-time boundary: authentication and operational data must
  // never enter a shared prerendered shell or cache entry.
  await connection()
  const session = await requireAdmin()
  const dashboard = await getAdminDashboard()

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
    ['Page views', dashboard.pageViews, 'Anonymous page loads'],
    ['Form views', dashboard.formViews, 'Visitors who saw an enquiry form'],
    ['Form starts', dashboard.formStarts, 'Visitors who began a form'],
    ['Trial requests', dashboard.submissions, 'Saved enquiry forms'],
    ['WhatsApp clicks', dashboard.whatsappClicks, 'Direct conversation intent'],
  ] as const

  return (
    <div className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-stone-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6a15]">
              RAAGA operations · private
            </p>
            <h1 className="mt-2 text-4xl font-light tracking-tight">School dashboard</h1>
            <p className="mt-2 text-sm text-stone-600">
              Last 30 days from {dashboard.since}. All traffic data is anonymous and aggregated.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500">Signed in as {session.username}</span>
            <form action={logoutAdmin}>
              <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map(([title, value, help]) => (
            <article key={title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">{title}</p>
              <p className="mt-3 text-4xl font-light tabular-nums">{stat(value)}</p>
              <p className="mt-2 text-xs leading-5 text-stone-500">{help}</p>
            </article>
          ))}
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-[var(--font-ui)] text-sm font-semibold">Daily page views</h2>
            {dashboard.pageViewsByDay.length ? (
              <div className="mt-5 flex h-40 items-end gap-1.5" aria-label="Daily page view chart">
                {dashboard.pageViewsByDay.map((row) => {
                  const max = Math.max(...dashboard.pageViewsByDay.map((entry) => entry.count), 1)
                  const height = Math.max(5, (row.count / max) * 100)
                  return (
                    <div key={row.day} className="group relative flex h-full flex-1 items-end" title={`${row.day}: ${row.count} page views`}>
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
          </div>
          <MetricList
            title="Engagement events"
            rows={dashboard.events.map((row) => ({ ...row, label: friendlyEvent(row.label) }))}
            empty="Events will appear here after visitors use the site."
          />
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricList title="Top landing pages" rows={dashboard.topPages} empty="No landing-page visits yet." />
          <MetricList title="Traffic sources" rows={dashboard.sources} empty="No traffic sources yet." />
          <MetricList title="Approximate locations" rows={dashboard.locations} empty="Location aggregates are available on Vercel-hosted traffic." />
          <MetricList title="Devices" rows={dashboard.devices} empty="No device aggregates yet." />
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6a15]">Enquiries</p>
              <h2 className="mt-1 text-3xl font-light">Recent adult contacts</h2>
            </div>
            {dashboard.leadCounts.length > 0 && (
              <p className="text-sm text-stone-500">
                {dashboard.leadCounts
                  .map((row) => `${LEAD_STATUS_LABELS[row.label as keyof typeof LEAD_STATUS_LABELS] ?? row.label}: ${row.count}`)
                  .join(' · ')}
              </p>
            )}
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
            {dashboard.recentLeads.length ? (
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
                      <td className="px-5 py-4">
                        <p className="font-medium text-stone-900">{lead.contactName}</p>
                        <a className="text-stone-600 hover:text-[#6b1f2a]" href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer">
                          +91 {lead.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-stone-600">
                        <p>{lead.learner === 'my_child' ? 'For a child' : 'For myself'} · {lead.ageBand.replace('_', '–')}</p>
                        <p className="mt-1 capitalize">{lead.mode.replace('-', ' ')}</p>
                      </td>
                      <td className="px-5 py-4 text-stone-600">{formatDate(lead.submittedAt)}</td>
                      <td className="px-5 py-4">
                        <form action={updateLeadStatus} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={lead.id} />
                          <select name="status" defaultValue={lead.status} className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm">
                            {LEAD_STATUSES.map((status) => (
                              <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>
                            ))}
                          </select>
                          <button className="rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-400">Save</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-sm text-stone-500">No enquiries are available in the admin database yet.</p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#8c6a15]/25 bg-[#8c6a15]/5 p-5">
          <p className="font-[var(--font-ui)] text-sm font-semibold text-stone-900">Search visibility</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
            Search Console is verified and the sitemap has been submitted. Connect a Google Search Console OAuth credential in a later release to show clicks, impressions, queries, and indexed URLs here. This dashboard does not use Google Analytics or advertising pixels.
          </p>
        </section>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <AdminDashboardContent />
    </Suspense>
  )
}
