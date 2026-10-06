export interface AiReferralSourceRow {
  referrerHost?: string | null
  utmSource?: string | null
  count: number
}

export interface AiReferralSummary {
  referrerPageViews: number
  taggedPageViews: number
  providers: Array<{
    label: string
    referrerPageViews: number
    taggedPageViews: number
  }>
}

const providers = [
  { label: 'ChatGPT', hosts: ['chatgpt.com', 'chat.openai.com'], tags: ['chatgpt', 'chatgpt.com', 'chat.openai.com'] },
  { label: 'Claude', hosts: ['claude.ai'], tags: ['claude', 'claude.ai'] },
  { label: 'Perplexity', hosts: ['perplexity.ai'], tags: ['perplexity', 'perplexity.ai'] },
  { label: 'Gemini', hosts: ['gemini.google.com'], tags: ['gemini', 'gemini.google.com'] },
  { label: 'Copilot', hosts: ['copilot.microsoft.com'], tags: ['copilot', 'copilot.microsoft.com'] },
]

function providerFromHost(value: string | null | undefined): string | undefined {
  const host = value?.trim().toLowerCase()
  if (!host || host.length > 253) return undefined
  // A host field must not accept a URL, path, port or malformed DNS label.
  const validLabels = host.split('.').every((label) => (
    label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  ))
  if (!validLabels) return undefined
  return providers.find((provider) => provider.hosts.some((domain) => (
    host === domain || host.endsWith(`.${domain}`)
  )))?.label
}

function providerFromTag(value: string | null | undefined): string | undefined {
  const tag = value?.trim().toLowerCase()
  return tag ? providers.find((provider) => provider.tags.includes(tag))?.label : undefined
}

/** Count page-view aggregates once. Campaign tags are labels, not verified referrals. */
export function summarizeAiReferrals(rows: readonly AiReferralSourceRow[]): AiReferralSummary {
  const totals = new Map<string, AiReferralSummary['providers'][number]>()
  let referrerPageViews = 0
  let taggedPageViews = 0

  for (const row of rows) {
    if (!Number.isFinite(row.count) || row.count <= 0) continue
    const referrerProvider = providerFromHost(row.referrerHost)
    const label = referrerProvider ?? providerFromTag(row.utmSource)
    if (!label) continue
    const provider = totals.get(label) ?? { label, referrerPageViews: 0, taggedPageViews: 0 }
    if (referrerProvider) {
      provider.referrerPageViews += row.count
      referrerPageViews += row.count
    } else {
      provider.taggedPageViews += row.count
      taggedPageViews += row.count
    }
    totals.set(label, provider)
  }

  return {
    referrerPageViews,
    taggedPageViews,
    providers: [...totals.values()].sort((a, b) => (
      (b.referrerPageViews + b.taggedPageViews) - (a.referrerPageViews + a.taggedPageViews)
      || a.label.localeCompare(b.label, 'en')
    )),
  }
}
