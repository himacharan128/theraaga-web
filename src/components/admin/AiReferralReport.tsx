import type { AiReferralSummary } from '@/lib/ai-referrals'

const number = (value: number) => new Intl.NumberFormat('en-IN').format(value)

export function AiReferralReport({ report }: { report: AiReferralSummary }) {
  return (
    <section aria-labelledby="ai-referral-title" className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 [font-family:var(--font-ui)] shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8c6a15]">AI discovery</p>
          <h2 id="ai-referral-title" className="mt-2 text-xl font-semibold tracking-tight [font-family:var(--font-ui)]">Traffic from AI tools</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Page views in the selected period, grouped by the source sent with each view.
            These are not unique people, search impressions or citation counts.
          </p>
        </div>
        <a href="/admin/growth#editorial-plan" className="inline-flex min-h-11 items-center rounded-lg px-1 py-2 text-sm font-semibold text-[#6b1f2a] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
          Prepare the next article
        </a>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-stone-50 p-4">
          <dt className="text-sm font-semibold text-stone-700">Recognised AI referrer</dt>
          <dd className="mt-2 text-3xl tabular-nums text-stone-900">{number(report.referrerPageViews)}</dd>
          <dd className="mt-2 text-xs leading-5 text-stone-600">The reported referrer hostname belongs to a listed AI tool.</dd>
        </div>
        <div className="rounded-xl bg-stone-50 p-4">
          <dt className="text-sm font-semibold text-stone-700">AI campaign tag only</dt>
          <dd className="mt-2 text-3xl tabular-nums text-stone-900">{number(report.taggedPageViews)}</dd>
          <dd className="mt-2 text-xs leading-5 text-stone-600">No recognised AI referrer. A link tag names an AI tool; anyone can set this tag.</dd>
        </div>
      </dl>

      {report.providers.length ? (
        <ul aria-label="AI source breakdown" className="mt-5 divide-y divide-stone-100">
          {report.providers.map(provider => (
            <li key={provider.label} className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <h3 className="text-sm font-semibold text-stone-900 [font-family:var(--font-ui)]">{provider.label}</h3>
              <dl className="mt-2 grid grid-cols-2 gap-4 text-sm sm:mt-0 sm:w-72">
                <div><dt className="text-xs text-stone-500">Referrer</dt><dd className="mt-1 font-semibold tabular-nums">{number(provider.referrerPageViews)}</dd></div>
                <div><dt className="text-xs text-stone-500">Tag only</dt><dd className="mt-1 font-semibold tabular-nums">{number(provider.taggedPageViews)}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-stone-300 p-4 text-sm leading-6 text-stone-600">
          No recognised AI source was recorded in this period. This does not mean RAAGA was absent from AI answers.
        </p>
      )}

      <details className="mt-5 border-t border-stone-200 pt-4 text-sm text-stone-600">
        <summary className="w-fit cursor-pointer rounded py-2 font-semibold text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-4">What this report can and cannot tell you</summary>
        <div className="mt-3 max-w-3xl space-y-3 leading-6">
          <p>Recognised tools: ChatGPT, Claude, Perplexity, Gemini and Microsoft Copilot. A recognised referrer takes priority over a campaign tag so each view is counted once here.</p>
          <p>Google and Bing referrers can mix ordinary search with AI experiences, so they are not labelled as AI traffic. Apps, copied links and privacy settings may omit the referrer. Repeat views and blocked telemetry also affect these counts.</p>
          <p>These counts reuse existing daily aggregates. They do not identify people or connect a visitor to an enquiry. Referrer and campaign values are reported signals, not proof of an AI recommendation.</p>
        </div>
      </details>
    </section>
  )
}
