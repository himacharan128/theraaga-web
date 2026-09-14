import 'server-only'

import { randomUUID } from 'node:crypto'
import { getAdminDb, isAdminDatabaseConfigured } from '@/data/admin-mongo'
import {
  fetchSearchConsoleReport,
  getGoogleAccountEmail,
  isGoogleSearchConsoleConfigured,
  listSearchConsoleSites,
  type SearchConsoleReportData,
} from '@/lib/google-search-console'
import { openSecret, sealSecret } from '@/lib/secret-box'

const PROVIDER = 'google-search-console'
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000

type SearchConsoleConnectionDocument = {
  id: string
  provider: typeof PROVIDER
  accountEmail?: string
  encryptedRefreshToken: string
  availableSites: string[]
  selectedSite?: string
  isPrimary: boolean
  connectedBy: string
  connectedAt: Date
  lastSyncedAt?: Date
  lastSyncError?: string
  disabledAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

type OAuthStateDocument = {
  stateHash: string
  encryptedVerifier: string
  createdBy: string
  createdAt: Date
  expiresAt: Date
  consumedAt?: Date
}

type SearchConsoleReportDocument = SearchConsoleReportData & {
  connectionId: string
  siteUrl: string
  fetchedAt: Date
  updatedAt: Date
}

export type SearchConsoleConnection = Omit<SearchConsoleConnectionDocument, 'encryptedRefreshToken'>
export type SearchConsoleReport = Omit<SearchConsoleReportDocument, 'connectionId'>

export function isSearchReportStale(fetchedAt: Date): boolean {
  return Date.now() - new Date(fetchedAt).getTime() > 48 * 60 * 60 * 1000
}

let indexesPromise: Promise<void> | undefined

async function ensureIndexes(): Promise<void> {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const db = await getAdminDb()
      await Promise.all([
        db.collection<SearchConsoleConnectionDocument>('search_console_connections').createIndex({ id: 1 }, { unique: true }),
        db.collection<SearchConsoleConnectionDocument>('search_console_connections').createIndex({ provider: 1, disabledAt: 1, isPrimary: 1 }),
        db.collection<OAuthStateDocument>('search_console_oauth_states').createIndex({ stateHash: 1 }, { unique: true }),
        db.collection<OAuthStateDocument>('search_console_oauth_states').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        db.collection<SearchConsoleReportDocument>('search_console_reports').createIndex({ connectionId: 1 }, { unique: true }),
      ])
    })()
  }
  try { await indexesPromise } catch (error) { indexesPromise = undefined; throw error }
}

function connectionProjection() {
  return { projection: { encryptedRefreshToken: 0 } }
}

export function isSearchConsoleReady(): boolean {
  return isAdminDatabaseConfigured() && isGoogleSearchConsoleConfigured()
}

export async function createSearchConsoleOAuthState({
  stateHash,
  verifier,
  username,
}: {
  stateHash: string
  verifier: string
  username: string
}): Promise<void> {
  await ensureIndexes()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + OAUTH_STATE_TTL_MS)
  const db = await getAdminDb()
  await db.collection<OAuthStateDocument>('search_console_oauth_states').insertOne({
    stateHash,
    encryptedVerifier: sealSecret(verifier),
    createdBy: username,
    createdAt: now,
    expiresAt,
  })
}

export async function consumeSearchConsoleOAuthState(stateHash: string, username: string): Promise<string | null> {
  await ensureIndexes()
  const db = await getAdminDb()
  const states = db.collection<OAuthStateDocument>('search_console_oauth_states')
  const state = await states.findOneAndUpdate(
    {
      stateHash,
      createdBy: username,
      expiresAt: { $gt: new Date() },
      consumedAt: { $exists: false },
    },
    { $set: { consumedAt: new Date() } },
    { returnDocument: 'before' },
  )
  if (!state) return null

  try {
    return openSecret(state.encryptedVerifier)
  } catch {
    return null
  }
}

export async function connectSearchConsoleAccount({
  refreshToken,
  username,
}: {
  refreshToken: string
  username: string
}): Promise<SearchConsoleConnection> {
  await ensureIndexes()
  const [accountEmail, availableSites] = await Promise.all([
    getGoogleAccountEmail(refreshToken),
    listSearchConsoleSites(refreshToken),
  ])
  const preferredSite = availableSites.includes('sc-domain:theraaga.in')
    ? 'sc-domain:theraaga.in'
    : availableSites.find((site) => site === 'https://theraaga.in/' || site === 'https://www.theraaga.in/') ?? availableSites[0]
  const db = await getAdminDb()
  const connections = db.collection<SearchConsoleConnectionDocument>('search_console_connections')
  const now = new Date()
  const existing = accountEmail
    ? await connections.findOne({ provider: PROVIDER, accountEmail, disabledAt: null })
    : null
  const primaryExists = await connections.countDocuments({ provider: PROVIDER, disabledAt: null, isPrimary: true })
  const id = existing?.id ?? randomUUID()
  const selectedSite = availableSites.includes(existing?.selectedSite ?? '')
    ? existing?.selectedSite
    : preferredSite

  await connections.updateOne(
    { id },
    {
      $set: {
        provider: PROVIDER,
        accountEmail,
        encryptedRefreshToken: sealSecret(refreshToken),
        availableSites,
        selectedSite,
        isPrimary: existing?.isPrimary ?? primaryExists === 0,
        connectedBy: username,
        connectedAt: now,
        updatedAt: now,
      },
      $unset: { lastSyncError: '', disabledAt: '' },
      $setOnInsert: { id, createdAt: now },
    },
    { upsert: true },
  )

  const connection = await connections.findOne({ id }, connectionProjection())
  if (!connection) throw new Error('Google Search Console connection was not saved')
  return connection
}

