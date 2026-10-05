import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from './fonts'
import { site } from '@/content/seed/site'

export const metadata: Metadata = {
  metadataBase: new URL('https://theraaga.in'),
  title: {
    default: 'Carnatic Music Classes in Hyderabad',
    template: '%s | RAAGA',
  },
  description:
    'RAAGA offers Carnatic music and vocal classes for children and adults in Hyderabad. Learn at Jubilee Hills, Phoenix Arena in Hitech City, or live online. Beginners welcome.',
  applicationName: site.shortName,
  category: 'education',
  // Always disambiguate: "RAAGA School Of Music" (Kothapet), "RAAGA Sudha Music
  // School" (Kukatpally) and raagaschool.com all already exist, and raaga.com
  // has owned the bare word since 2006.
  openGraph: {
    type: 'website',
    siteName: site.legalName,
    locale: 'en_IN',
    url: 'https://theraaga.in',
    // Front-load the locality — WhatsApp truncates at roughly two lines on mobile.
    title: 'RAAGA: Carnatic Music Classes in Hyderabad',
    description:
      'Carnatic vocal classes for children and adults. Jubilee Hills, Phoenix Arena in Hitech City, or live online.',
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    // Google Search requires a crawlable, square favicon at a 48 px multiple.
    // These PNGs are rendered directly from the client-supplied RAAGA veena
    // artwork; the SVG is retained for browsers that can use a vector icon.
    icon: [
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: [{ url: '/favicon-48.png', type: 'image/png', sizes: '48x48' }],
    apple: [{ url: '/favicon-192.png', type: 'image/png', sizes: '192x192' }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export const viewport: Viewport = {
  themeColor: '#834848',
  colorScheme: 'light',
}

/**
 * The root layout carries only what every surface shares: the document shell,
 * fonts and global CSS. The public site chrome (header, footer, sticky bar,
 * trackers) lives in the (site) route group, and the private admin portal sits
 * beside it with none of that chrome. Do not add chrome here.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
