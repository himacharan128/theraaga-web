import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RAGA admin',
  description: 'Private RAGA operations dashboard.',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-shell">{children}</div>
}
