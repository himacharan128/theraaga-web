import { NextResponse } from 'next/server'
import { syncPrimarySearchConsoleConnection } from '@/data/search-console'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  const authorised = secret && request.headers.get('authorization') === `Bearer ${secret}`
  if (!authorised) return new NextResponse(null, { status: 401 })

  await syncPrimarySearchConsoleConnection()
  return NextResponse.json({ ok: true })
}
