'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  clearAdminSession,
  createAdminSession,
  isAdminConfigured,
  requireAdmin,
  validateAdminCredentials,
} from '@/lib/admin-auth'
import { clearLoginAttempts, recordLoginAttempt } from '@/data/admin-login-attempts'
// Aliased: this file exports a Server Action with the same name.
import { LEAD_STATUSES, deleteLead as eraseLead, setLeadStatus } from '@/data/admin-dashboard'

export type AdminLoginState = { error?: string }

export async function loginAdmin(
  _previous: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!isAdminConfigured()) {
    return { error: 'Admin access is not configured yet.' }
  }

  const requestHeaders = await headers()
  const ip =
    requestHeaders.get('x-vercel-forwarded-for') ??
    requestHeaders.get('x-real-ip') ??
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'local'

  if (await recordLoginAttempt(ip)) {
    return { error: 'Too many attempts. Please wait fifteen minutes and try again.' }
  }

  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')
  const valid = await validateAdminCredentials(username, password)
  if (!valid) return { error: 'The username or password is not correct.' }

  await clearLoginAttempts(ip)
  await createAdminSession(username.trim())
  redirect('/admin')
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession()
  redirect('/admin/login')
}

const LEAD_ID = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i

export async function updateLeadStatus(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!LEAD_ID.test(id)) return
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) return

  await setLeadStatus(id, status as (typeof LEAD_STATUSES)[number])
  revalidatePath('/admin')
  revalidatePath('/admin/enquiries')
}

export async function deleteLead(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!LEAD_ID.test(id)) return

  await eraseLead(id)
  revalidatePath('/admin')
  revalidatePath('/admin/enquiries')
}
