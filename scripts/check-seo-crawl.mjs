// Usage: node scripts/check-seo-crawl.mjs [http://localhost:3002]
// Requests are read-only. Canonicals stay on the public domain during local QA.
const base = new URL(process.argv[2] || process.env.QA_BASE_URL || 'http://localhost:3002')
if (!['http:', 'https:'].includes(base.protocol) || base.pathname !== '/' || base.search || base.hash || base.username || base.password) {
  throw new Error('Supply an HTTP(S) origin without a path or credentials.')
}

const issues = []
const pages = new Map()
const publicOrigins = new Set()
const routePath = (path) => path.replace(/\/+$/, '') || '/'
const fail = (message) => issues.push(message)
const decode = (value) => value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, key) => {
  if (key.startsWith('#')) {
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10)
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity
  }
  return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[key.toLowerCase()] ?? entity
})

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4])]))
}

function parseHtml(html) {
  // Exclude script payloads so serialized React elements cannot count as links.
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '').replace(/<!--[\s\S]*?-->/g, '')
  const tags = (name) => [...markup.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => attributes(match[0]))
  return {
    titles: [...markup.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => decode(match[1]).trim()),
    canonicals: tags('link').filter((tag) => tag.rel?.split(/\s+/).includes('canonical')).map((tag) => tag.href),
    robots: tags('meta').filter((tag) => ['robots', 'googlebot'].includes(tag.name?.toLowerCase())).map((tag) => tag.content || '').join(',').toLowerCase(),
    headings: [...markup.matchAll(/<h1\b[^>]*>/gi)].length,
    links: tags('a').map((tag) => tag.href).filter(Boolean),
    ids: new Set([...markup.matchAll(/<[a-z][^>]*>/gi)].map((match) => attributes(match[0]).id).filter(Boolean)),
  }
}

async function request(path) {
  try {
    const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
    const body = await response.text()
    return { status: response.status, location: response.headers.get('location'), type: response.headers.get('content-type') || '', robots: response.headers.get('x-robots-tag') || '', body }
  } catch (error) {
    fail(`${path}: request failed (${error.message})`)
    return null
  }
}

async function parallel(items, action) {
  let index = 0
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (index < items.length) await action(items[index++])
  }))
}

function canCrawl(text, path, agent = 'Googlebot') {
  const groups = []
  let group = { agents: [], rules: [] }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split('#')[0].trim()
    const colon = line.indexOf(':')
    if (colon < 0) continue
    const key = line.slice(0, colon).toLowerCase()
    const value = line.slice(colon + 1).trim()
    if (key === 'user-agent') {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] } }
      group.agents.push(value.toLowerCase())
    } else if (['allow', 'disallow'].includes(key) && value) group.rules.push({ key, value })
  }
  groups.push(group)
  const specific = groups.filter((item) => item.agents.includes(agent.toLowerCase()))
  const applicable = specific.length ? specific : groups.filter((item) => item.agents.includes('*'))
  const matches = applicable.flatMap((item) => item.rules).filter(({ value }) => {
    const end = value.endsWith('$') ? '$' : ''
    const pattern = (end ? value.slice(0, -1) : value).split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')
    return new RegExp(`^${pattern}${end}`).test(path)
  }).sort((a, b) => b.value.length - a.value.length || (a.key === 'allow' ? -1 : 1))
  return !matches.length || matches[0].key === 'allow'
}

