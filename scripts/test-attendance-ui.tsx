import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EmptyState, NotificationChip, ProgressBar, ProgressPill } from '../src/components/admin/attendance/Parts'
import { NOTIFICATION_LABELS, formatClassDate } from '../src/components/admin/attendance/format'
import { NOTIFICATION_STATUSES } from '../src/lib/attendance-rules'

const pill = renderToStaticMarkup(createElement(ProgressPill, { attended: 5, target: 8 }))
assert.match(pill, />5\/8</)
assert.match(pill, /aria-label="5 of 8 classes"/)
assert.match(renderToStaticMarkup(createElement(ProgressPill, { attended: 12, target: 8 })), />8\/8</)

const bar = renderToStaticMarkup(createElement(ProgressBar, { attended: 2, target: 8 }))
assert.match(bar, /role="progressbar"/)
assert.match(bar, /aria-valuenow="2"/)
assert.match(bar, /width:25%/)

assert.equal(Object.keys(NOTIFICATION_LABELS).length, NOTIFICATION_STATUSES.length)
const labels: Record<string, string> = {
  held: 'Held',
  skipped: 'Not sent: no consent',
  pending: 'Waiting to send',
  uncertain: 'Check WhatsApp',
  accepted: 'Accepted by WhatsApp',
}
for (const [status, label] of Object.entries(labels)) {
  assert.match(renderToStaticMarkup(createElement(NotificationChip, { status: status as never })), new RegExp(label))
}
assert.match(renderToStaticMarkup(createElement(NotificationChip, { status: 'read', recipient: 'school' })), /School: Read/)

const empty = renderToStaticMarkup(createElement(EmptyState, { title: 'No students yet' }, 'Add one.'))
assert.match(empty, /No students yet/)
assert.match(empty, /Add one\./)

assert.equal(formatClassDate('2026-10-06'), '6 Oct 2026')
for (const text of [pill, bar, empty]) assert.doesNotMatch(text, /[–—]/)
console.log('attendance ui ok')
