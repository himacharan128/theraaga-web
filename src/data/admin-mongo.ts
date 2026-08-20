import 'server-only'

import { MongoClient, type Db } from 'mongodb'

/**
 * Read/write access for the password-protected school dashboard only.
 *
 * This MUST be a different Atlas user from MONGODB_URI. The public enquiry
 * account can insert leads but cannot read them; the dashboard account may
 * read/update `leads` and maintain aggregate `analytics_daily` documents.
 * Its URI is never sent to the browser or used by a public page.
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
