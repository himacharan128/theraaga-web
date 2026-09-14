import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'RAAGA admin',
  description: 'Private RAAGA operations dashboard.',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-shell">{children}</div>
}
