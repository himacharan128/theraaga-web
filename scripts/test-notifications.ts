import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { MongoMemoryReplSet } from 'mongodb-memory-server-core'

const TOKEN = 'EAAG-test-token-do-not-leak'
const APP_SECRET = 'app-secret-for-tests'
const VERIFY = 'verify-token-for-tests'
const CRON = 'cron-secret-for-tests'

type Call = { url: string; method: string; body?: unknown }
let calls: Call[] = []
type Handler = (call: Call) => Response | Promise<Response>
let handler: Handler = () => new Response('{}', { status: 500 })
const realFetch = globalThis.fetch
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input)
  assert.ok(url.startsWith('https://graph.facebook.com/'), `unexpected host ${url}`)
  const raw = init?.body
  const call: Call = {
    url,
    method: init?.method ?? 'GET',
    body: typeof raw === 'string' ? JSON.parse(raw) : raw,
  }
  calls.push(call)
  return handler(call)
}) as typeof fetch

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const isMedia = (c: Call) => c.url.endsWith('/media')
const isMessages = (c: Call) => c.url.endsWith('/messages')
const okHandler = (call: Call) => (isMedia(call) ? json({ id: 'media-1' }) : json({ messages: [{ id: `wamid.${randomUUID()}` }] }))
const timeout = () => Object.assign(new Error('The operation timed out'), { name: 'TimeoutError' })

