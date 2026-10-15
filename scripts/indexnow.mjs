// Usage: node scripts/indexnow.mjs [https://theraaga.in]
//
// Tells Bing (and the other IndexNow engines) that every URL in the live
// sitemap may have changed, so they recrawl now instead of on their own
// schedule. Bing's index feeds Copilot and ChatGPT search, which is why this
// is worth one command after each production deploy.
//
// The key is public by design: IndexNow proves ownership by fetching
// /<key>.txt from the site, so the file must stay in /public.
import { readdirSync } from 'node:fs'

const origin = new URL(process.argv[2] || 'https://theraaga.in')
if (origin.protocol !== 'https:' || origin.pathname !== '/') {
  throw new Error('Supply the live HTTPS origin, without a path.')
}

const keyFile = readdirSync(new URL('../public/', import.meta.url)).find((name) => /^[0-9a-f]{32}\.txt$/.test(name))
if (!keyFile) throw new Error('No IndexNow key file found in public/.')
const key = keyFile.replace(/\.txt$/, '')

const keyLive = await fetch(new URL(keyFile, origin))
if (!keyLive.ok || (await keyLive.text()).trim() !== key) {
  throw new Error(`${origin.host}/${keyFile} does not serve the key yet. Deploy first, then run this.`)
}

const sitemap = await (await fetch(new URL('sitemap.xml', origin))).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
if (!urlList.length) throw new Error('The sitemap listed no URLs.')

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: origin.host, key, keyLocation: new URL(keyFile, origin).href, urlList }),
})

// 200 and 202 both mean accepted; anything else is worth reading.
if (response.status !== 200 && response.status !== 202) {
  throw new Error(`IndexNow answered ${response.status}: ${await response.text()}`)
}
console.log(`IndexNow accepted ${urlList.length} URLs for ${origin.host} (HTTP ${response.status}).`)
