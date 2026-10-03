import { Suspense } from 'react'
import { connection } from 'next/server'
import Link from 'next/link'
import {
  ENQUIRIES_PER_PAGE,
  getAdminEnquiries,
  LEAD_STATUSES,
  type EnquiryFilters,
  type EnquiryLead,
  type LeadStatus,
} from '@/data/admin-dashboard'
import { requireAdmin } from '@/lib/admin-auth'
import { INTERESTS, LEARNERS, MODES } from '@/lib/enquiry-schema'
import { AdminHeader } from '@/components/admin/AdminHeader'
import {
  DeleteLeadControl,
  LEAD_STATUS_LABELS,
  LeadContact,
  LeadStatusForm,
} from '@/components/admin/LeadParts'
import type { Mode } from '@/content/types'

// Record<Mode, string> rather than `as const`, so adding a delivery mode is a
// compile error here instead of a blank cell in the enquiries table.
const MODE_LABELS: Record<Mode, string> = {
  'jubilee-hills': 'Jubilee Hills',
  'phoenix-arena': 'Phoenix Arena',
  online: 'Online',
  community: 'Community',
}

const INTEREST_LABELS = {
  carnatic_vocal: 'Carnatic vocal',
  not_sure: 'Help me choose',
} as const

const AGE_LABELS = {
  under_7: 'Under 7',
  '7_12': '7–12',
  '13_17': '13–17',
  adult: 'Adult',
} as const

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function stat(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

function oneOf<T extends readonly string[]>(value: string | undefined, options: T): T[number] | undefined {
  return value && (options as readonly string[]).includes(value) ? value as T[number] : undefined
}

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '1', 10)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1
}

function queryString(filters: EnquiryFilters, page: number): string {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.mode) params.set('mode', filters.mode)
  if (filters.learner) params.set('learner', filters.learner)
  if (filters.interest) params.set('interest', filters.interest)
  if (page > 1) params.set('page', String(page))
  const encoded = params.toString()
  return encoded ? `/admin/enquiries?${encoded}` : '/admin/enquiries'
}

function LeadRequest({ lead }: { lead: EnquiryLead }) {
  return (
    <>
      <p className="font-medium text-stone-900">
        {lead.learner === 'my_child' ? 'For a child' : 'For myself'} · {AGE_LABELS[lead.ageBand]}
      </p>
      {lead.interest && (
        <p className="mt-1">{INTEREST_LABELS[lead.interest]}</p>
      )}
      <p className="mt-1">{MODE_LABELS[lead.mode]}{lead.timezone ? ` · ${lead.timezone}` : ''}</p>
    </>
  )
}

function LoadingEnquiries() {
  return <main className="min-h-dvh bg-stone-100" aria-label="Loading enquiries" />
}

