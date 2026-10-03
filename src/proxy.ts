import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_HOST = 'admin.theraaga.in'

function hostOf(request: NextRequest): string {
  return (request.headers.get('host') ?? '').toLowerCase().split(':')[0]
}

function isAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/favicon-') ||
    pathname === '/icon.svg' ||
    pathname.startsWith('/brand/')
  )
}

/**
 * Vercel sends both theraaga.in and admin.theraaga.in to this deployment. The
 * subdomain is a separate private surface: its root resolves to /admin and no
 * public marketing route is rendered on it. The public chrome belongs to the
 * (site) route group, so /admin renders under the bare root layout without it.
 * Authorization is still enforced again inside each admin Server Component/
 * Server Action.
 */
export function proxy(request: NextRequest) {
  const host = hostOf(request)
  const pathname = request.nextUrl.pathname
  const local = host === 'localhost' || host === '127.0.0.1'

  if (host === ADMIN_HOST) {
    if (pathname === '/robots.txt') {
      return new NextResponse('User-agent: *\nDisallow: /\n', {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      })
    }
    if (isAsset(pathname) || pathname.startsWith('/admin') ||
      pathname === '/api/admin/search-console/connect' ||
      pathname === '/api/admin/search-console/callback') return NextResponse.next()
    if (pathname.startsWith('/api/')) return new NextResponse(null, { status: 404 })
    return NextResponse.rewrite(new URL('/admin', request.url))
  }

  // Keep the private route off the public site. Local development intentionally
  // keeps /admin available without needing a hosts-file entry for the subdomain.
  if (!local && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url), 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
