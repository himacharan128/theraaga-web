import assert from 'node:assert/strict'
import { MongoMemoryReplSet } from 'mongodb-memory-server-core'

async function main() {
/*
 * Data-layer tests for students, eight-class packages, attendance and the
 * completion notification rows, against a real single-node replica set so the
 * transactions and unique indexes behave as in production. No network.
 */

const WA_ENV = ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_SCHOOL_RECIPIENT'] as const
const connect = () => {
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-token'
  process.env.WHATSAPP_PHONE_NUMBER_ID = '123456'
  process.env.WHATSAPP_SCHOOL_RECIPIENT = '9848000000'
}
const disconnect = () => {
  for (const name of WA_ENV) delete process.env[name]
}

const rs = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: 'wiredTiger' },
  binary: { version: '8.0.4' },
})
process.env.MONGODB_ADMIN_URI = rs.getUri()
process.env.MONGODB_DB = 'attendance_test'
disconnect()

const store = await import('../src/data/attendance-store')
const queries = await import('../src/data/attendance-queries')
const { attendanceCollections } = await import('../src/data/attendance-db')
const { PACKAGE_TARGET, todayAtSchool } = await import('../src/lib/attendance-rules')
const c = await attendanceCollections()

async function reset() {
  await Promise.all([c.students, c.packages, c.attendance, c.notifications].map((col) => col.deleteMany({})))
  disconnect()
}

let seq = 0
const dayOffset = (n: number) => {
  const d = new Date(Date.now() - n * 86_400_000)
  return todayAtSchool(d)
}
const input = (over: Record<string, unknown> = {}) => ({
  name: `Student ${(seq += 1)}`,
  isMinor: true,
  contactName: 'Parent Name',
  whatsapp: `9199000${String(seq).padStart(5, '0')}`,
  whatsappConsent: true,
  place: 'online' as const,
  batch: undefined,
  ...over,
})
async function newStudent(over: Record<string, unknown> = {}) {
  const res = await store.createStudent(input(over) as never, 'tester')
  assert.ok(res.ok)
  return res.id
}
function ok<T extends { ok: boolean }>(res: T): Extract<T, { ok: true }> {
  assert.ok(res.ok, JSON.stringify(res))
  return res as Extract<T, { ok: true }>
}
const errorOf = (res: { ok: boolean; error?: string }) => (res.ok ? 'ok' : res.error)
async function markN(studentId: string, from: number, to: number) {
  const out = []
  for (let i = from; i <= to; i += 1) out.push(ok(await store.markAttendance(studentId, dayOffset(40 - i), 'tester')))
  return out
}
const pass = (name: string) => console.log(`pass  ${name}`)

// 1. students
{
  await reset()
  const a = await store.createStudent(input({ name: 'Anaya Rao', whatsapp: '919900000001' }) as never, 't')
  assert.ok(a.ok && a.sharedNumberWith.length === 0)
  const dup = await store.createStudent(input({ name: '  anaya   RAO ', whatsapp: '919900000001' }) as never, 't')
  assert.equal(errorOf(dup), 'duplicate_student')
  const sib = await store.createStudent(input({ name: 'Arjun Rao', whatsapp: '919900000001' }) as never, 't')
  assert.ok(sib.ok)
  assert.deepEqual(sib.sharedNumberWith, ['Anaya Rao'])
  pass('student create, duplicate rejected, sibling accepted with sharedNumberWith')
}

