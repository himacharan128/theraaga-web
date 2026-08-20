import 'server-only'

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE =
  process.env.NODE_ENV === 'production' ? '__Host-raaga_admin' : 'raaga_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 12

export type AdminSession = {
  username: string
  expiresAt: number
}

type SessionPayload = {
  username: string
  expiresAt: number
  nonce: string
}

function configuredUsername(): string | undefined {
  return process.env.ADMIN_USERNAME?.trim() || undefined
}

function sessionSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET?.trim() || undefined
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function equal(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

function derivePassword(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      64,
      { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, derived) => (error ? reject(error) : resolve(derived)),
    )
  })
}

async function verifyPassword(password: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH
  if (!stored) return false

  // `scrypt:<base64 salt>:<base64 hash>` is the only accepted wire format.
  // A password is never held in a repository or deployment configuration.
  const [algorithm, saltEncoded, expectedEncoded] = stored.split(':')
  if (algorithm !== 'scrypt' || !saltEncoded || !expectedEncoded) return false

  try {
    const salt = Buffer.from(saltEncoded, 'base64')
    const expected = Buffer.from(expectedEncoded, 'base64')
    if (salt.length < 16 || expected.length !== 64) return false
    const actual = await derivePassword(password, salt)
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}

export function isAdminConfigured(): boolean {
  return Boolean(
    configuredUsername() && process.env.ADMIN_PASSWORD_HASH && sessionSecret(),
  )
}

export async function validateAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUsername = configuredUsername()
  if (!expectedUsername || !sessionSecret()) return false

  // Do both comparisons for an unknown username as well; the generic answer
  // below deliberately reveals neither whether an account nor password exists.
  const usernameMatches = equal(username.trim(), expectedUsername)
  const passwordMatches = await verifyPassword(password)
  return usernameMatches && passwordMatches
}

export async function createAdminSession(username: string): Promise<void> {
  const secret = sessionSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')

  const payload: SessionPayload = {
    username,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: randomBytes(16).toString('base64url'),
  }
  const encoded = encode(payload)
  const token = `${encoded}.${sign(encoded, secret)}`
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = sessionSecret()
  const expectedUsername = configuredUsername()
  if (!secret || !expectedUsername) return null

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature || !equal(signature, sign(encoded, secret))) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload
    if (
      payload.username !== expectedUsername ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }
    return { username: payload.username, expiresAt: payload.expiresAt }
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
