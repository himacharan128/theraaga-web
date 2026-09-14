import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { exchangeAuthorizationCode, stateHash } from '@/lib/google-search-console'
import {
  connectSearchConsoleAccount,
  consumeSearchConsoleOAuthState,
  syncSearchConsoleConnection,
} from '@/data/search-console'

function destination(request: Request, notice: string): URL {
  const url = new URL('/admin/search-console', request.url)
  url.searchParams.set('notice', notice)
  return url
}

export async function GET(request: Request) {
  const session = await requireAdmin()
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const googleError = url.searchParams.get('error')
  if (googleError || !code || !state) return NextResponse.redirect(destination(request, 'connection-cancelled'))

  try {
    const verifier = await consumeSearchConsoleOAuthState(stateHash(state), session.username)
    if (!verifier) return NextResponse.redirect(destination(request, 'connection-expired'))
    const refreshToken = await exchangeAuthorizationCode(code, verifier)
    const connection = await connectSearchConsoleAccount({ refreshToken, username: session.username })
    await syncSearchConsoleConnection(connection.id)
    return NextResponse.redirect(destination(request, 'connection-complete'))
  } catch {
    return NextResponse.redirect(destination(request, 'connection-failed'))
  }
}
