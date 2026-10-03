import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'RAAGA admin',
  description: 'Private RAAGA operations dashboard.',
  robots: { index: false, follow: false, nocache: true },
  // Opt out of the public site's social card: nothing on this surface is shared.
  openGraph: null,
  twitter: null,
}

// The admin portal sits directly under the bare root layout, with none of the
// public site chrome. This layout owns the single <main> landmark, so admin
// pages must not render their own.
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-shell">
      <main id="main">{children}</main>
    </div>
  )
}
