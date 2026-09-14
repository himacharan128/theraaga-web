import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { proxy } from '../src/proxy'
import { externalReferrerHost } from '../src/lib/traffic-source'
import { reportDays, changeLabel } from '../src/lib/reporting'

for (const path of ['/api/admin/search-console/connect', '/api/admin/search-console/callback']) {
  const response = proxy(new NextRequest(`https://admin.theraaga.in${path}`, { headers: { host: 'admin.theraaga.in' } }))
  assert.equal(response.headers.get('x-middleware-next'), '1', `${path} must reach its authenticated handler`)
}
const blocked = proxy(new NextRequest('https://admin.theraaga.in/api/telemetry', { headers: { host: 'admin.theraaga.in' } }))
assert.equal(blocked.status, 404)
assert.equal(externalReferrerHost('https://www.google.com/search?q=private'), 'google.com')
assert.equal(externalReferrerHost('https://theraaga.in/contact?private=value'), undefined)
assert.equal(externalReferrerHost('javascript:alert(1)'), undefined)
assert.equal(externalReferrerHost('not a url'), undefined)
assert.equal(reportDays('90'), 90)
assert.equal(reportDays('-100'), 30)
assert.equal(changeLabel(10, 0), 'No previous activity to compare')
assert.equal(changeLabel(15, 10), '+50.0% vs previous period')
console.log('Reporting regression checks passed: admin OAuth routing, private-route isolation, referrer privacy, periods and comparisons.')
