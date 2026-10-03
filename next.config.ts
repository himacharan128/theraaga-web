import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // PPR is the default App Router behaviour under this flag in Next 16.
  // `experimental.ppr` / `experimental_ppr` were REMOVED in v16 — do not add them back.
  cacheComponents: true,

  // Lets unmatched URLs render a 404 that carries its own header and footer
  // without a root not-found.tsx, which would leak the public chrome into the
  // RSC payload of every page, admin included. See src/app/global-not-found.tsx.
  experimental: { globalNotFound: true },

  // NOTE: do NOT set `htmlLimitedBots`. `WhatsApp` is already in Next's default
  // regex, and any custom value REPLACES the default list — which would silently
  // drop Google, Bing, Twitter, LinkedIn, Slack, Discord and Facebook from
  // blocking-metadata treatment and break link previews everywhere but WhatsApp.
  // Link sharing is this site's entire go-to-market. Leave it alone.

  images: {
    // Required config in Next 16 (default is [75]).
    qualities: [75, 90],
    formats: ['image/avif', 'image/webp'],
    // Populate when a real image host is wired. `domains` is deprecated — use remotePatterns.
    remotePatterns: [],
  },

  async redirects() {
    // Sanskrit vanity URLs kept alive for print, Instagram bios and QR codes.
    // English slugs are canonical — see plan §5.
    return [
      { source: '/nada', destination: '/', permanent: true },
      { source: '/parampara', destination: '/about', permanent: true },
      { source: '/sadhana', destination: '/learning', permanent: true },
      { source: '/guru', destination: '/gurus', permanent: true },
      { source: '/guru-parampara', destination: '/gurus', permanent: true },
      { source: '/anubhava', destination: '/gallery', permanent: true },
      { source: '/prarambha', destination: '/contact', permanent: true },
      { source: '/prarambham', destination: '/contact', permanent: true },

      // Renamed to the client's own IA labels: Teachers -> The Gurus,
      // Courses -> Learning. Both were live for hours, not months, but the
      // redirects cost nothing and any forwarded link keeps working.
      { source: '/teachers', destination: '/gurus', permanent: true },
      { source: '/courses', destination: '/learning', permanent: true },
      { source: '/communities', destination: '/contact', permanent: true },
      { source: '/sabha', destination: '/events', permanent: true },
      { source: '/manana', destination: '/journal', permanent: true },

      // Retired: it shared the homepage's <title> and competed with it in search.
      { source: '/carnatic-vocal-classes-hyderabad', destination: '/', permanent: true },
    ]
  },

  async headers() {
    // Uncontroversial headers only. Strict CSP is deliberately deferred:
    // `experimental.sri` is still experimental and covers scripts only, so a
    // `style-src 'self'` policy would break next/image and inlined critical CSS.
    // Add CSP post-launch in Report-Only. See plan §12.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          // HSTS `preload` is intentionally withheld until theraaga.in WHOIS clears.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ]
  },
}

export default nextConfig
