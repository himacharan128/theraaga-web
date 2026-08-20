'use client'

import { useActionState } from 'react'
import { loginAdmin, type AdminLoginState } from '@/app/admin/actions'

const initialState: AdminLoginState = {}

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState)

  return (
    <form action={action} className="grid gap-5" noValidate>
      <div>
        <label htmlFor="admin-username" className="mb-2 block text-sm font-medium text-stone-800">
          Username
        </label>
        <input
          id="admin-username"
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-[#6b1f2a] focus:ring-4 focus:ring-[#6b1f2a]/10"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-stone-800">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-[#6b1f2a] focus:ring-4 focus:ring-[#6b1f2a]/10"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl border border-[#6b1f2a]/25 bg-[#6b1f2a]/5 px-4 py-3 text-sm text-[#6b1f2a]">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#6b1f2a] px-5 font-medium text-[#f7f3ea] transition hover:bg-[#5c1a20] disabled:cursor-wait disabled:opacity-65"
      >
        {pending ? 'Signing in…' : 'Open dashboard'}
      </button>
    </form>
  )
}
