import Link from 'next/link'
import { logoutAdmin } from '@/app/admin/actions'
import { Wordmark } from '@/components/ui/Wordmark'

type AdminSection = 'overview' | 'enquiries' | 'search-console' | 'growth'

const tabs: { id: AdminSection; href: string; label: string }[] = [
  { id: 'overview', href: '/admin', label: 'Overview' },
  { id: 'enquiries', href: '/admin/enquiries', label: 'Enquiries' },
  { id: 'search-console', href: '/admin/search-console', label: 'Search Console' },
  { id: 'growth', href: '/admin/growth', label: 'Growth plan' },
]

export function AdminHeader({
  current,
  description,
  title,
  username,
}: {
  current: AdminSection
  description: string
  title: string
  username: string
}) {
  return (
    <header className="border-b border-stone-200 pb-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-5 flex items-center gap-3"><Wordmark className="[--wm:2.25rem]" /><span className="border-l border-stone-300 pl-3 text-xs font-medium text-stone-500">School operations</span></div>
          <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6a15]">
            RAAGA operations · private
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-stone-600">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-500">Signed in as {username}</span>
          <form action={logoutAdmin}>
            <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <nav aria-label="Admin dashboard" className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const selected = tab.id === current
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={selected ? 'page' : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                selected
                  ? 'bg-[#6b1f2a] text-[#f7f3ea]'
                  : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
