import { Suspense } from 'react'
import { connection } from 'next/server'
import {
  getPrimarySearchConsoleReport,
  isSearchReportStale,
  isSearchConsoleReady,
  listSearchConsoleConnections,
} from '@/data/search-console'
import { requireAdmin } from '@/lib/admin-auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { changeLabel } from '@/lib/reporting'
import {
  choosePrimarySearchConsoleConnection,
  chooseSearchConsoleSite,
  removeSearchConsoleConnection,
  syncSearchConsole,
} from './actions'

function stat(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(value)
}

function percent(value: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'percent', maximumFractionDigits: 1 }).format(value)
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(value)
}

function shortPage(value: string): string {
  try {
    const url = new URL(value)
    return `${url.pathname || '/'}${url.search}`
  } catch {
    return value
  }
}

function Notice({ value }: { value?: string }) {
  const copy: Record<string, string> = {
    'configuration-needed': 'Google connection is not configured on the server yet. Add the OAuth credentials and encryption key, then return here.',
    'connection-cancelled': 'Google connection was cancelled before it completed.',
    'connection-expired': 'The secure connection link expired. Start the connection again.',
    'connection-complete': 'Google Search Console account connected and initial data refresh requested.',
    'connection-failed': 'Google connection could not be completed. Check the authorised redirect URL and account permission, then try again.',
  }
  const message = value ? copy[value] : undefined
  return message ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-stone-700">{message}</p> : null
}

function LoadingSearchConsole() {
  return <main className="min-h-dvh bg-stone-100" aria-label="Loading Search Console" />
}

