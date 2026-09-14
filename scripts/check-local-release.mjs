import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const base = process.env.QA_BASE_URL || 'http://localhost:3001'
const output = '/tmp/raaga-release-qa'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })
  const graphs = await page.locator('script[type="application/ld+json"]').allTextContents()
  const institute = graphs.flatMap(text => JSON.parse(text)['@graph'] ?? []).find(node => node['@id'] === 'https://theraaga.in/#institute')
  assert.equal(institute.address.postalCode, '500033')
  assert.equal(institute.geo.latitude, 17.43625)
  assert.equal(institute.geo.longitude, 78.4089167)
  const sitemap = await page.request.get(`${base}/sitemap.xml`)
  assert.ok((await sitemap.text()).includes('https://theraaga.in/getting-started'))
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/getting-started', '/music-classes/jubilee-hills', '/admin/login']) {
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
      assert.equal(response.status(), 200, path)
      assert.equal(await page.locator('h1').count(), 1, `${path}: one heading`)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}: no horizontal overflow`)
      if (path === '/getting-started') assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://theraaga.in/getting-started')
      if (path.includes('jubilee-hills')) assert.ok(await page.getByText('Road Number 24, Jawahar Colony, Venkatagiri', { exact: false }).count())
      await page.screenshot({ path: `${output}/${width}-${path.replaceAll('/', '-')}.png`, fullPage: true })
    }
  }
  await page.goto(`${base}/admin/search-console`)
  await page.waitForURL('**/admin/login')
  assert.ok(page.url().includes('/admin/login'), 'Unauthenticated dashboard must require sign-in')
  console.log('Desktop/mobile checks passed: guide, centre address, login, canonical URL, horizontal overflow and private-route authentication.')
  console.log(`Screenshots: ${output}`)
} finally { await browser.close() }