// 2. completion + notifications
{
  await reset()
  const id = await newStudent()
  assert.equal(errorOf(await store.markAttendance(id, dayOffset(1), 't')), 'no_active_package')
  const pkg = ok(await store.startPackage(id, 't'))
  assert.equal(pkg.number, 1)
  const results = await markN(id, 1, 8)
  results.forEach((r, i) => {
    assert.equal(r.status, 'marked')
    assert.equal(r.attended, i + 1)
    assert.equal(r.completed, i === 7)
  })
  const doc = await c.packages.findOne({ _id: pkg.packageId })
  assert.equal(doc?.status, 'completed')
  assert.equal(doc?.completion?.seq, 1)
  assert.equal(doc?.completion?.dates.length, 8)
  assert.deepEqual(doc?.completion?.dates, [...(doc?.completion?.dates ?? [])].sort())
  const notes = await c.notifications.find({ packageId: pkg.packageId }).toArray()
  assert.equal(notes.length, 2)
  const byRecipient = Object.fromEntries(notes.map((n) => [n.recipient, n]))
  assert.equal(byRecipient.student.key, `${pkg.packageId}:1:0:student`)
  assert.equal(byRecipient.school.key, `${pkg.packageId}:1:0:school`)
  assert.equal(byRecipient.student.status, 'held')
  assert.equal(byRecipient.school.status, 'held')
  assert.equal(byRecipient.school.statusNote, 'School recipient number not set')
  assert.equal(byRecipient.student.dates.length, 8)
  pass('8 classes complete the package; 2 notification rows, both held with WhatsApp unset')

  await reset()
  connect()
  const id2 = await newStudent()
  ok(await store.startPackage(id2, 't'))
  await markN(id2, 1, 8)
  const n2 = await c.notifications.find({ studentId: id2 }).toArray()
  assert.deepEqual(n2.map((n) => n.status), ['pending', 'pending'])
  assert.ok(n2.every((n) => n.nextAttemptAt instanceof Date))
  assert.equal(n2.find((n) => n.recipient === 'school')?.to, '919848000000')
  pass('WhatsApp configured: both rows pending')

  const id3 = await newStudent({ whatsappConsent: false })
  ok(await store.startPackage(id3, 't'))
  await markN(id3, 1, 8)
  const n3 = await c.notifications.find({ studentId: id3 }).toArray()
  assert.equal(n3.find((n) => n.recipient === 'student')?.status, 'skipped')
  assert.equal(n3.find((n) => n.recipient === 'school')?.status, 'pending')
  pass('no consent: student row skipped, school pending')
}

// 3. duplicates
{
  await reset()
  const id = await newStudent()
  ok(await store.startPackage(id, 't'))
  const d = dayOffset(3)
  assert.equal(ok(await store.markAttendance(id, d, 't')).status, 'marked')
  const again = ok(await store.markAttendance(id, d, 't'))
  assert.equal(again.status, 'already_marked')
  assert.equal(again.attended, 1)
  assert.equal(await c.attendance.countDocuments({ studentId: id }), 1)

  const id2 = await newStudent()
  ok(await store.startPackage(id2, 't'))
  const both = await Promise.all([store.markAttendance(id2, d, 't'), store.markAttendance(id2, d, 't')])
  assert.equal(both.filter((r) => r.ok && r.status === 'marked').length, 1)
  assert.equal(both.filter((r) => r.ok && r.status === 'already_marked').length, 1)
  assert.equal(await c.attendance.countDocuments({ studentId: id2 }), 1)
  pass('same date twice: sequential and concurrent both give exactly one mark')
}

// 4. races
{
  await reset()
  const id = await newStudent()
  const pkg = ok(await store.startPackage(id, 't'))
  await markN(id, 1, 7)
  const race = await Promise.all([
    store.markAttendance(id, dayOffset(1), 't'),
    store.markAttendance(id, dayOffset(2), 't'),
  ])
  const winners = race.filter((r) => r.ok && r.status === 'marked')
  assert.equal(winners.length, 1)
  assert.ok(winners[0].ok && winners[0].completed)
  const loser = race.find((r) => !r.ok)
  assert.ok(loser && !loser.ok && ['no_active_package', 'package_full'].includes(loser.error))
  assert.equal(await c.attendance.countDocuments({ packageId: pkg.packageId, status: 'attended' }), 8)
  assert.equal(await c.notifications.countDocuments({ packageId: pkg.packageId }), 2)
  pass('race at 7/8: exactly one completes, 8 attended, 2 notification rows')

  const id2 = await newStudent()
  const pkg2 = ok(await store.startPackage(id2, 't'))
  await markN(id2, 1, 6)
  const five = await Promise.all([1, 2, 3, 4, 5].map((n) => store.markAttendance(id2, dayOffset(n), 't')))
  assert.equal(five.filter((r) => r.ok && r.status === 'marked').length, 2)
  assert.equal(await c.attendance.countDocuments({ packageId: pkg2.packageId, status: 'attended' }), 8)
  assert.equal((await c.packages.findOne({ _id: pkg2.packageId }))?.attendedCount, 8)
  assert.equal(await c.notifications.countDocuments({ packageId: pkg2.packageId }), 2)
  pass('5 parallel dates at 6/8: final count 8, never 9')
}