async function SearchConsoleContent({ searchParams }: { searchParams: Promise<{ notice?: string | string[] }> }) {
  await connection()
  const session = await requireAdmin()
  const { notice } = await searchParams
  const results = await Promise.allSettled([listSearchConsoleConnections(), getPrimarySearchConsoleReport()])
  const connections = results[0].status === 'fulfilled' ? results[0].value : []
  const report = results[1].status === 'fulfilled' ? results[1].value : null
  const unavailable = results.some(result => result.status === 'rejected')
  const noticeValue = typeof notice === 'string' ? notice : undefined
  const configured = isSearchConsoleReady()

  return (
    <main className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          current="search-console"
          title="Search visibility"
          description="Private Google Search Console reporting. It measures search performance without adding a Google Analytics tracker to the public site."
          username={session.username}
        />
        <Notice value={noticeValue} />
        {unavailable && <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">Search data could not be loaded. Check the database connection and permissions, then try again. This is not a zero-traffic report.</p>}
        {report && isSearchReportStale(report.fetchedAt) && <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">This report has not refreshed in over 48 hours. Use Refresh now and check the account connection if it fails.</p>}

        <section className="mt-7 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6a15]">Google connections</p>
              <h2 className="mt-1 text-3xl font-light">Search Console accounts</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                Your selected Google property supplies this report. Connect an authorised account to see how people find your school.
              </p>
            </div>
            {configured ? (
              <a href="/api/admin/search-console/connect" className="inline-flex w-fit items-center justify-center rounded-xl bg-[#6b1f2a] px-4 py-2.5 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#5c1a20]">
                Connect Google account
              </a>
            ) : (
              <span className="rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-500">Connection setup required</span>
            )}
          </div>

          {!configured && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-stone-700">
              <p className="font-semibold text-stone-900">One-time server setup remains</p>
              <p className="mt-1">Create a Google Cloud OAuth web client, add this exact redirect URI, and add the four server variables in Vercel: Google client ID, Google client secret, token-encryption key, and cron secret.</p>
              <code className="mt-3 block break-all rounded-lg bg-white px-3 py-2 text-xs text-stone-800">https://admin.theraaga.in/api/admin/search-console/callback</code>
            </div>
          )}

          {connections.length ? (
            <ul className="mt-5 divide-y divide-stone-100 border-t border-stone-100">
              {connections.map((item) => (
                <li key={item.id} className="py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-stone-900">{item.accountEmail ?? 'Connected Google account'}</p>
                        {item.isPrimary && <span className="rounded-full bg-[#6b1f2a]/10 px-2.5 py-1 font-[var(--font-ui)] text-xs font-semibold text-[#6b1f2a]">Dashboard source</span>}
                      </div>
                      <p className="mt-1 text-sm text-stone-600">Connected by {item.connectedBy} · {formatDate(item.connectedAt)}</p>
                      {item.lastSyncedAt && <p className="mt-1 text-sm text-stone-600">Last refresh: {formatDate(item.lastSyncedAt)}</p>}
                      {item.lastSyncError && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b1f2a]">Refresh needs attention: {item.lastSyncError}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!item.isPrimary && (
                        <form action={choosePrimarySearchConsoleConnection}>
                          <input type="hidden" name="id" value={item.id} />
                          <button className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-400">Use for dashboard</button>
                        </form>
                      )}
                      <form action={syncSearchConsole}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-400">Refresh now</button>
                      </form>
                      <form action={removeSearchConsoleConnection}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-400">Disconnect</button>
                      </form>
                    </div>
                  </div>
                  {item.availableSites.length ? (
                    <form action={chooseSearchConsoleSite} className="mt-4 flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-end">
                      <input type="hidden" name="id" value={item.id} />
                      <label className="grid flex-1 gap-1.5 text-sm font-medium text-stone-700">
                        Property used for this connection
                        <select name="siteUrl" defaultValue={item.selectedSite ?? ''} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal text-stone-900">
                          {item.availableSites.map((site) => <option key={site} value={site}>{site}</option>)}
                        </select>
                      </label>
                      <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-400">Save property</button>
                    </form>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-stone-500">This Google account does not currently have Search Console access to a property.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">{unavailable ? 'Connection status unavailable.' : 'No Google account is connected yet. Connect the account with access to theraaga.in to begin reporting. The public website remains free of analytics cookies after connection.'}</p>
          )}
        </section>

        <section className="mt-7">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6a15]">Organic search</p>
              <h2 className="mt-1 text-3xl font-light">Last 28 available days</h2>
            </div>
            {report && <p className="text-sm text-stone-500">{report.periodStart} to {report.periodEnd} · refreshed {formatDate(report.fetchedAt)}</p>}
          </div>

          {report ? (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ['Clicks', stat(report.totals.clicks), 'Search result clicks, not unique visitors'],
                  ['Impressions', stat(report.totals.impressions), 'Times RAAGA appeared in results'],
                  ['Click-through rate', percent(report.totals.ctr), 'Clicks per search impression'],
                  ['Average position', stat(report.totals.position), 'Lower is better'],
                ].map(([label, value, help]) => (
                  <article key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">{label}</p>
                    <p className="mt-3 text-4xl font-light tabular-nums">{value}</p>
                    <p className="mt-2 text-xs leading-5 text-stone-500">{help}</p>
                  </article>
                ))}
              </div>
              {report.previousTotals && <p className="mt-4 text-sm text-stone-600">Compared with the previous 28 days: clicks {changeLabel(report.totals.clicks, report.previousTotals.clicks)}; impressions {changeLabel(report.totals.impressions, report.previousTotals.impressions)}.</p>}
              <p className="mt-3 break-all text-xs text-stone-500">Reporting property: {report.siteUrl}. Google may omit anonymised queries; table totals may differ from headline totals.</p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <ReportTable title="Top search queries" rows={report.queries} />
                <ReportTable title="Top pages in Search" rows={report.pages} pageLabels />
                <ReportTable title="Countries" rows={report.countries} />
                <ReportTable title="Devices" rows={report.devices} />
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="font-medium text-stone-900">Search performance will appear here after the first connection refresh.</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Google normally finalises Search Console data two to three days after a search. This dashboard requests the latest complete 28-day window rather than mixing incomplete current-day numbers into your decisions.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function ReportTable({ title, rows, pageLabels = false }: { title: string; rows: { label: string; clicks: number; impressions: number; ctr: number; position: number }[]; pageLabels?: boolean }) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
      <h3 className="px-5 pt-5 font-[var(--font-ui)] text-sm font-semibold text-stone-900">{title}</h3>
      {rows.length ? (
        <table className="mt-3 w-full min-w-[520px] border-collapse text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-[0.08em] text-stone-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{pageLabels ? 'Page' : 'Name'}</th>
              <th className="px-3 py-3 font-semibold">Clicks</th>
              <th className="px-3 py-3 font-semibold">Impressions</th>
              <th className="px-5 py-3 font-semibold">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="max-w-[18rem] break-all px-5 py-3 text-stone-700">{pageLabels ? shortPage(row.label) : row.label}</td>
                <td className="px-3 py-3 tabular-nums text-stone-900">{stat(row.clicks)}</td>
                <td className="px-3 py-3 tabular-nums text-stone-900">{stat(row.impressions)}</td>
                <td className="px-5 py-3 tabular-nums text-stone-700">{stat(row.position)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="p-5 text-sm text-stone-500">No report rows are available yet.</p>}
    </section>
  )
}

export default function SearchConsolePage({ searchParams }: { searchParams: Promise<{ notice?: string | string[] }> }) {
  return (
    <Suspense fallback={<LoadingSearchConsole />}>
      <SearchConsoleContent searchParams={searchParams} />
    </Suspense>
  )
}
