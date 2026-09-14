import { Suspense } from 'react'
import { connection } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { centres, site } from '@/content/seed/site'
import { getPrimarySearchConsoleReport, listSearchConsoleConnections } from '@/data/search-console'

async function GrowthContent() {
  await connection()
  const session = await requireAdmin()
  const results = await Promise.allSettled([listSearchConsoleConnections(), getPrimarySearchConsoleReport()])
  const accounts = results[0].status === 'fulfilled' ? results[0].value : []
  const report = results[1].status === 'fulfilled' ? results[1].value : null
  const unavailable = results.some(result => result.status === 'rejected')
  const opportunities = report?.queries.filter(row => row.impressions >= 10 && row.position > 3 && row.position <= 20).sort((a,b) => b.impressions - a.impressions).slice(0, 8) ?? []
  const actions = [
    { title: 'Connect your Google search data', status: unavailable ? 'Check connection' : accounts.length ? 'Connected' : 'Action needed', body: 'Use the Google account that owns theraaga.in. This unlocks actual queries, clicks, pages and ranking trends.', href: '/admin/search-console', label: 'Manage Search Console' },
    ...centres.filter(centre => centre.slug).map(centre => ({ title: `Confirm ${centre.name} location details`, status: centre.streetAddress ? 'Address supplied · listing pending' : 'Owner details needed', body: centre.streetAddress ? 'The owner-supplied address and location pin are published. Confirm customer-facing hours and create the Google Business Profile when the school is ready. A coordinate link is not a verified business listing.' : 'Supply the exact public street address, postcode and customer-facing hours. Verify that this is an active RAAGA teaching location before creating a Business Profile.', href: centre.href, label: 'Review centre page' })),
    { title: 'Build a consistent public identity', status: Object.values(site.social).filter(Boolean).length ? 'Profiles supplied' : 'Owner details needed', body: 'Provide the official RAAGA social and Business Profile links. Use the same name, phone and centre details across your profiles.', href: 'https://business.google.com/', label: 'Google Business Profile' },
    { title: 'Publish evidence from the school', status: 'Content needed', body: 'Collect approved teacher biographies, real teaching photos and guardian consent where required. Ask families for honest reviews through your verified Business Profile.', href: '/gurus', label: 'Review teacher information' },
    { title: 'Help prospective learners choose', status: 'Guide available', body: 'Share the getting-started guide in community groups and link to the relevant centre or online page. Ask real partner venues to link to RAAGA where appropriate.', href: '/getting-started', label: 'Read admissions guide' },
  ]
  return <div className="min-h-dvh bg-stone-100 px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-7xl">
    <AdminHeader current="growth" title="Turn visibility into enquiries" description="A practical work queue based on your current website and available Google reports." username={session.username} />
    <div className="mt-7 grid gap-4 md:grid-cols-2">{actions.map((action, index) => <article key={action.title} className="rounded-2xl border border-stone-200 bg-white p-6"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-stone-400">STEP {index + 1}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">{action.status}</span></div><h2 className="mt-4">{action.title}</h2><p className="mt-3 text-sm leading-6 text-stone-600">{action.body}</p><a className="mt-5 inline-block font-semibold text-[#6b1f2a]" href={action.href}>{action.label} →</a></article>)}</div>
    <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6"><h2>Queries within reach</h2><p className="mt-2 text-sm text-stone-600">Queries with at least 10 impressions and average positions 4–20 in the latest report. Review the matching page before choosing an improvement. These are opportunities, not promised rankings.</p>{opportunities.length ? <ul className="mt-5 divide-y divide-stone-100">{opportunities.map(row => <li key={row.label} className="flex flex-wrap justify-between gap-2 py-3"><strong>{row.label}</strong><span className="text-stone-500">{row.impressions} impressions · position {row.position.toFixed(1)}</span></li>)}</ul> : <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm text-stone-500">{report ? 'No queries meet this threshold in the current report.' : 'Connect Search Console and refresh a report to see evidence-based opportunities.'}</p>}</section>
    <p className="mt-5 text-xs leading-6 text-stone-500">Local search depends on relevance, distance and prominence. <a className="underline" href="https://support.google.com/business/answer/7091">Read Google’s local ranking guidance</a>. Address checks above reflect supplied site content; they do not verify Business Profile ownership or live indexing.</p>
  </div></div>
}
export default function GrowthPage() { return <Suspense fallback={<div className="min-h-dvh bg-stone-100 p-8">Loading growth plan…</div>}><GrowthContent /></Suspense> }
