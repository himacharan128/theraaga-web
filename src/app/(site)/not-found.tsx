import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/layout/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

/**
 * notFound() thrown from a public page. This boundary sits inside the (site)
 * layout, so the header and footer come from that layout, exactly once. Do not
 * add them here.
 */
export default function SiteNotFound() {
  return <NotFoundContent />
}
