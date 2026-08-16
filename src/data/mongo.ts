import 'server-only'

import { MongoClient, type Db } from 'mongodb'

/**
 * The cached-client pattern. This is now the ONLY supported path to Atlas:
 * MongoDB shut down the Atlas Data API and the whole App Services platform on
 * 30 September 2025, so there is no HTTP alternative.
 *
 * Driver choice is also forced: Prisma 7 ships no MongoDB support at all
 * (maintainers tell MongoDB users to stay on 6.19, with no dated roadmap), and
 * Drizzle has no MongoDB dialect. The plain driver it is.
 *
 * Serverless pooling: the driver's default maxPoolSize is 100, which will
 * exhaust an Atlas Flex connection cap across warm instances. 10 per instance
 * tolerates roughly 50 concurrent instances against a 500-connection cap.
 *
 * Region: Atlas Flex IS available in AWS ap-south-1 (Mumbai) — pair it with
 * Vercel `bom1` for ~1 ms compute-to-DB and in-country data residency.
 */

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB ?? 'raaga'

const options = {
  maxPoolSize: 10,
  minPoolSize: 0,
  retryWrites: true,
}

let clientPromise: Promise<MongoClient> | undefined

declare global {
   
  var _raagaMongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error('MONGODB_URI is not set')

  if (process.env.NODE_ENV === 'development') {
    // Preserve the client across HMR reloads so dev does not leak connections.
    if (!global._raagaMongoClientPromise) {
      global._raagaMongoClientPromise = new MongoClient(uri, options).connect()
    }
    return global._raagaMongoClientPromise
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, options).connect()
  }
  return clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(dbName)
}
