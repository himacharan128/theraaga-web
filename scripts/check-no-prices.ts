/**
 * CI guard: no prices, anywhere, ever.
 *
 * This is a standing instruction from the client, not a design preference, so
 * it is enforced mechanically rather than by memory. It covers visible copy AND
 * structured data — `priceRange` on a LocalBusiness node and `offers` on a
 * Course node are price surfaces exactly like a fee chip is.
 *
 * The research argued both sides (0 of 11 benchmark institutions show fees on a
 * homepage, but Hyderabad parents arrive carrying a hard anchor from UrbanPro).
 * That debate is settled by decision. Fees are a WhatsApp conversation.
 *
 * Run: npm run test:no-prices
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['src', 'scripts']
const EXTS = new Set(['.ts', '.tsx', '.css', '.md', '.json'])

/** Never scan this file, or the script that documents the patterns. */
const SKIP_FILES = new Set(['scripts/check-no-prices.ts'])

interface Rule {
  name: string
  re: RegExp
}

const RULES: Rule[] = [
  { name: 'rupee symbol', re: /₹/g },
  { name: 'dollar amount', re: /\$\s?\d/g },
  { name: 'INR / Rs. amount', re: /\b(?:INR|Rs\.?)\s?\d/gi },
  { name: 'per-month price', re: /\d[\d,]*\s*(?:\/|per\s+)\s*(?:month|class|session|hour)/gi },
  { name: 'schema priceRange', re: /priceRange/g },
  { name: 'schema offers/price', re: /["'](?:offers|price|priceCurrency|priceSpecification)["']\s*:/g },
]

/**
 * Words like "fee" and "price" legitimately appear in prose that explicitly
 * declines to give a number ("Fees depend on…", "No fees, no commitment"). The
 * rules above deliberately match only NUMBERS and SCHEMA KEYS, so that prose is
 * safe without needing an allowlist of sentences.
 */

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const e of entries) {
    if (e === 'node_modules' || e === '.next' || e.startsWith('.')) continue
    const full = join(dir, e)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (EXTS.has(extname(full))) out.push(full)
  }
  return out
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
const violations: string[] = []

for (const file of files) {
  const rel = relative(ROOT, file)
  if (SKIP_FILES.has(rel)) continue

  const source = readFileSync(file, 'utf8')
  const lines = source.split('\n')

  for (const rule of RULES) {
    lines.forEach((line, i) => {
      // A comment explaining WHY there is no price is not a price.
      const trimmed = line.trim()
      if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        return
      }
      rule.re.lastIndex = 0
      if (rule.re.test(line)) {
        violations.push(`  ✗ ${rel}:${i + 1}  [${rule.name}]  ${trimmed.slice(0, 90)}`)
      }
    })
  }
}

console.log(`\n  No-prices sweep — ${files.length} files scanned\n`)

if (violations.length > 0) {
  console.error(violations.join('\n'))
  console.error(
    `\n  ${violations.length} price reference(s) found. Prices never appear on this site — fees are a WhatsApp conversation.\n`,
  )
  process.exit(1)
}

console.log('  ✓ No prices found in copy or structured data.\n')