async function AdminEnquiriesContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection()
  const session = await requireAdmin()
  const params = await searchParams
  const value = (name: string): string | undefined => {
    const item = params[name]
    return typeof item === 'string' ? item : undefined
  }
  const filters: EnquiryFilters = {
    page: parsePage(value('page')),
    status: oneOf(value('status'), LEAD_STATUSES),
    mode: oneOf(value('mode'), MODES),
    learner: oneOf(value('learner'), LEARNERS),
    interest: oneOf(value('interest'), INTERESTS),
  }
  const enquiries = await getAdminEnquiries(filters)

  if (!enquiries) {
    return null
  }

  return (
    <main className="min-h-dvh bg-stone-100 px-4 py-5 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          current="enquiries"
          title="Enquiries & interests"
          description="Adult contacts and the learning preferences they chose on the website."
          username={session.username}
        />

        <section className="mt-7 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6a15]">Private lead list</p>
              <h2 className="mt-1 text-3xl font-light">{stat(enquiries.total)} matching enquiries</h2>
              <p className="mt-2 text-sm text-stone-600">Each record is retained for the enquiry period only and contains an adult contact, never a child’s identity.</p>
            </div>
            {enquiries.leadCounts.length > 0 && (
              <p className="text-sm text-stone-500">
                {enquiries.leadCounts
                  .map((row) => `${LEAD_STATUS_LABELS[row.label as LeadStatus] ?? row.label}: ${stat(row.count)}`)
                  .join(' · ')}
              </p>
            )}
          </div>

          <form className="mt-5 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-2 lg:grid-cols-5" method="get">
            <label className="grid gap-1.5 text-sm font-medium text-stone-700">
              Status
              <select name="status" defaultValue={filters.status ?? ''} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal text-stone-900">
                <option value="">All statuses</option>
                {LEAD_STATUSES.map((status) => <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-stone-700">
              Learning mode
              <select name="mode" defaultValue={filters.mode ?? ''} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal text-stone-900">
                <option value="">All modes</option>
                {MODES.map((mode) => <option key={mode} value={mode}>{MODE_LABELS[mode]}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-stone-700">
              Learner
              <select name="learner" defaultValue={filters.learner ?? ''} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal text-stone-900">
                <option value="">All learners</option>
                {LEARNERS.map((learner) => <option key={learner} value={learner}>{learner === 'my_child' ? 'For a child' : 'For myself'}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-stone-700">
              Interest
              <select name="interest" defaultValue={filters.interest ?? ''} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal text-stone-900">
                <option value="">All interests</option>
                {INTERESTS.map((interest) => <option key={interest} value={interest}>{INTEREST_LABELS[interest]}</option>)}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <button className="rounded-xl bg-[#6b1f2a] px-4 py-2 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#5c1a20]">Apply filters</button>
              <Link href="/admin/enquiries" className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-400">Reset</Link>
            </div>
          </form>
        </section>

        <div className="mt-5 grid gap-1 text-sm leading-6 text-stone-600">
          <p>Delete an enquiry when the person asks, within thirty days as the privacy notice promises.</p>
          <p>If a message names a child, delete or ignore that detail, because the site never collects a child’s identity.</p>
        </div>

        <section className="mt-3 rounded-2xl border border-stone-200 bg-white shadow-sm">
          {enquiries.leads.length ? (
            <>
              {/* Phones get a stacked card per lead: a 1080px table meant swiping sideways to triage. */}
              <ul className="divide-y divide-stone-100 md:hidden">
                {enquiries.leads.map((lead) => (
                  <li key={lead.id} className="grid gap-3 p-4 text-sm">
                    <div><LeadContact name={lead.contactName} phone={lead.phone} /></div>
                    <div className="text-stone-600"><LeadRequest lead={lead} /></div>
                    <p className="leading-6 text-stone-600">{lead.message || <span className="text-stone-400">No message</span>}</p>
                    <p className="text-xs text-stone-500">Received {formatDate(lead.submittedAt)}</p>
                    <LeadStatusForm id={lead.id} name={lead.contactName} status={lead.status} />
                    <DeleteLeadControl id={lead.id} name={lead.contactName} />
                  </li>
                ))}
              </ul>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
                  <thead className="bg-stone-50 text-xs uppercase tracking-[0.08em] text-stone-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Contact</th>
                      <th className="px-5 py-3 font-semibold">Interest & learning request</th>
                      <th className="px-5 py-3 font-semibold">Message</th>
                      <th className="px-5 py-3 font-semibold">Received</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {enquiries.leads.map((lead) => (
                      <tr key={lead.id} className="align-top">
                        <td className="px-5 py-4"><LeadContact name={lead.contactName} phone={lead.phone} /></td>
                        <td className="px-5 py-4 text-stone-600"><LeadRequest lead={lead} /></td>
                        <td className="max-w-xs px-5 py-4 leading-6 text-stone-600">{lead.message || <span className="text-stone-400">No message</span>}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-stone-600">{formatDate(lead.submittedAt)}</td>
                        <td className="px-5 py-4">
                          <LeadStatusForm id={lead.id} name={lead.contactName} status={lead.status} />
                          <div className="mt-2">
                            <DeleteLeadControl id={lead.id} name={lead.contactName} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="p-7 text-sm leading-6 text-stone-500">No enquiries match these filters yet.</p>
          )}
        </section>

        {enquiries.totalPages > 1 && (
          <nav aria-label="Enquiry pages" className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm text-stone-600">Page {enquiries.page} of {enquiries.totalPages} · {ENQUIRIES_PER_PAGE} per page</p>
            <div className="flex gap-2">
              {enquiries.page > 1 ? (
                <Link href={queryString(filters, enquiries.page - 1)} className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-400">Previous</Link>
              ) : <span className="rounded-xl border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-400">Previous</span>}
              {enquiries.page < enquiries.totalPages ? (
                <Link href={queryString(filters, enquiries.page + 1)} className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-400">Next</Link>
              ) : <span className="rounded-xl border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-400">Next</span>}
            </div>
          </nav>
        )}
      </div>
    </main>
  )
}

export default function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <Suspense fallback={<LoadingEnquiries />}>
      <AdminEnquiriesContent searchParams={searchParams} />
    </Suspense>
  )
}
