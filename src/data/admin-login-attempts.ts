import 'server-only'

import { createHmac } from 'node:crypto'
import { getAdminDb, isAdminDatabaseConfigured } from '@/data/admin-mongo'

/**
 * Admin sign-in rate limiting.
 *
 * Vercel runs many short-lived serverless instances, each with its own memory,
 * so a per-process counter lets an attacker multiply the limit by the number
 * of warm instances. Attempts are therefore stored in Mongo, where every
 * instance sees the same count.
 *
 * Privacy: the raw IP is never stored. The key is HMAC-SHA256(ip, secret), so a
 * leaked database cannot be reversed into addresses by trying the IPv4 space.
 *
 * Availability: the limiter must never lock the owner out because the database
 * hiccupped. If Mongo is unconfigured, slow or throws, an in-memory limiter
 * (per instance, weaker, but pruned) takes over.
 */
export const LOGIN_WINDOW_MS = 15 * 60 * 1000
export const MAX_LOGIN_ATTEMPTS = 5
const DB_TIMEOUT_MS = 4000

type LoginAttempt = {
  key: string
  at: Date
  expiresAt: Date
}

let indexesPromise: Promise<void> | undefined

function attemptKey(ip: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? ''
  return createHmac('sha256', secret).update(ip).digest('hex')
}

/** Bounds how long a struggling database can hold up a sign-in. */
function withTimeout<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Admin database timed out')), DB_TIMEOUT_MS)
  })
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer))
}

async function attemptsCollection() {
  const db = await getAdminDb()
  const attempts = db.collection<LoginAttempt>('admin_login_attempts')
  if (!indexesPromise) {
    indexesPromise = Promise.all([
      attempts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'login_attempts_ttl' }),
      attempts.createIndex({ key: 1, at: 1 }, { name: 'login_attempts_key' }),
    ]).then(() => undefined)
    // A failed attempt must not be memoised, or one blip would disable the
    // database limiter until the instance is recycled.
    indexesPromise.catch(() => {
      indexesPromise = undefined
    })
  }
  await indexesPromise
  return attempts
}

const memoryAttempts = new Map<string, number[]>()

function memoryRecord(key: string, now: number): number {
  // Sweep every key, not just this one, so addresses that never return do not
  // accumulate for the life of the instance.
  for (const [entryKey, times] of memoryAttempts) {
    const recent = times.filter((time) => now - time < LOGIN_WINDOW_MS)
    if (recent.length) memoryAttempts.set(entryKey, recent)
    else memoryAttempts.delete(entryKey)
  }
  const recent = memoryAttempts.get(key) ?? []
  recent.push(now)
  memoryAttempts.set(key, recent)
  return recent.length
}

/**
 * Records this attempt and reports whether the caller is now over the limit
 * (more than MAX_LOGIN_ATTEMPTS inside the window). The attempt is written
 * first and counted second, so concurrent requests cannot all read "4" and
 * slip through together.
 */
export async function recordLoginAttempt(ip: string): Promise<boolean> {
  const key = attemptKey(ip)
  const now = Date.now()

  if (isAdminDatabaseConfigured()) {
    try {
      const count = await withTimeout(
        (async () => {
          const attempts = await attemptsCollection()
          await attempts.insertOne({
            key,
            at: new Date(now),
            expiresAt: new Date(now + LOGIN_WINDOW_MS),
          })
          return attempts.countDocuments({ key, at: { $gt: new Date(now - LOGIN_WINDOW_MS) } })
        })(),
      )
      return count > MAX_LOGIN_ATTEMPTS
    } catch (error) {
      console.error('[raaga:admin] Login attempts fell back to in-memory limiting:', error)
    }
  }

  return memoryRecord(key, now) > MAX_LOGIN_ATTEMPTS
}

/** A correct password wipes the slate, so typos earlier today do not count against the owner. */
export async function clearLoginAttempts(ip: string): Promise<void> {
  const key = attemptKey(ip)
  memoryAttempts.delete(key)

  if (!isAdminDatabaseConfigured()) return
  try {
    await withTimeout(
      attemptsCollection().then((attempts) => attempts.deleteMany({ key })),
    )
  } catch (error) {
    // Best effort: the attempts expire on their own within the window.
    console.error('[raaga:admin] Could not clear login attempts:', error)
  }
}