// 5. dates
{
  await reset()
  const id = await newStudent()
  ok(await store.startPackage(id, 't'))
  const future = todayAtSchool(new Date(Date.now() + 3 * 86_400_000))
  assert.equal(errorOf(await store.markAttendance(id, future, 't')), 'invalid_date')
  assert.equal(errorOf(await store.markAttendance(id, '2026-02-30', 't')), 'invalid_date')
  assert.equal(await c.attendance.countDocuments({}), 0)
  await markN(id, 1, 8)
  ok(await store.startPackage(id, 't'))
  const reuse = await store.markAttendance(id, dayOffset(39), 't')
  assert.equal(errorOf(reuse), 'date_in_other_package')
  assert.match(reuse.ok ? '' : reuse.message, /package 1/)
  pass('future/invalid dates rejected; date from an earlier package rejected')
}

// 6. corrections
{
  await reset()
  const id = await newStudent()
  const pkg = ok(await store.startPackage(id, 't'))
  await markN(id, 1, 3)
  const [first] = await c.attendance.find({ packageId: pkg.packageId }).sort({ classDate: 1 }).toArray()
  const removed = ok(await store.removeAttendance(first._id, 'Marked by mistake', 't'))
  assert.equal(removed.attended, 2)
  assert.equal((await c.packages.findOne({ _id: pkg.packageId }))?.attendedCount, 2)
  assert.equal(errorOf(await store.removeAttendance(first._id, 'again', 't')), 'already_removed')
  ok(await store.markAttendance(id, first.classDate, 't')) // a removed date can be marked again
  await markN(id, 4, 8)
  const done = await c.packages.findOne({ _id: pkg.packageId })
  assert.equal(done?.status, 'completed')
  const rows = await c.attendance.find({ packageId: pkg.packageId, status: 'attended' }).sort({ classDate: 1 }).toArray()
  assert.equal(errorOf(await store.removeAttendance(rows[0]._id, 'late', 't')), 'package_completed')

  const snapshotBefore = JSON.stringify(done?.completion?.dates)
  const changed = ok(await store.changeAttendanceDate(rows[0]._id, dayOffset(100), 'Wrong day', 't'))
  assert.equal(changed.amended, true)
  const after = await c.packages.findOne({ _id: pkg.packageId })
  assert.ok(after?.amendedAt instanceof Date)
  assert.equal(JSON.stringify(after?.completion?.dates), snapshotBefore)
  assert.equal(errorOf(await store.changeAttendanceDate(rows[1]._id, rows[2].classDate, 'clash', 't')), 'duplicate_date')
  const hist = (await c.attendance.findOne({ _id: rows[0]._id }))?.history.at(-1)
  assert.equal(hist?.action, 'date_changed')
  assert.equal(hist?.from, rows[0].classDate)
  pass('remove recalculates; completed blocks remove; date change amends without touching snapshot; clash rejected')
}

// 7. reopen
{
  await reset()
  connect()
  const id = await newStudent()
  const pkg = ok(await store.startPackage(id, 't'))
  await markN(id, 1, 8)
  const before = await c.notifications.find({ packageId: pkg.packageId }).sort({ recipient: 1 }).toArray()
  const oldDates = (await c.packages.findOne({ _id: pkg.packageId }))?.completion?.dates
  ok(await store.reopenPackage(pkg.packageId, 'Miscounted', 't'))
  const reopened = await c.packages.findOne({ _id: pkg.packageId })
  assert.equal(reopened?.status, 'active')
  assert.equal(reopened?.completion, undefined)
  assert.deepEqual(reopened?.completionHistory[0].dates, oldDates)
  assert.equal(reopened?.completionHistory[0].reopenReason, 'Miscounted')
  assert.deepEqual(await c.notifications.find({ packageId: pkg.packageId }).sort({ recipient: 1 }).toArray(), before)
  assert.equal(errorOf(await store.reopenPackage(pkg.packageId, 'x again', 't')), 'not_completed')

  const [one] = await c.attendance.find({ packageId: pkg.packageId }).sort({ classDate: 1 }).toArray()
  ok(await store.removeAttendance(one._id, 'Not held', 't'))
  const re = ok(await store.markAttendance(id, one.classDate, 't'))
  assert.ok(re.completed)
  const all = await c.notifications.find({ packageId: pkg.packageId }).toArray()
  assert.equal(all.length, 4)
  const fresh = all.filter((n) => n.completionSeq === 2)
  assert.equal(fresh.length, 2)
  assert.ok(fresh.every((n) => n.status === 'held' && n.key.includes(':2:0:')))
  assert.deepEqual(all.filter((n) => n.completionSeq === 1).sort((a, b) => a.recipient.localeCompare(b.recipient)), before)
  pass('reopen keeps history and notifications; re-completion is seq 2 with held rows')

  const other = await newStudent()
  const p1 = ok(await store.startPackage(other, 't'))
  await markN(other, 1, 8)
  ok(await store.startPackage(other, 't'))
  assert.equal(errorOf(await store.reopenPackage(p1.packageId, 'late', 't')), 'newer_package_active')
  pass('reopen refused while a newer package is active')
}