console.log(`SEO crawl: ${base.origin}`)
const sitemap = await request('/sitemap.xml')
if (!sitemap || sitemap.status !== 200) {
  if (sitemap) fail(`/sitemap.xml: expected 200, received ${sitemap.status}`)
} else {
  const entries = [...sitemap.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => decode(match[1].trim()))
  const routes = new Map()
  const origins = new Set([base.origin])
  for (const entry of entries) {
    try {
      const url = new URL(entry)
      const path = routePath(url.pathname)
      if (!['http:', 'https:'].includes(url.protocol) || url.search || url.hash) fail(`Sitemap URL must be a clean HTTP(S) URL: ${entry}`)
      if (/^\/(admin(?:\/|$)|thank-you(?:\/|$))/.test(path)) fail(`Private or success URL in sitemap: ${path}`)
      if (routes.has(path)) fail(`Duplicate sitemap route: ${path}`)
      routes.set(path, entry)
      origins.add(url.origin)
      publicOrigins.add(url.origin)
    } catch { fail(`Invalid sitemap URL: ${entry}`) }
  }
  if (!routes.size) fail('Sitemap contains no page URLs.')
  if (!routes.has('/')) fail('Sitemap must contain the homepage.')
  if (publicOrigins.size > 1) fail('Sitemap mixes public origins.')

  const seenTitles = new Map()
  await parallel([...routes], async ([path, canonical]) => {
    const response = await request(path)
    if (!response) return
    if (response.status !== 200) { fail(`${path}: expected 200, received ${response.status}`); return }
    if (!response.type.includes('text/html')) fail(`${path}: expected HTML, received ${response.type}`)
    const page = parseHtml(response.body)
    pages.set(path, page)
    if (page.titles.length !== 1 || !page.titles[0]) fail(`${path}: expected one non-empty title.`)
    const title = page.titles[0]
    if (title && seenTitles.has(title)) fail(`${path}: duplicates title on ${seenTitles.get(title)}`)
    if (title) seenTitles.set(title, path)
    if (page.headings !== 1) fail(`${path}: expected one H1, found ${page.headings}`)
    if (page.canonicals.length !== 1 || page.canonicals[0]?.replace(/\/$/, '') !== canonical.replace(/\/$/, '')) fail(`${path}: canonical must be ${canonical}`)
    const robots = `${page.robots},${response.robots.toLowerCase()}`
    if (/(?:^|[,\s])(noindex|nofollow|none)(?:$|[,\s])/.test(robots)) fail(`${path}: sitemap page restricts indexing or following.`)
    if (!page.robots.split(/[,\s]+/).includes('index') || !page.robots.split(/[,\s]+/).includes('follow')) fail(`${path}: expected an explicit index, follow robots meta tag.`)
    if (path.startsWith('/guides/')) {
      for (const link of page.links.filter((href) => href.startsWith('#') && href !== '#')) {
        try { if (!page.ids.has(decodeURIComponent(link.slice(1)))) fail(`${path}: anchor ${link} has no matching ID.`) }
        catch { fail(`${path}: invalid fragment ${link}`) }
      }
    }
  })

  const internalPath = (href, from) => {
    try {
      const url = new URL(href, new URL(from, base))
      if (!origins.has(url.origin) || url.search || url.hash) return null
      return routePath(url.pathname)
    } catch { return null }
  }
  const reached = new Set(['/'])
  const queue = ['/']
  for (let i = 0; i < queue.length; i++) {
    for (const href of pages.get(queue[i])?.links ?? []) {
      const target = internalPath(href, queue[i])
      if (target && routes.has(target) && !reached.has(target)) { reached.add(target); queue.push(target) }
    }
  }
  for (const path of routes.keys()) if (!reached.has(path)) fail(`${path}: unreachable from homepage through sitemap page links.`)
  const learningLinks = new Set((pages.get('/learning')?.links ?? []).map((href) => internalPath(href, '/learning')))
  const intents = [...routes.keys()].filter((path) => path.startsWith('/carnatic-music-classes/'))
  if (!intents.length) fail('Sitemap contains no learning-intent pages.')
  for (const path of intents) if (!learningLinks.has(path)) fail(`/learning: missing direct link to ${path}`)
  console.log(`Checked ${routes.size} sitemap pages and homepage reachability.`)
}

await parallel(['/guides/this-guide-does-not-exist-seo-check', '/carnatic-vocal-classes-hyderabad', '/thank-you', '/robots.txt'], async (path) => {
  const response = await request(path)
  if (!response) return
  if (path.startsWith('/guides/')) {
    if (response.status !== 404) fail(`${path}: expected real 404, received ${response.status}`)
  } else if (path === '/carnatic-vocal-classes-hyderabad') {
    let destination
    try { destination = response.location ? new URL(response.location, base) : null } catch { destination = null }
    if (![301, 308].includes(response.status) || !destination || ![base.origin, ...publicOrigins].includes(destination.origin) || destination.pathname !== '/' || destination.search || destination.hash) fail(`${path}: expected permanent redirect to homepage.`)
  } else if (path === '/thank-you') {
    if (response.status !== 200 || !parseHtml(response.body).robots.split(/[,\s]+/).includes('noindex')) fail('/thank-you: expected 200 with noindex.')
  } else {
    if (response.status !== 200) fail(`/robots.txt: expected 200, received ${response.status}`)
    else {
      if (!canCrawl(response.body, '/thank-you')) fail('/robots.txt: allow /thank-you crawling so Google can read noindex.')
      for (const agent of ['Googlebot', 'bingbot', 'OAI-SearchBot', 'Claude-SearchBot']) {
        for (const path of pages.keys()) if (!canCrawl(response.body, path, agent)) fail(`/robots.txt: blocks ${agent} from sitemap page ${path}`)
        if (canCrawl(response.body, '/admin', agent)) fail(`/robots.txt: private admin routes should remain disallowed for ${agent}`)
      }
    }
  }
})

if (issues.length) {
  console.error(`\nSEO crawl failed with ${issues.length} issue(s):`)
  for (const issue of issues) console.error(`  - ${issue}`)
  process.exitCode = 1
} else console.log('PASS: metadata, search/AI crawler access, internal links, guide anchors, 404 and redirect checks.')
