import { NextResponse } from 'next/server'
import { getPackageForImage } from '@/data/attendance-queries'
import { getAdminSession } from '@/lib/admin-auth'
import { ID_PATTERN } from '@/lib/attendance-rules'
import { renderCalendarPng } from '@/lib/calendar-image'


/** The calendar image for a package, exactly as it is (or would be) sent on WhatsApp. */
export async function GET(request: Request, context: { params: Promise<{ packageId: string }> }) {
  if (!(await getAdminSession())) return new NextResponse(null, { status: 401 })

  const { packageId } = await context.params
  if (!ID_PATTERN.test(packageId)) return new NextResponse(null, { status: 404 })

  const revisionParam = new URL(request.url).searchParams.get('revision')
  let revision: number | undefined
  if (revisionParam !== null) {
    if (!/^\d{1,3}$/.test(revisionParam)) return new NextResponse(null, { status: 400 })
    revision = Number(revisionParam)
  }

  const view = await getPackageForImage(packageId, revision)
  if (!view) return new NextResponse(null, { status: 404 })

  const png = await renderCalendarPng({
    studentName: view.studentName,
    packageNumber: view.number,
    target: view.target,
    dates: view.dates,
    completedOn: view.completedOn,
  })
  return new NextResponse(png as BodyInit, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'private, no-store' },
  })
}