// 8. renewal
{
  await reset()
  const id = await newStudent()
  const p1 = ok(await store.startPackage(id, 't'))
  assert.equal(errorOf(await store.startPackage(id, 't')), 'active_package_exists')
  await markN(id, 1, 8)
  const both = await Promise.all([store.startPackage(id, 't'), store.startPackage(id, 't')])
  assert.equal(both.filter((r) => r.ok).length, 1)
  assert.equal(both.find((r) => !r.ok && true)?.ok, false)
  const created = both.find((r) => r.ok)
  assert.ok(created?.ok && created.number === 2)
  assert.equal(await c.packages.countDocuments({ studentId: id }), 2)
  const detail = await queries.getStudentDetail(id)
  const old = detail?.packages.find((p) => p.id === p1.packageId)
  assert.equal(old?.attendance.length, 8)
  assert.equal(old?.status, 'completed')
  assert.equal(detail?.packages[0].number, 2)
  pass('renewal: one active package; concurrent starts give exactly one; history intact')
}

// 9. inactive
{
  await reset()
  const id = await newStudent()
  ok(await store.startPackage(id, 't'))
  ok(await store.setStudentStatus(id, 'inactive', 't'))
  assert.equal(errorOf(await store.markAttendance(id, dayOffset(1), 't')), 'inactive_student')
  ok(await store.setStudentStatus(id, 'active', 't'))
  ok(await store.markAttendance(id, dayOffset(1), 't'))
  assert.equal(errorOf(await store.setStudentStatus('00000000-0000-4000-8000-000000000000', 'active', 't')), 'not_found')
  pass('inactive students cannot be marked; reactivated can')
}

// 10. corrected calendar
{
  await reset()
  const id = await newStudent()
  const pkg = ok(await store.startPackage(id, 't'))
  await markN(id, 1, 8)
  assert.equal(errorOf(await store.sendCorrectedCalendar(pkg.packageId, 't')), 'not_amended')
  const [rec] = await c.attendance.find({ packageId: pkg.packageId }).sort({ classDate: 1 }).toArray()
  ok(await store.changeAttendanceDate(rec._id, dayOffset(90), 'Typo', 't'))
  const sent = ok(await store.sendCorrectedCalendar(pkg.packageId, 't'))
  assert.equal(sent.revision, 1)
  const rows = await c.notifications.find({ packageId: pkg.packageId, revision: 1 }).toArray()
  assert.equal(rows.length, 2)
  assert.ok(rows.every((r) => r.key.includes(':1:1:') && r.dates.includes(dayOffset(90)) && r.dates.length === 8))
  assert.equal(errorOf(await store.sendCorrectedCalendar(pkg.packageId, 't')), 'not_amended')
  const img = await queries.getPackageForImage(pkg.packageId, 1)
  assert.ok(img?.dates.includes(dayOffset(90)))
  const original = await queries.getPackageForImage(pkg.packageId, 0)
  assert.ok(!original?.dates.includes(dayOffset(90)))
  pass('corrected calendar: revision 1 rows with current dates; not_amended otherwise')
}

// 11. erase
{
  await reset()
  const id = await newStudent({ name: 'Meera Iyer' })
  ok(await store.startPackage(id, 't'))
  await markN(id, 1, 8)
  assert.equal(errorOf(await store.eraseStudent(id, 'Someone Else')), 'name_mismatch')
  assert.equal(await c.students.countDocuments({}), 1)
  ok(await store.eraseStudent(id, ' meera  iyer '))
  for (const col of [c.students, c.packages, c.attendance, c.notifications]) {
    assert.equal(await col.countDocuments({}), 0)
  }
  assert.equal(errorOf(await store.eraseStudent(id, 'Meera Iyer')), 'not_found')
  pass('erase: name mismatch refused; correct name removes everything')
}

