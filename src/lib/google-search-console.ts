import 'server-only'

import { createHash, randomBytes } from 'node:crypto'

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
const SEARCH_CONSOLE_API = 'https://www.googleapis.com/webmasters/v3'
const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

type TokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

type SearchAnalyticsRow = {
  keys?: string[]
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

type SearchAnalyticsResponse = { rows?: SearchAnalyticsRow[] }

export type SearchConsoleMetric = {
  label: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export type SearchConsoleReportData = {
  periodStart: string
  periodEnd: string
  totals: Omit<SearchConsoleMetric, 'label'>
  daily: SearchConsoleMetric[]
  queries: SearchConsoleMetric[]
  pages: SearchConsoleMetric[]
  countries: SearchConsoleMetric[]
  devices: SearchConsoleMetric[]
}

export function isGoogleSearchConsoleConfigured(): boolean {
  return Boolean(
    process.env.GSC_GOOGLE_CLIENT_ID?.trim() &&
      process.env.GSC_GOOGLE_CLIENT_SECRET?.trim() &&
      process.env.GSC_TOKEN_ENCRYPTION_KEY?.trim(),
  )
}

export function searchConsoleRedirectUri(): string {
  return process.env.GSC_REDIRECT_URI?.trim() || 'https://admin.theraaga.in/api/admin/search-console/callback'
}

function oauthClient(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GSC_GOOGLE_CLIENT_ID?.trim()
  const clientSecret = process.env.GSC_GOOGLE_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) throw new Error('Google Search Console OAuth is not configured')
  return { clientId, clientSecret }
}

function cleanError(payload: TokenResponse, fallback: string): Error {
  const detail = payload.error_description || payload.error
  return new Error(detail ? `${fallback}: ${detail.slice(0, 180)}` : fallback)
}

async function googleJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: 'no-store' })
  const body = await response.json().catch(() => ({})) as T & { error?: { message?: string } }
  if (!response.ok) {
    const message = body?.error?.message || `Google request failed (${response.status})`
    throw new Error(message.slice(0, 220))
  }
  return body
}

export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(48).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

export function createOAuthState(): string {
  return randomBytes(32).toString('base64url')
}

export function stateHash(value: string): string {
  return createHash('sha256').update(value).digest('base64url')
}

export function googleAuthorizationUrl({ state, challenge }: { state: string; challenge: string }): string {
  const { clientId } = oauthClient()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: searchConsoleRedirectUri(),
    response_type: 'code',
    scope: `${SEARCH_CONSOLE_SCOPE} openid email`,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  return `${GOOGLE_AUTHORIZATION_URL}?${params}`
}

export async function exchangeAuthorizationCode(code: string, verifier: string): Promise<string> {
  const { clientId, clientSecret } = oauthClient()
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: searchConsoleRedirectUri(),
    grant_type: 'authorization_code',
    code_verifier: verifier,
  })
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    body,
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => ({})) as TokenResponse
  if (!response.ok || !payload.refresh_token) throw cleanError(payload, 'Google did not return a refresh token')
  return payload.refresh_token
}

async function accessToken(refreshToken: string): Promise<string> {
  const { clientId, clientSecret } = oauthClient()
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  })
  const response = await fetch(GOOGLE_TOKEN_URL, { method: 'POST', body, cache: 'no-store' })
  const payload = await response.json().catch(() => ({})) as TokenResponse
  if (!response.ok || !payload.access_token) throw cleanError(payload, 'Unable to refresh Google access')
  return payload.access_token
}

export async function getGoogleAccountEmail(refreshToken: string): Promise<string | undefined> {
  const token = await accessToken(refreshToken)
  const profile = await googleJson<{ email?: string }>(GOOGLE_USERINFO_URL, {
    headers: { authorization: `Bearer ${token}` },
  })
  return profile.email?.trim().toLowerCase() || undefined
}

export async function listSearchConsoleSites(refreshToken: string): Promise<string[]> {
  const token = await accessToken(refreshToken)
  const response = await googleJson<{ siteEntry?: { siteUrl?: string; permissionLevel?: string }[] }>(
    `${SEARCH_CONSOLE_API}/sites`,
    { headers: { authorization: `Bearer ${token}` } },
  )
  return (response.siteEntry ?? [])
    .filter((site) => site.siteUrl && site.permissionLevel && site.permissionLevel !== 'siteUnverifiedUser')
    .map((site) => site.siteUrl as string)
    .sort((a, b) => a.localeCompare(b))
}

function number(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function metric(label: string, row: SearchAnalyticsRow | undefined): SearchConsoleMetric {
  return {
    label,
    clicks: number(row?.clicks),
    impressions: number(row?.impressions),
    ctr: number(row?.ctr),
    position: number(row?.position),
  }
}

async function analyticsRows(
  token: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit = 25,
): Promise<SearchAnalyticsRow[]> {
  const response = await googleJson<SearchAnalyticsResponse>(
    `${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, dataState: 'final' }),
    },
  )
  return response.rows ?? []
}

function indiaDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Google Search Console data has a normal 2–3 day processing delay. */
export async function fetchSearchConsoleReport(refreshToken: string, siteUrl: string): Promise<SearchConsoleReportData> {
  const token = await accessToken(refreshToken)
  const periodEnd = indiaDate(3)
  const periodStart = indiaDate(30)
  const [totalRows, dailyRows, queryRows, pageRows, countryRows, deviceRows] = await Promise.all([
    analyticsRows(token, siteUrl, periodStart, periodEnd, [], 1),
    analyticsRows(token, siteUrl, periodStart, periodEnd, ['date'], 31),
    analyticsRows(token, siteUrl, periodStart, periodEnd, ['query']),
    analyticsRows(token, siteUrl, periodStart, periodEnd, ['page']),
    analyticsRows(token, siteUrl, periodStart, periodEnd, ['country']),
    analyticsRows(token, siteUrl, periodStart, periodEnd, ['device']),
  ])

  const total = metric('', totalRows[0])
  return {
    periodStart,
    periodEnd,
    totals: {
      clicks: total.clicks,
      impressions: total.impressions,
      ctr: total.ctr,
      position: total.position,
    },
    daily: dailyRows.map((row) => metric(row.keys?.[0] ?? 'Unknown', row)),
    queries: queryRows.map((row) => metric(row.keys?.[0] ?? 'Unknown', row)),
    pages: pageRows.map((row) => metric(row.keys?.[0] ?? 'Unknown', row)),
    countries: countryRows.map((row) => metric(row.keys?.[0] ?? 'Unknown', row)),
    devices: deviceRows.map((row) => metric(row.keys?.[0] ?? 'Unknown', row)),
  }
}
