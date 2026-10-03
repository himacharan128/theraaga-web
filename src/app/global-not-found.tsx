import './globals.css'
import type { Metadata } from 'next'
import { fontVariables } from './fonts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NotFoundContent } from '@/components/layout/NotFoundContent'
import { whatsappHref } from '@/lib/whatsapp'
import { getGalleryByCategory } from '@/data/content'

export const metadata: Metadata = {
  metadataBase: new URL('https://theraaga.in'),
  title: 'Page not found',
  robots: { index: false, follow: false },
}

/**
 * The 404 for URLs that match no route at all.
 *
 * Why this is not a plain app/not-found.tsx: the root layout is deliberately
 * bare so the admin portal never inherits the public chrome. A root
 * not-found.tsx would be serialised into the RSC payload of EVERY page,
 * including /admin, shipping the marketing nav, footer and postal address to
 * the admin host and doubling that markup on every public page. This file
 * bypasses all layouts instead, so it supplies its own document and chrome.
 * (Requires experimental.globalNotFound in next.config.ts.)
 */
export default async function GlobalNotFound() {
  const hasGallery = (await getGalleryByCategory()).length > 0
  // Mirrors the (site) layout: the journal has no posts yet.
  const hasJournal = false

  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        <Header
          whatsappHref={whatsappHref('HEADER')}
          hasGallery={hasGallery}
          hasJournal={hasJournal}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          <NotFoundContent />
        </main>
        <Footer />
      </body>
    </html>
  )
}