// 12. queries
{
  await reset()
  const a = await newStudent({ name: 'Zara Khan', whatsapp: '919812345678', contactName: 'Imran Khan' })
  const b = await newStudent({ name: 'Anaya Rao', whatsapp: '919800011122' })
  const d = await newStudent({ name: 'Dormant', whatsapp: '919800099900' })
  ok(await store.setStudentStatus(d, 'inactive', 't'))
  const pa = ok(await store.startPackage(a, 't'))
  await markN(a, 1, 6)
  ok(await store.markAttendance(a, todayAtSchool(), 't'))
  const pb = ok(await store.startPackage(b, 't'))
  await markN(b, 1, 8)

  const all = await queries.listStudents({})
  assert.deepEqual(all.map((s) => s.name), ['Anaya Rao', 'Dormant', 'Zara Khan'])
  assert.deepEqual((await queries.listStudents({ q: 'zara' })).map((s) => s.name), ['Zara Khan'])
  assert.deepEqual((await queries.listStudents({ q: 'imran' })).map((s) => s.name), ['Zara Khan'])
  assert.deepEqual((await queries.listStudents({ q: '98123 456' })).map((s) => s.name), ['Zara Khan'])
  assert.deepEqual((await queries.listStudents({ q: '+91 9800011' })).map((s) => s.name), ['Anaya Rao'])
  assert.deepEqual((await queries.listStudents({ status: 'inactive' })).map((s) => s.name), ['Dormant'])
  assert.deepEqual((await queries.listStudents({ q: '.*' })), [])
  const za = all.find((s) => s.id === a)
  assert.equal(za?.activePackage?.id, pa.packageId)
  assert.equal(za?.activePackage?.attended, 7)
  assert.equal(za?.activePackage?.markedToday, true)
  assert.equal(za?.activePackage?.lastClassDate, todayAtSchool())
  assert.equal(all.find((s) => s.id === b)?.activePackage, undefined)
  assert.ok(typeof all.find((s) => s.id === b)?.lastCompletedAt === 'string')

  const detail = await queries.getStudentDetail(b)
  assert.ok(detail)
  assert.equal(detail.packages[0].completion?.dates.length, 8)
  assert.equal(detail.packages[0].notifications.length, 2)
  assert.equal(typeof detail.packages[0].startedAt, 'string')
  assert.equal(await queries.getStudentDetail('not-an-id'), null)

  const summary = await queries.getAttendanceSummary()
  assert.equal(summary.activeStudents, 2)
  assert.equal(summary.activePackages, 1)
  assert.deepEqual(summary.approaching.map((s) => s.name), ['Zara Khan'])
  assert.equal(summary.recentCompletions.length, 1)
  assert.equal(summary.recentCompletions[0].studentName, 'Anaya Rao')
  assert.equal(summary.recentCompletions[0].notifications.length, 2)
  assert.equal(summary.needsAttention.length, 2)
  assert.ok(summary.needsAttention.every((n) => n.status === 'held' && n.studentName === 'Anaya Rao'))

  const image = await queries.getPackageForImage(pb.packageId)
  assert.equal(image?.studentName, 'Anaya Rao')
  assert.equal(image?.dates.length, PACKAGE_TARGET)
  assert.equal(image?.completedOn, image?.dates[image.dates.length - 1], 'completed on the last class date')
  const preview = await queries.getPackageForImage(pa.packageId)
  assert.equal(preview?.dates.length, 7)
  assert.equal(preview?.completedOn, undefined)

  const noId = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(noId)
    if (value && typeof value === 'object') {
      assert.ok(!('_id' in value), 'no _id keys')
      assert.ok(!(value instanceof Date), 'no Date objects')
      Object.values(value).forEach(noId)
    } else assert.ok(!(value instanceof Date))
  }
  noId([all, detail, summary, image, preview])
  pass('queries: search by name/contact/phone, detail, summary and image data are plain strings with no _id')
}

await rs.stop()
console.log('attendance data layer: all tests passed')
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
