import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/**
 * The calendar image sent on WhatsApp when a package of classes is complete:
 * every month from the first class to the last, attended days in maroon
 * discs. Brand colours only; no photographs and no generated imagery.
 *
 * LATIN ONLY, like the link-preview card: student names are validated to
 * Latin letters at entry (see PERSON_NAME in attendance-rules.ts).
 * Satori needs every <div> with more than one child to be display:flex, so
 * every container below says so.
 */

const IVORY = '#F7F3EA'
const MAROON = '#6B1F2A'
const INK = '#221E1A'
const MUTED = '#4A423A'
const GOLD = '#C9A227'
const GOLD_TEXT = '#8C6A15'

const WIDTH = 1080
const PAD = 64
const GRID_GAP = 48

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export type CalendarMonth = {
  year: number
  month: number
  label: string
  weeks: (number | null)[][]
  attended: number[]
}

/** Every month from the first to the last class inclusive, Monday-first. */
export function calendarMonths(dates: string[]): CalendarMonth[] {
  const parsed = [...new Set(dates)]
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()
    .map((value) => {
      const [year, month, day] = value.split('-').map(Number)
      return { year, month, day }
    })
  if (!parsed.length) return []
  const first = parsed[0]
  const last = parsed[parsed.length - 1]
  const months: CalendarMonth[] = []
  let year = first.year
  let month = first.month
  while (year < last.year || (year === last.year && month <= last.month)) {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
    const cells: (number | null)[] = [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7) cells.push(null)
    const weeks: (number | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
    months.push({
      year,
      month,
      label: `${MONTH_NAMES[month - 1]} ${year}`,
      weeks,
      attended: parsed.filter((d) => d.year === year && d.month === month).map((d) => d.day),
    })
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return months
}

function longDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return `${day} ${SHORT_MONTHS[month - 1]} ${year}`
}

async function loadFonts() {
  const fonts = join(process.cwd(), 'src', 'app', '_og')
  const geistPath = join(fonts, 'geist-400.ttf')
  const [newsreader, inter, geist] = await Promise.all([
    readFile(join(fonts, 'newsreader-display-300.ttf')),
    readFile(join(fonts, 'inter-500.ttf')),
    readFile(geistPath).catch(() => null),
  ])
  const list = [
    { name: 'Newsreader', data: newsreader, weight: 300 as const, style: 'normal' as const },
    { name: 'Inter', data: inter, weight: 500 as const, style: 'normal' as const },
  ]
  // Without Geist the body falls back to Newsreader, which is still legible.
  if (geist) list.push({ name: 'Geist', data: geist, weight: 400 as never, style: 'normal' as const })
  return { list, body: geist ? 'Geist' : 'Newsreader' }
}

const HEADER_HEIGHT = 500
const FOOTER_HEIGHT = 150
const MONTH_CHROME = 128

function MonthBlock({ month, cell, body }: { month: CalendarMonth; cell: number; body: string }) {
  const disc = cell - 10
  const font = cell >= 80 ? 38 : 30
  const attended = new Set(month.attended)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: cell * 7 }}>
      <div
        style={{
          display: 'flex',
          height: 64,
          fontFamily: 'Newsreader',
          fontWeight: 300,
          fontSize: 48,
          color: INK,
        }}
      >
        {month.label}
      </div>
      <div style={{ display: 'flex', height: 56, borderBottom: `2px solid ${GOLD}` }}>
        {WEEKDAYS.map((day, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              width: cell,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: body,
              fontSize: 28,
              color: MUTED,
            }}
          >
            {day}
          </div>
        ))}
      </div>
      {month.weeks.map((week, w) => (
        <div key={w} style={{ display: 'flex', height: cell }}>
          {week.map((day, d) => (
            <div
              key={d}
              style={{ display: 'flex', width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }}
            >
              {day === null ? null : attended.has(day) ? (
                <div
                  style={{
                    display: 'flex',
                    width: disc,
                    height: disc,
                    borderRadius: disc / 2,
                    background: MAROON,
                    color: IVORY,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: body,
                    fontSize: font,
                  }}
                >
                  {day}
                </div>
              ) : (
                <div style={{ display: 'flex', fontFamily: body, fontSize: font, color: MUTED }}>{day}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export async function renderCalendarPng(input: {
  studentName: string
  packageNumber: number
  target: number
  dates: string[]
  completedOn?: string
}): Promise<Uint8Array> {
  const months = calendarMonths(input.dates)
  const single = months.length <= 1
  const cell = single ? 88 : 64
  const rows: CalendarMonth[][] = []
  const perRow = single ? 1 : 2
  for (let i = 0; i < months.length; i += perRow) rows.push(months.slice(i, i + perRow))
  const rowHeights = rows.map((row) => MONTH_CHROME + Math.max(...row.map((m) => m.weeks.length)) * cell)
  const gridHeight = rowHeights.reduce((a, b) => a + b, 0) + Math.max(0, rows.length - 1) * GRID_GAP
  const height = HEADER_HEIGHT + gridHeight + FOOTER_HEIGHT

  const { list, body } = await loadFonts()
  const complete = input.dates.length >= input.target
  const label = `${input.dates.length} of ${input.target} classes ${complete ? 'completed' : 'so far'}`
  const detail = input.completedOn
    ? `Package ${input.packageNumber}, completed on ${longDate(input.completedOn)}`
    : `Package ${input.packageNumber}`

  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: IVORY,
          color: INK,
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: 14, background: MAROON }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: HEADER_HEIGHT - 14,
            paddingTop: 44,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 44,
              letterSpacing: 16,
              color: GOLD_TEXT,
              paddingLeft: 16,
            }}
          >
            RAAGA
          </div>
          <div style={{ display: 'flex', marginTop: 12, fontFamily: body, fontSize: 28, color: MUTED }}>
            School of Indian Classical Music
          </div>
          <div style={{ display: 'flex', marginTop: 28, width: 120, height: 3, background: GOLD }} />
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              fontFamily: 'Newsreader',
              fontWeight: 300,
              fontSize: input.studentName.length > 22 ? 64 : 88,
              color: INK,
              textAlign: 'center',
              maxWidth: WIDTH - PAD * 2,
              justifyContent: 'center',
            }}
          >
            {input.studentName}
          </div>
          <div style={{ display: 'flex', marginTop: 20, fontFamily: body, fontSize: 42, color: MAROON }}>{label}</div>
          <div style={{ display: 'flex', marginTop: 14, fontFamily: body, fontSize: 30, color: MUTED }}>{detail}</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: gridHeight,
            paddingLeft: PAD,
            paddingRight: PAD,
          }}
        >
          {rows.map((row, r) => (
            <div
              key={r}
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                height: rowHeights[r],
                marginTop: r === 0 ? 0 : GRID_GAP,
              }}
            >
              {row.map((month, m) => (
                <div key={m} style={{ display: 'flex', marginLeft: m === 0 ? 0 : GRID_GAP }}>
                  <MonthBlock month={month} cell={cell} body={body} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: FOOTER_HEIGHT,
          }}
        >
          <div style={{ display: 'flex', width: 120, height: 3, background: GOLD }} />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
            <div style={{ display: 'flex', width: 36, height: 36, borderRadius: 18, background: MAROON }} />
            <div style={{ display: 'flex', marginLeft: 16, fontFamily: body, fontSize: 30, color: MUTED }}>
              Class attended
            </div>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height, fonts: list },
  )
  return new Uint8Array(await response.arrayBuffer())
}
