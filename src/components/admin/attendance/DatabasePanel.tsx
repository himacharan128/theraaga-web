import { logoutAdmin } from '@/app/admin/actions'

export function DatabasePanel() {
  return (
    <section className="min-h-dvh bg-stone-100 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-stone-800">
        <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6a15]">RAAGA operations</p>
        <h1 className="mt-3 text-3xl font-light">Connect the admin database</h1>
        <p className="mt-4 leading-7 text-stone-600">
          Sign-in is working, but the admin database has not been connected yet. Add the separate <code>MONGODB_ADMIN_URI</code>{' '}
          server environment variable in Vercel, then redeploy. Student records need it.
        </p>
        <form action={logoutAdmin} className="mt-8">
          <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">Sign out</button>
        </form>
      </div>
    </section>
  )
}
