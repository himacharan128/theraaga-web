import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyMobileBar } from '@/components/layout/StickyMobileBar'
import { SectionViewTracker } from '@/components/ui/SectionViewTracker'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'
import { whatsappHref } from '@/lib/whatsapp'
import { getGalleryByCategory } from '@/data/content'

/**
 * Public site chrome. Every marketing route lives in this route group, so the
 * private admin portal (admin.theraaga.in) never renders the public nav,
 * footer, address or "Book a trial" button. The group adds no URL segment.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const hasGallery = (await getGalleryByCategory()).length > 0
  // There is no posts getter yet: the journal is a subject index with no
  // articles. Wire this to the published-posts query when the first post lands.
  const hasJournal = false

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <Header
        whatsappHref={whatsappHref('HEADER')}
        hasGallery={hasGallery}
        hasJournal={hasJournal}
      />
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
    </>
  )
}
