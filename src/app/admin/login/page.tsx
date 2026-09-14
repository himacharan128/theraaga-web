import { Suspense } from 'react'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

function LoadingLogin() {
  return <section className="min-h-dvh bg-[#201b1a]" aria-label="Loading admin sign-in" />
}

async function AdminLoginContent() {
  // Cache Components can prerender public routes. Authentication must wait for
  // an incoming request, never for the build-time cookie jar.
  await connection()
  if (await getAdminSession()) redirect('/admin')

  return (
    <section className="flex min-h-dvh items-center justify-center bg-[#201b1a] px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#f7f3ea] p-7 shadow-2xl sm:p-10">
        <p className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6a15]">
          RAAGA operations
        </p>
        <h1 className="mt-3 text-4xl font-light text-[#201b1a]">Admin dashboard</h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Sign in to manage enquiries, review traffic and see how people find RAAGA.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </section>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingLogin />}>
      <AdminLoginContent />
    </Suspense>
  )
}