export async function listSearchConsoleConnections(): Promise<SearchConsoleConnection[]> {
  if (!isAdminDatabaseConfigured()) return []
  await ensureIndexes()
  const db = await getAdminDb()
  return db
    .collection<SearchConsoleConnectionDocument>('search_console_connections')
    .find({ provider: PROVIDER, disabledAt: null }, connectionProjection())
    .sort({ isPrimary: -1, connectedAt: -1 })
    .toArray()
}

export async function setPrimarySearchConsoleConnection(id: string): Promise<void> {
  await ensureIndexes()
  const db = await getAdminDb()
  const connections = db.collection<SearchConsoleConnectionDocument>('search_console_connections')
  const selected = await connections.findOne({ id, provider: PROVIDER, disabledAt: null })
  if (!selected) return
  await connections.updateMany({ provider: PROVIDER, disabledAt: null }, { $set: { isPrimary: false, updatedAt: new Date() } })
  await connections.updateOne({ id }, { $set: { isPrimary: true, updatedAt: new Date() } })
}

export async function setSearchConsoleSite(id: string, siteUrl: string): Promise<void> {
  await ensureIndexes()
  const db = await getAdminDb()
  const connections = db.collection<SearchConsoleConnectionDocument>('search_console_connections')
  const connection = await connections.findOne({ id, provider: PROVIDER, disabledAt: null })
  if (!connection?.availableSites.includes(siteUrl)) return
  await connections.updateOne({ id }, { $set: { selectedSite: siteUrl, updatedAt: new Date() }, $unset: { lastSyncError: '' } })
}

export async function disableSearchConsoleConnection(id: string): Promise<void> {
  await ensureIndexes()
  const db = await getAdminDb()
  const connections = db.collection<SearchConsoleConnectionDocument>('search_console_connections')
  const now = new Date()
  const selected = await connections.findOne({ id, provider: PROVIDER, disabledAt: null })
  if (!selected) return
  await connections.updateOne(
    { id },
    { $set: { disabledAt: now, encryptedRefreshToken: '', isPrimary: false, updatedAt: now } },
  )
  if (selected.isPrimary) {
    const next = await connections.findOne({ provider: PROVIDER, disabledAt: null }, { sort: { connectedAt: -1 } })
    if (next) await connections.updateOne({ id: next.id }, { $set: { isPrimary: true, updatedAt: now } })
  }
}

export async function syncSearchConsoleConnection(id: string): Promise<void> {
  await ensureIndexes()
  const db = await getAdminDb()
  const connections = db.collection<SearchConsoleConnectionDocument>('search_console_connections')
  const connection = await connections.findOne({ id, provider: PROVIDER, disabledAt: null })
  if (!connection?.selectedSite || !connection.encryptedRefreshToken) return

  try {
    const report = await fetchSearchConsoleReport(openSecret(connection.encryptedRefreshToken), connection.selectedSite)
    const now = new Date()
    await db.collection<SearchConsoleReportDocument>('search_console_reports').updateOne(
      { connectionId: id },
      { $set: { ...report, connectionId: id, siteUrl: connection.selectedSite, fetchedAt: now, updatedAt: now } },
      { upsert: true },
    )
    await connections.updateOne({ id }, { $set: { lastSyncedAt: now, updatedAt: now }, $unset: { lastSyncError: '' } })
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 220) : 'Unable to refresh Search Console data'
    await connections.updateOne({ id }, { $set: { lastSyncError: message, updatedAt: new Date() } })
  }
}

export async function syncPrimarySearchConsoleConnection(): Promise<void> {
  await ensureIndexes()
  const db = await getAdminDb()
  const connection = await db.collection<SearchConsoleConnectionDocument>('search_console_connections').findOne({
    provider: PROVIDER,
    disabledAt: null,
    isPrimary: true,
  })
  if (connection) await syncSearchConsoleConnection(connection.id)
}

export async function getPrimarySearchConsoleReport(): Promise<SearchConsoleReport | null> {
  if (!isAdminDatabaseConfigured()) return null
  await ensureIndexes()
  const db = await getAdminDb()
  const primary = await db.collection<SearchConsoleConnectionDocument>('search_console_connections').findOne({
    provider: PROVIDER,
    disabledAt: null,
    isPrimary: true,
  })
  if (!primary) return null
  return db.collection<SearchConsoleReportDocument>('search_console_reports').findOne(
    { connectionId: primary.id, siteUrl: primary.selectedSite },
    { projection: { connectionId: 0 } },
  )
}
