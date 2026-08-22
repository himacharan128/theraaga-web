import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from './fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyMobileBar } from '@/components/layout/StickyMobileBar'
import { SectionViewTracker } from '@/components/ui/Reveal'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'
import { whatsappHref } from '@/lib/whatsapp'
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
  themeColor: '#6b1f2a',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Skip to content
        </a>
        <Header whatsappHref={whatsappHref('HEADER')} />
        {/* tabIndex={-1} is what makes "Skip to content" actually work. Without
            it the browser scrolls to the anchor but leaves focus on the link, so
            the next Tab returns to the nav — the single most common way a
            correctly-marked-up skip link still fails WCAG 2.4.1 in practice. */}
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <StickyMobileBar />
        <SectionViewTracker />
        <AnalyticsTracker />
      </body>
    </html>
  )
}