async function main() {
  const rs = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
    binary: { version: '8.0.4' },
  })
  process.env.MONGODB_ADMIN_URI = rs.getUri()
  process.env.MONGODB_DB = 'raaga_notifications_test'
  Object.assign(process.env, {
    WHATSAPP_ACCESS_TOKEN: TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: '123456789012345',
    WHATSAPP_SCHOOL_RECIPIENT: '9848000001',
    WHATSAPP_APP_SECRET: APP_SECRET,
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: VERIFY,
    CRON_SECRET: CRON,
  })

  const { attendanceCollections } = await import('../src/data/attendance-db')
  const { processDueNotifications, retryNotification, applyStatusEvents } = await import('../src/data/notifications')
  const cloud = await import('../src/lib/whatsapp-cloud')
  const rules = await import('../src/lib/attendance-rules')
  const c = await attendanceCollections()

  const NOW = new Date('2026-10-16T05:00:00Z')
  const DATES = ['2026-09-21', '2026-09-24', '2026-09-28', '2026-10-01', '2026-10-05', '2026-10-08', '2026-10-12', '2026-10-15']

  async function fixture(
    over: Partial<import('../src/data/attendance-db').NotificationDoc> & { consent?: boolean } = {},
  ) {
    const studentId = randomUUID()
    const packageId = randomUUID()
    await c.students.insertOne({
      _id: studentId, name: 'Ananya Reddy', nameKey: `ananya ${studentId}`, isMinor: true, contactName: 'Lakshmi Reddy',
      whatsapp: '919848012345', whatsappConsent: over.consent ?? true, place: 'jubilee-hills', status: 'active',
      createdAt: NOW, createdBy: 't', updatedAt: NOW, updatedBy: 't',
    })
    await c.packages.insertOne({
      _id: packageId, studentId, number: 1, target: 8, status: 'completed', attendedCount: 8, startedAt: NOW, startedBy: 't',
      completedAt: NOW,
      completion: { seq: 1, completedAt: NOW, completedBy: 't', dates: DATES, attendanceIds: [] },
      completionHistory: [], revision: 0, updatedAt: NOW,
    })
    const id = randomUUID()
    const recipient = over.recipient ?? 'student'
    await c.notifications.insertOne({
      _id: id, key: `${packageId}:1:0:${recipient}`, packageId, studentId, completionSeq: 1, revision: 0,
      recipient, to: recipient === 'student' ? '919848012345' : '919848000001', dates: DATES,
      status: 'pending', attempts: 0, nextAttemptAt: NOW, events: [], createdAt: NOW, updatedAt: NOW,
      ...over,
    } as never)
    return { id, studentId, packageId }
  }
  const get = async (id: string) => (await c.notifications.findOne({ _id: id }))!
  const messages = () => calls.filter(isMessages)
  const reset = (h: Handler = okHandler) => { calls = []; handler = h }

  // 1. success path: media first, then message, wamid stored.
  {
    reset(okHandler)
    const { id } = await fixture()
    const r = await processDueNotifications({ now: NOW })
    assert.deepEqual(r.results, [{ id, status: 'accepted' }])
    assert.deepEqual(calls.map((x) => (isMedia(x) ? 'media' : 'messages')), ['media', 'messages'])
    const row = await get(id)
    assert.equal(row.status, 'accepted')
    assert.match(row.wamid ?? '', /^wamid\./)
    assert.equal(row.attempts, 1)
    assert.ok(row.sentAt && !row.leaseUntil)
    type Param = { text: string }
    const body = messages()[0].body as {
      to: string
      biz_opaque_callback_data: string
      template: { name: string; components: { parameters: (Param | { type: string; image: { id: string } })[] }[] }
    }
    assert.equal(body.to, '919848012345')
    assert.equal(body.biz_opaque_callback_data, `${id}:${row.sendToken}`)
    assert.ok(row.sendToken)
    assert.equal(body.template.name, 'raaga_package_complete')
    assert.deepEqual(body.template.components[0].parameters[0], { type: 'image', image: { id: 'media-1' } })
    assert.deepEqual(body.template.components[1].parameters.map((p) => (p as Param).text), ['Ananya Reddy', '21 Sep 2026', '15 Oct 2026'])
    // Re-running sends nothing further.
    calls = []
    assert.equal((await processDueNotifications({ now: NOW })).processed, 0)
    assert.equal(calls.length, 0)
  }

  // 2. student ok, school refused with 131026: independent statuses.
  {
    const a = await fixture()
    const b = await fixture({ recipient: 'school' })
    let n = 0
    reset((call) => {
      if (isMedia(call)) return json({ id: 'm' })
      n += 1
      return (call.body as { to: string }).to === '919848000001'
        ? json({ error: { code: 131026, message: 'Message undeliverable' } }, 400)
        : json({ messages: [{ id: `wamid.ok${n}` }] })
    })
    await processDueNotifications({ now: NOW, packageId: a.packageId })
    await processDueNotifications({ now: NOW, packageId: b.packageId })
    assert.equal((await get(a.id)).status, 'accepted')
    const school = await get(b.id)
    assert.equal(school.status, 'failed')
    assert.equal(school.lastError?.code, 131026)
  }

  // 3. timeout on /messages: uncertain, never resent.
  let uncertainId: string
  {
    const { id } = await fixture()
    uncertainId = id
    reset((call) => { if (isMedia(call)) return json({ id: 'm' }); throw timeout() })
    await processDueNotifications({ now: NOW })
    const row = await get(id)
    assert.equal(row.status, 'uncertain')
    assert.equal(row.attempts, 1)
    reset(okHandler)
    await processDueNotifications({ now: new Date(NOW.getTime() + 86_400_000) })
    await processDueNotifications({ now: new Date(NOW.getTime() + 2 * 86_400_000) })
    assert.equal(messages().length, 0)
    assert.equal((await get(id)).status, 'uncertain')
  }

  // 4. 5xx on /media: pending with backoff, success on a later run.
  {
    const { id } = await fixture()
    reset((call) => (isMedia(call) ? json({ error: { message: 'oops' } }, 503) : okHandler(call)))
    await processDueNotifications({ now: NOW })
    const row = await get(id)
    assert.equal(row.status, 'pending')
    assert.equal(row.nextAttemptAt?.getTime(), NOW.getTime() + rules.RETRY_DELAYS_MS[0])
    assert.equal(messages().length, 0)
    reset(okHandler)
    await processDueNotifications({ now: new Date(NOW.getTime() + 30_000), packageId: row.packageId })
    assert.equal(calls.length, 0, 'not due yet')
    await processDueNotifications({ now: new Date(NOW.getTime() + 61_000), packageId: row.packageId })
    assert.equal((await get(id)).status, 'accepted')
    assert.equal((await get(id)).attempts, 2)
  }

  // 5. rate limit 130429 backs off; 5xx on /messages is ambiguous.
  {
    const { id } = await fixture()
    reset((call) => (isMedia(call) ? json({ id: 'm' }) : json({ error: { code: 130429, message: 'Rate limit hit' } }, 429)))
    await processDueNotifications({ now: NOW })
    const row = await get(id)
    assert.equal(row.status, 'pending')
    assert.ok(row.nextAttemptAt && row.nextAttemptAt > NOW)
    assert.equal(row.lastError?.code, 130429)
    const other = await fixture()
    reset((call) => (isMedia(call) ? json({ id: 'm' }) : json({ error: { message: 'boom' } }, 502)))
    await processDueNotifications({ now: NOW, packageId: other.packageId })
    assert.equal((await get(other.id)).status, 'uncertain')
  }

  // 6. 132001 (template missing) -> failed with a setup note; token never leaks.
  {
    const { id } = await fixture()
    reset((call) =>
      isMedia(call)
        ? json({ id: 'm' })
        : json({ error: { code: 132001, message: `Template does not exist (token ${TOKEN})` } }, 404),
    )
    await processDueNotifications({ now: NOW })
    const row = await get(id)
    assert.equal(row.status, 'failed')
    assert.match(row.statusNote ?? '', /^WhatsApp setup problem: /)
    assert.ok(!JSON.stringify(row).includes(TOKEN), 'token must never be stored')
  }

  // 7. retries exhausted after the schedule.
  {
    const { id } = await fixture({ attempts: rules.RETRY_DELAYS_MS.length })
    reset(() => json({ error: { message: 'down' } }, 500))
    await processDueNotifications({ now: NOW })
    assert.equal((await get(id)).status, 'failed')
  }

  // 8. expired lease -> uncertain, not resent.
  {
    const { id, packageId } = await fixture({ status: 'sending', attempts: 1, leaseUntil: new Date(NOW.getTime() - 1000), nextAttemptAt: undefined })
    reset(okHandler)
    const r = await processDueNotifications({ now: NOW, packageId })
    assert.deepEqual(r.results, [{ id, status: 'uncertain' }])
    assert.equal(calls.length, 0)
    assert.match((await get(id)).statusNote ?? '', /interrupted/)
    // A live lease is left alone.
    const live = await fixture({ status: 'sending', attempts: 1, leaseUntil: new Date(NOW.getTime() + 60_000) })
    await processDueNotifications({ now: NOW, packageId: live.packageId })
    assert.equal((await get(live.id)).status, 'sending')
  }

  // 9. two concurrent runs send each row once.
  {
    const rows = [await fixture(), await fixture(), await fixture()]
    reset(async (call) => {
      await new Promise((r) => setTimeout(r, 20))
      return okHandler(call)
    })
    const [r1, r2] = await Promise.all([
      processDueNotifications({ now: NOW, limit: 200 }),
      processDueNotifications({ now: NOW, limit: 200 }),
    ])
    const sentTo = messages().length
    assert.equal(sentTo, rows.length, 'one /messages call per row')
    assert.equal(r1.processed + r2.processed, rows.length)
    for (const row of rows) assert.equal((await get(row.id)).attempts, 1)
  }

  // 10. older than 72h -> failed with no network.
  {
    const old = new Date(NOW.getTime() - rules.AUTO_SEND_WINDOW_MS - 1000)
    const { id } = await fixture({ createdAt: old })
    reset(okHandler)
    await processDueNotifications({ now: NOW })
    assert.equal(calls.length, 0)
    const row = await get(id)
    assert.equal(row.status, 'failed')
    assert.match(row.statusNote ?? '', /72 hours/)
  }

  // 11. erased student -> failed, no network.
  {
    const { id, studentId } = await fixture()
    await c.students.deleteOne({ _id: studentId })
    reset(okHandler)
    await processDueNotifications({ now: NOW })
    assert.equal(calls.length, 0)
    assert.equal((await get(id)).status, 'failed')
  }

  // 12. retryNotification rules.
  {
    reset(okHandler)
    assert.deepEqual(await retryNotification(randomUUID(), 'admin'), { ok: false, error: 'not_found', message: 'That message was not found.' })
    const unc = await retryNotification(uncertainId, 'admin')
    assert.equal(unc.ok === false && unc.error, 'confirm_required')
    assert.equal((await get(uncertainId)).status, 'uncertain')
    const yes = await retryNotification(uncertainId, 'admin', { confirmUncertain: true })
    assert.equal(yes.ok, true)
    const row = await get(uncertainId)
    assert.equal(row.status, 'pending')
    assert.equal(row.manualBy, 'admin')
    assert.equal(row.attempts, 0)
    const sendNow = await processDueNotifications({ packageId: row.packageId, now: new Date(Date.now() + 1000) })
    assert.equal(sendNow.results[0]?.status, 'accepted')

    const done = await retryNotification(uncertainId, 'admin')
    assert.equal(done.ok === false && done.error, 'not_retryable')

    const held = await fixture({ status: 'held', statusNote: 'WhatsApp is not connected yet', nextAttemptAt: undefined })
    assert.equal((await retryNotification(held.id, 'admin')).ok, true)
    assert.equal((await get(held.id)).status, 'pending')

    // skipped: only with consent now.
    const skipped = await fixture({ status: 'skipped', consent: false, nextAttemptAt: undefined })
    const noConsent = await retryNotification(skipped.id, 'admin')
    assert.equal(noConsent.ok === false && noConsent.error, 'not_retryable')
    await c.students.updateOne({ _id: skipped.studentId }, { $set: { whatsappConsent: true, whatsapp: '919000000000' } })
    assert.equal((await retryNotification(skipped.id, 'admin')).ok, true)
    assert.equal((await get(skipped.id)).to, '919000000000', 'refreshed from the current student number')

    // A manual retry of an old row is not killed by the 72 hour window.
    const old = await fixture({ status: 'failed', createdAt: new Date(NOW.getTime() - 10 * 86_400_000), nextAttemptAt: undefined })
    assert.equal((await retryNotification(old.id, 'admin')).ok, true)
    reset(okHandler)
    await processDueNotifications({ packageId: old.packageId, now: new Date(Date.now() + 1000) })
    assert.equal((await get(old.id)).status, 'accepted')

    // Not configured.
    const spare = await fixture({ status: 'held', nextAttemptAt: undefined })
    const saved = process.env.WHATSAPP_ACCESS_TOKEN
    delete process.env.WHATSAPP_ACCESS_TOKEN
    const nc = await retryNotification(spare.id, 'admin')
    assert.equal(nc.ok === false && nc.error, 'not_configured')
    assert.equal((await get(spare.id)).status, 'held')
    process.env.WHATSAPP_ACCESS_TOKEN = saved
  }

  // 13. status events.
  {
    const t = (s: number) => new Date(NOW.getTime() + s * 1000)
    const mk = async () => {
      const r = await fixture({ status: 'accepted', wamid: `wamid.${randomUUID()}`, attempts: 1, nextAttemptAt: undefined })
      return { ...r, wamid: (await get(r.id)).wamid! }
    }
    const ev = (wamid: string, status: string, s: number, extra = {}) => ({ wamid, status, at: t(s), ...extra })

    const a = await mk()
    assert.equal(await applyStatusEvents([ev(a.wamid, 'sent', 1)]), 1)
    assert.equal(await applyStatusEvents([ev(a.wamid, 'sent', 1)]), 0, 'duplicate ignored')
    assert.equal((await get(a.id)).events.length, 1)
    // out of order: read before delivered, then delivered must not downgrade.
    await applyStatusEvents([ev(a.wamid, 'read', 5)])
    await applyStatusEvents([ev(a.wamid, 'delivered', 3)])
    const row = await get(a.id)
    assert.equal(row.status, 'read')
    assert.equal(row.events.length, 3)
    // failed after delivered is ignored.
    await applyStatusEvents([ev(a.wamid, 'failed', 9, { errorCode: 131026, errorTitle: 'x' })])
    assert.equal((await get(a.id)).status, 'read')

    // a batch arriving out of order in one call is sorted.
    const b = await mk()
    await applyStatusEvents([ev(b.wamid, 'delivered', 4), ev(b.wamid, 'sent', 2)])
    assert.equal((await get(b.id)).status, 'delivered')

    // failed before delivery applies and records the code.
    const f = await mk()
    await applyStatusEvents([ev(f.wamid, 'failed', 2, { errorCode: 131026, errorTitle: 'Undeliverable' })])
    const failed = await get(f.id)
    assert.equal(failed.status, 'failed')
    assert.equal(failed.lastError?.code, 131026)
    await applyStatusEvents([ev(f.wamid, 'sent', 3)])
    assert.equal((await get(f.id)).status, 'failed', 'a late sent does not revive a failure')

    // resolve an uncertain row through callbackData.
    const u = await fixture({ status: 'uncertain', statusNote: 'check', attempts: 1, nextAttemptAt: undefined, sendToken: 'tok-u' })
    const w = `wamid.${randomUUID()}`
    assert.equal(await applyStatusEvents([ev(w, 'delivered', 2, { callbackData: `${u.id}:tok-u` })]), 1)
    const resolved = await get(u.id)
    assert.equal(resolved.status, 'delivered')
    assert.equal(resolved.wamid, w)
    assert.equal(resolved.statusNote, undefined)
    // junk callbackData and unknown wamids do nothing.
    assert.equal(await applyStatusEvents([ev('wamid.unknown', 'sent', 1, { callbackData: 'not-an-id' })]), 0)
    assert.equal(await applyStatusEvents([ev('wamid.unknown2', 'sent', 1, { callbackData: randomUUID() })]), 0)
    // a pending row is never taken over by a callbackData match.
    const p = await fixture()
    assert.equal(await applyStatusEvents([ev('wamid.x', 'sent', 1, { callbackData: p.id })]), 0)
    assert.equal((await get(p.id)).status, 'pending')

    // events capped at 20.
    const cap = await mk()
    await applyStatusEvents(Array.from({ length: 25 }, (_, i) => ev(cap.wamid, i % 2 ? 'sent' : 'read', i + 1)))
    assert.equal((await get(cap.id)).events.length, 20)
  }

  // 13b. regressions from QA.
  {
    // (a) a slow worker's in-flight row is not stolen by a second worker.
    const slow = await fixture()
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => { release = resolve })
    reset(async (call) => {
      if (isMedia(call)) return json({ id: 'm' })
      await gate
      return json({ messages: [{ id: 'wamid.slow' }] })
    })
    const a = processDueNotifications({ now: NOW, packageId: slow.packageId })
    for (let i = 0; i < 200 && messages().length === 0; i += 1) await new Promise((r) => setTimeout(r, 10))
    assert.equal(messages().length, 1, 'worker A is mid-send')
    const b = await processDueNotifications({ now: new Date(Date.now() + 60_000), packageId: slow.packageId })
    assert.deepEqual(b.results, [], 'worker B leaves the in-flight row alone')
    assert.equal((await get(slow.id)).status, 'sending')
    release()
    await a
    const done = await get(slow.id)
    assert.equal(done.status, 'accepted')
    assert.equal(done.wamid, 'wamid.slow')
    assert.equal(messages().length, 1)

    // (b) consent withdrawn or number changed after queueing: nothing is sent.
    const withdrawn = await fixture()
    await c.students.updateOne({ _id: withdrawn.studentId }, { $set: { whatsappConsent: false } })
    reset(okHandler)
    await processDueNotifications({ now: NOW, packageId: withdrawn.packageId })
    assert.equal((await get(withdrawn.id)).status, 'skipped')
    const moved = await fixture()
    await c.students.updateOne({ _id: moved.studentId }, { $set: { whatsapp: '919111111111' } })
    await processDueNotifications({ now: NOW, packageId: moved.packageId })
    assert.equal((await get(moved.id)).status, 'held')
    assert.equal(calls.length, 0, 'no fetch for either')

    // (c) a 500 on /messages is ambiguous even when it carries a retryable code.
    const odd = await fixture()
    reset((call) => (isMedia(call) ? json({ id: 'm' }) : json({ error: { code: 131000, message: 'Something went wrong' } }, 500)))
    await processDueNotifications({ now: NOW, packageId: odd.packageId })
    assert.equal((await get(odd.id)).status, 'uncertain')
    await processDueNotifications({ now: new Date(Date.now() + 86_400_000), packageId: odd.packageId })
    assert.equal(messages().length, 1, 'never resent')

    // (d) a receipt for an earlier attempt cannot attach to a retried row.
    const stale = await fixture({ status: 'uncertain', attempts: 1, nextAttemptAt: undefined, sendToken: 'old-token' })
    assert.equal((await retryNotification(stale.id, 'admin', { confirmUncertain: true })).ok, true)
    reset((call) => (isMedia(call) ? json({ id: 'm' }) : json({ error: { message: 'bad gateway' } }, 502)))
    await processDueNotifications({ now: new Date(Date.now() + 1000), packageId: stale.packageId })
    const again = await get(stale.id)
    assert.equal(again.status, 'uncertain')
    assert.ok(again.sendToken && again.sendToken !== 'old-token')
    const receipt = (callbackData: string) => ({ wamid: 'wamid.late', status: 'delivered', at: new Date(NOW.getTime() + 5000), callbackData })
    assert.equal(await applyStatusEvents([receipt(`${stale.id}:old-token`)]), 0)
    assert.equal(await applyStatusEvents([receipt(stale.id)]), 0)
    assert.equal((await get(stale.id)).wamid, undefined)
    assert.equal(await applyStatusEvents([receipt(`${stale.id}:${again.sendToken}`)]), 1)
    const attached = await get(stale.id)
    assert.equal(attached.status, 'delivered')
    assert.equal(attached.wamid, 'wamid.late')
  }

  // 14. signature + parsing.
  {
    const body = '{"a":1}'
    const sig = `sha256=${createHmac('sha256', APP_SECRET).update(body).digest('hex')}`
    assert.equal(cloud.verifyWebhookSignature(body, sig, APP_SECRET), true)
    assert.equal(cloud.verifyWebhookSignature(body + ' ', sig, APP_SECRET), false)
    assert.equal(cloud.verifyWebhookSignature(body, sig, 'other'), false)
    assert.equal(cloud.verifyWebhookSignature(body, null, APP_SECRET), false)
    assert.equal(cloud.verifyWebhookSignature(body, 'sha256=zz', APP_SECRET), false)
    assert.equal(cloud.verifyWebhookSignature(body, sig.replace('sha256=', ''), APP_SECRET), false)
    assert.equal(cloud.verifyWebhookSignature(body, 'sha256=' + 'a'.repeat(63), APP_SECRET), false)

    const payload = (statuses: unknown[], field = 'messages') => ({ entry: [{ changes: [{ field, value: { statuses } }] }] })
    const parsed = cloud.parseStatusWebhook(
      payload([
        { id: 'w1', status: 'delivered', timestamp: '1760590000', recipient_id: '919848012345', biz_opaque_callback_data: 'cb' },
        { id: 'w2', status: 'failed', timestamp: '1760590001', errors: [{ code: 131026, title: 'Undeliverable' }] },
        { id: 'w3', status: 'played', timestamp: '1760590002' },
        { id: 'w4', status: 'sent', timestamp: 'junk' },
        { status: 'sent', timestamp: '1760590003' },
        'junk',
      ]),
    )
    assert.equal(parsed.length, 2)
    assert.equal(parsed[0].callbackData, 'cb')
    assert.equal(parsed[0].at.getTime(), 1760590000_000)
    assert.equal(parsed[1].errorCode, 131026)
    assert.equal(parsed[1].errorTitle, 'Undeliverable')
    for (const junk of [null, 5, 'x', [], {}, { entry: 'x' }, { entry: [null, { changes: 'x' }, { changes: [{ field: 'other', value: {} }] }] }, payload([{ id: 'a', status: 'sent', timestamp: '1' }], 'account_update')]) {
      assert.deepEqual(cloud.parseStatusWebhook(junk), [], JSON.stringify(junk))
    }
    assert.deepEqual(cloud.completionMessageParams('  Ananya  Reddy ', 1, ['2026-10-15', '2026-09-21']), ['Ananya Reddy', '21 Sep 2026', '15 Oct 2026'])

    const ready = cloud.whatsAppReadiness()
    assert.deepEqual(ready, { configured: true, schoolRecipient: '919848000001', missing: [] })
  }

  // 15. routes.
  {
    const webhook = await import('../src/app/api/whatsapp/webhook/route')
    const cron = await import('../src/app/api/cron/notifications/route')
    const url = 'https://theraaga.in/api/whatsapp/webhook'

    const ok = await webhook.GET(new Request(`${url}?hub.mode=subscribe&hub.verify_token=${VERIFY}&hub.challenge=12345`))
    assert.equal(ok.status, 200)
    assert.equal(await ok.text(), '12345')
    assert.equal((await webhook.GET(new Request(`${url}?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=1`))).status, 403)
    assert.equal((await webhook.GET(new Request(`${url}?hub.mode=other&hub.verify_token=${VERIFY}&hub.challenge=1`))).status, 403)
    assert.equal((await webhook.GET(new Request(url))).status, 403)

    const r = await fixture({ status: 'accepted', wamid: 'wamid.route', attempts: 1, nextAttemptAt: undefined })
    const raw = JSON.stringify({
      entry: [{ changes: [{ field: 'messages', value: { statuses: [{ id: 'wamid.route', status: 'delivered', timestamp: '1760590000' }] } }] }],
    })
    const sign = (s: string) => `sha256=${createHmac('sha256', APP_SECRET).update(s).digest('hex')}`
    const post = (body: string, sig: string | null) =>
      webhook.POST(new Request(url, { method: 'POST', body, headers: sig ? { 'x-hub-signature-256': sig } : {} }))

    assert.equal((await post(raw, 'sha256=' + '0'.repeat(64))).status, 401)
    assert.equal((await post(raw, null)).status, 401)
    assert.equal((await get(r.id)).status, 'accepted')
    const good = await post(raw, sign(raw))
    assert.equal(good.status, 200)
    assert.equal((await get(r.id)).status, 'delivered')
    assert.equal((await post('not json', sign('not json'))).status, 400)
    const big = 'x'.repeat(1_000_001)
    assert.equal((await post(big, sign(big))).status, 413)
    const saved = process.env.WHATSAPP_APP_SECRET
    delete process.env.WHATSAPP_APP_SECRET
    assert.equal((await post(raw, sign(raw))).status, 503)
    process.env.WHATSAPP_APP_SECRET = saved

    const cronUrl = 'https://theraaga.in/api/cron/notifications'
    assert.equal((await cron.GET(new Request(cronUrl))).status, 401)
    assert.equal((await cron.GET(new Request(cronUrl, { headers: { authorization: 'Bearer wrong' } }))).status, 401)
    reset(okHandler)
    const due = await fixture()
    const swept = await cron.GET(new Request(cronUrl, { headers: { authorization: `Bearer ${CRON}` } }))
    assert.equal(swept.status, 200)
    assert.equal((await get(due.id)).status, 'accepted')
  }

  assert.ok(!calls.some((x) => x.url.includes('undefined')), 'no malformed urls')
  globalThis.fetch = realFetch
  const { getAdminClient } = await import('../src/data/admin-mongo')
  await (await getAdminClient()).close()
  await rs.stop()
  console.log('Notifications passed: send path, uncertain and lease handling, backoff, concurrency, retries, receipts, signatures and routes.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
