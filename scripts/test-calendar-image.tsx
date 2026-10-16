import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { calendarMonths, renderCalendarPng } from '../src/lib/calendar-image'

// Month boundary: 31 Jan -> 1 Feb, both months shown with the right days.
{
  const m = calendarMonths(['2027-01-31', '2027-02-01'])
  assert.deepEqual(m.map((x) => x.label), ['January 2027', 'February 2027'])
  assert.deepEqual(m[0].attended, [31])
  assert.deepEqual(m[1].attended, [1])
}

// Year boundary.
{
  const m = calendarMonths(['2026-12-28', '2027-01-04'])
  assert.deepEqual(m.map((x) => [x.year, x.month]), [[2026, 12], [2027, 1]])
}

// Leap day.
{
  const [feb] = calendarMonths(['2028-02-29'])
  assert.equal(feb.weeks.flat().filter((d) => d !== null).length, 29)
  assert.deepEqual(feb.attended, [29])
  const [feb27] = calendarMonths(['2027-02-10'])
  assert.equal(feb27.weeks.flat().filter((d) => d !== null).length, 28)
}

// Monday-first alignment: 1 Oct 2026 is a Thursday, so three blanks first.
{
  const [oct] = calendarMonths(['2026-10-06'])
  assert.deepEqual(oct.weeks[0], [null, null, null, 1, 2, 3, 4])
  assert.ok(oct.weeks.every((w) => w.length === 7))
  assert.equal(oct.label, 'October 2026')
}

// Gap month included, input order and duplicates do not matter.
{
  const m = calendarMonths(['2026-12-02', '2026-10-06', '2026-10-06'])
  assert.deepEqual(m.map((x) => x.month), [10, 11, 12])
  assert.deepEqual(m[1].attended, [])
}
assert.deepEqual(calendarMonths([]), [])

async function main() {
  const out = process.env.CALENDAR_OUT_DIR
  const two = await renderCalendarPng({
    studentName: 'Ananya Reddy',
    packageNumber: 2,
    target: 8,
    dates: ['2026-09-21', '2026-09-24', '2026-09-28', '2026-10-01', '2026-10-05', '2026-10-08', '2026-10-12', '2026-10-15'],
    completedOn: '2026-10-15',
  })
  const three = await renderCalendarPng({
    studentName: 'Venkata Subrahmanyam Iyer',
    packageNumber: 1,
    target: 8,
    dates: ['2026-08-27', '2026-09-03', '2026-09-10', '2026-09-17', '2026-10-01', '2026-10-08', '2026-10-15', '2026-10-22'],
    completedOn: '2026-10-22',
  })
  const one = await renderCalendarPng({
    studentName: 'Meera',
    packageNumber: 3,
    target: 8,
    dates: ['2026-10-01', '2026-10-03', '2026-10-06', '2026-10-08'],
  })
  for (const [name, png] of [['two', two], ['three', three], ['one', one]] as const) {
    assert.deepEqual([...png.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${name} is a PNG`)
    assert.ok(png.byteLength < 1_000_000, `${name} stays small (${png.byteLength})`)
    if (out) writeFileSync(`${out}/calendar-${name}.png`, png)
  }

  console.log('Calendar image passed: month boundaries, leap day, Monday-first, gap months and PNG rendering.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
