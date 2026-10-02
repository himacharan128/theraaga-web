import 'server-only'

import { MongoClient, type Db } from 'mongodb'

/**
 * The read/write Atlas connection, used by the dashboard AND by aggregate
 * telemetry.
 *
 * This MUST be a different Atlas user from MONGODB_URI. The public enquiry
 * account can insert leads but cannot read them; this account may read/update
 * `leads` and maintain `analytics_daily`, plus the three `search_console_*`
 * collections, so it needs `readWrite` on the database rather than a
 * collection-scoped privilege — it creates indexes.
 *
 * SCOPE — read before scoping the Atlas user or moving a caller.
 * This URI is never sent to the browser, but it is NOT reached only from
 * behind the admin password: `/api/telemetry` is a public, unauthenticated
 * route and it writes `analytics_daily` through `recordAggregateTelemetry`,
 * which uses this client. So the surface that can trigger a write with these
 * credentials includes every public page view, not just an authenticated
 * dashboard session. That is why the telemetry route validates its payload
 * with a closed Zod enum, restricts the dimension alphabet, and stores no
 * identifier — the write path is public even though the credential is not.
 */
const uri = process.env.MONGODB_ADMIN_URI
const dbName = process.env.MONGODB_DB ?? 'raaga'

const options = {
  maxPoolSize: 5,
  minPoolSize: 0,
  retryWrites: true,
}

let clientPromise: Promise<MongoClient> | undefined

declare global {
  var _raagaAdminMongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error('MONGODB_ADMIN_URI is not set')

  if (process.env.NODE_ENV === 'development') {
    if (!global._raagaAdminMongoClientPromise) {
      global._raagaAdminMongoClientPromise = new MongoClient(uri, options).connect()
    }
    return global._raagaAdminMongoClientPromise
  }

  if (!clientPromise) clientPromise = new MongoClient(uri, options).connect()
  return clientPromise
}

export function isAdminDatabaseConfigured(): boolean {
  return Boolean(uri)
}

export async function getAdminDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(dbName)
}
