import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from './fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyMobileBar } from '@/components/layout/StickyMobileBar'
import { SectionViewTracker } from '@/components/ui/Reveal'
import { whatsappHref } from '@/lib/whatsapp'
import { site } from '@/content/seed/site'

export const metadata: Metadata = {
  metadataBase: new URL('https://theraaga.in'),
  title: {
    default:
      'RAAGA — Carnatic Vocal Classes in Hyderabad · Jubilee Hills · Hitech City · Online',
    template: '%s · RAAGA, Carnatic Music School Hyderabad',
  },
  description:
    'Carnatic vocal classes for children and adults in Hyderabad — at our Jubilee Hills and Phoenix Arena, Hitech City centres, or online. Teaching in the Guru–Shishya Parampara since 2016. First class free.',
  applicationName: site.shortName,
  // Always disambiguate: "Raaga School Of Music" (Kothapet), "Raaga Sudha Music
  // School" (Kukatpally) and raagaschool.com all already exist, and raaga.com
  // has owned the bare word since 2006.
  openGraph: {
    type: 'website',
    siteName: site.legalName,
    locale: 'en_IN',
    url: 'https://theraaga.in',
    // Front-load the locality — WhatsApp truncates at roughly two lines on mobile.
    title: 'RAAGA — Carnatic Vocal Classes, Hyderabad',
    description:
      'For children and adults. Jubilee Hills, Phoenix Arena Hitech City, or online. The first class is free.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#f7f3ea',
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
      </body>
    </html>
  )
}
