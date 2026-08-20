import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import {
  createOAuthState,
  createPkcePair,
  googleAuthorizationUrl,
  stateHash,
} from '@/lib/google-search-console'
import { createSearchConsoleOAuthState, isSearchConsoleReady } from '@/data/search-console'

export async function GET(request: Request) {
  const session = await requireAdmin()
  const base = new URL('/admin/search-console', request.url)
  if (!isSearchConsoleReady()) {
    base.searchParams.set('notice', 'configuration-needed')
    return NextResponse.redirect(base)
  }

  const state = createOAuthState()
  const { verifier, challenge } = createPkcePair()
  await createSearchConsoleOAuthState({ stateHash: stateHash(state), verifier, username: session.username })
  return NextResponse.redirect(googleAuthorizationUrl({ state, challenge }))
}
