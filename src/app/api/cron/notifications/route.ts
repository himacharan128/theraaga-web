import { NextResponse } from 'next/server'
import { processDueNotifications } from '@/data/notifications'


/** Daily sweep for completion messages that are due: retries after a rate limit or outage. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  const authorised = secret && request.headers.get('authorization') === `Bearer ${secret}`
  if (!authorised) return new NextResponse(null, { status: 401 })

  const { processed } = await processDueNotifications({ limit: 50 })
  return NextResponse.json({ ok: true, processed })
}
