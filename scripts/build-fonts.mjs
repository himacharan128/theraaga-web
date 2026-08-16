/**
 * Font subsetting.
 *
 * `next/font/google` cannot hyper-subset — it serves Google's stock
 * unicode-range slices, which for this stack came to 540 KB across six files
 * against a 90 KB budget. Tiro Devanagari Sanskrit alone was 117 KB to render
 * roughly forty characters of fixed brand vocabulary.
 *
 * So: download the exact slices, cut them to the glyphs actually used with
 * pyftsubset, and serve them with `next/font/local`.
 *
 * The Devanagari set is scanned from the source, because it is fixed brand
 * vocabulary (the seven swaras, the level names, नादब्रह्म) rather than
 * open-ended copy. The Latin set is declared explicitly and generously, so the
 * client adding English copy later never hits a missing glyph.
 *
 * Requires: python3 with fonttools + brotli.
 * Run: npm run build:fonts
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
const OUT = 'public/fonts'
const TMP = '.font-tmp'

// ---------------------------------------------------------------- charset ---

const LATIN =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`' +
  'abcdefghijklmnopqrstuvwxyz{|}~' +
  // typographic punctuation actually used in the copy
  '‘’“”–—…·• ­' +
  // IAST diacritics for transliterated Sanskrit (Sādhana, Kṛti, Varṇam, …)
  'āĀīĪūŪṛṚṝḷḹēĒōŌṅṄñÑṭṬḍḌṇṆśŚṣṢḥḤṁṀ' +
  // misc marks in the UI
  '✱©→←×°₹'

function scanDevanagari() {
  const dirs = ['src']
  const chars = new Set()
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      if (e.startsWith('.') || e === 'node_modules') continue
      const f = join(d, e)
      if (statSync(f).isDirectory()) walk(f)
      else if (['.ts', '.tsx', '.css'].includes(extname(f))) {
        for (const ch of readFileSync(f, 'utf8')) {
          const cp = ch.codePointAt(0)
          // Devanagari block + Vedic extensions + ZWJ/ZWNJ (needed for conjuncts)
          if (
            (cp >= 0x0900 && cp <= 0x097f) ||
            (cp >= 0x1cd0 && cp <= 0x1cf9) ||
            (cp >= 0xa8e0 && cp <= 0xa8ff) ||
            cp === 0x200c ||
            cp === 0x200d
          ) {
            chars.add(ch)
          }
        }
      }
    }
  }
  dirs.forEach(walk)
  return [...chars].sort().join('')
}

// ------------------------------------------------------------------ fetch ---

async function googleFontCss(family, extra = '') {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}${extra}&display=swap`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${family}: ${res.status}`)
  return res.text()
}


async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

function subset(input, output, text) {
  execFileSync(
    'python3',
    [
      '-m',
      'fontTools.subset',
      input,
      `--text=${text}`,
      '--output-file=' + output,
      '--flavor=woff2',
      '--layout-features=*', // keep shaping: conjuncts, matras, kerning, ligatures
      '--no-hinting',
      '--desubroutinize',
      '--drop-tables+=DSIG',
      '--name-IDs=*',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )
}

// ------------------------------------------------------------------- main ---

mkdirSync(OUT, { recursive: true })
mkdirSync(TMP, { recursive: true })

const deva = scanDevanagari()
console.log(`\n  Devanagari glyphs found in source: ${[...deva].length}`)
console.log(`  ${deva}\n`)

const jobs = [
  {
    name: 'newsreader-latin',
    family: 'Newsreader',
    // The `opsz` axis is deliberately NOT requested. Measured on the real
    // files: keeping it costs 272 KB raw against 80 KB without, and the optical
    // compensation is barely perceptible across the range this design actually
    // uses. Weight is kept variable because the design leans on 300 for display
    // and 400–500 for UI; italic is pinned to a single weight because it only
    // ever appears in glosses and pull-quotes.
    extra: ':ital,wght@0,300..600;1,400',
    block: 'latin',
    text: LATIN,
  },
  {
    name: 'inter-latin',
    family: 'Inter',
    extra: ':wght@400..600',
    block: 'latin',
    text: LATIN,
  },
  {
    name: 'tiro-devanagari',
    family: 'Tiro Devanagari Sanskrit',
    extra: '',
    block: 'devanagari',
    text: deva,
  },
]

let total = 0
for (const job of jobs) {
  const css = await googleFontCss(job.family, job.extra)
  // A variable family with an italic axis returns two matching blocks.
  const blocks = css
    .split('/*')
    .map((b) => '/*' + b)
    .filter((b) => b.startsWith(`/* ${job.block} */`))

  for (const [i, block] of blocks.entries()) {
    const m = block.match(/url\((https:[^)]+\.woff2)\)/)
    if (!m) continue
    const italic = /font-style:\s*italic/.test(block)
    const suffix = blocks.length > 1 ? (italic ? '-italic' : '-normal') : ''
    const raw = join(TMP, `${job.name}${suffix}.raw.woff2`)
    const out = join(OUT, `${job.name}${suffix}.woff2`)

    await download(m[1], raw)
    const before = statSync(raw).size
    subset(raw, out, job.text)
    const after = statSync(out).size
    total += after
    console.log(
      `  ${job.name}${suffix}`.padEnd(32) +
        `${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB` +
        `  (−${(100 - (after / before) * 100).toFixed(0)}%)`,
    )
    void i
  }
}

console.log(`\n  Total subsetted font payload: ${(total / 1024).toFixed(1)} KB\n`)
