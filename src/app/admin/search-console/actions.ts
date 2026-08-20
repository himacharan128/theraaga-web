'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import {
  disableSearchConsoleConnection,
  setPrimarySearchConsoleConnection,
  setSearchConsoleSite,
  syncSearchConsoleConnection,
} from '@/data/search-console'

function connectionId(formData: FormData): string | undefined {
  const id = String(formData.get('id') ?? '')
  return /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id) ? id : undefined
}

function refresh(): void {
  revalidatePath('/admin/search-console')
  revalidatePath('/admin')
}

export async function syncSearchConsole(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = connectionId(formData)
  if (!id) return
  await syncSearchConsoleConnection(id)
  refresh()
}

export async function choosePrimarySearchConsoleConnection(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = connectionId(formData)
  if (!id) return
  await setPrimarySearchConsoleConnection(id)
  refresh()
}

export async function chooseSearchConsoleSite(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = connectionId(formData)
  const siteUrl = String(formData.get('siteUrl') ?? '')
  if (!id || siteUrl.length > 240) return
  await setSearchConsoleSite(id, siteUrl)
  refresh()
}

export async function removeSearchConsoleConnection(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = connectionId(formData)
  if (!id) return
  await disableSearchConsoleConnection(id)
  refresh()
}
