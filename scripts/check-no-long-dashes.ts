/**
 * CI guard: no long dashes in anything a visitor can read.
 *
 * Owner rule for every project under builds (2026-09-12): no em dash (U+2014),
 * en dash (U+2013) or horizontal bar (U+2015) in rendered copy, page titles,
 * metadata, alt and aria text, form labels, error states, WhatsApp messages or
 * the app name. They read as machine-written. Use a comma, colon, full stop or
 * parentheses instead, and a plain hyphen in compounds ("Guru-Shishya").
 *
 * Remembering did not work: the rule was written into a design system and was
 * still broken in 241 places a month later. So rendered text is found by
 * parsing, not grepping. Every string literal, template string and JSX text
 * node in src/ is checked, plus `content:` in stylesheets. Comments are not
 * strings, so they never trip it.
 *
 * One exception, pending the owner's decision: an en dash between two digits
 * (the age bands 7 to 12 and 13 to 17), which a second rule of hers treats as
 * correct typography and which the e2e test still asserts.
 *
 * Run: npm run test:no-long-dashes
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

const ROOT = process.cwd()
const LONG = /[\u2013\u2014\u2015]/
const DIGIT_RANGE = /(?<=\d)\u2013(?=\d)/g

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else yield path
  }
}

const failures: string[] = []

function report(file: string, line: number, text: string) {
  const excerpt = text.replace(/\s+/g, ' ').trim().slice(0, 100)
  failures.push(`${relative(ROOT, file)}:${line}  ${excerpt}`)
}

function checkScript(file: string, text: string) {
  const kind = file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind)

  const visit = (node: ts.Node) => {
    let value: string | undefined
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node) ||
      ts.isJsxText(node)
    ) {
      value = node.text
    }
    if (value !== undefined && LONG.test(value.replace(DIGIT_RANGE, ''))) {
      report(file, source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1, value)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

function checkStylesheet(file: string, text: string) {
  // Only generated content renders; comments are blanked, keeping line numbers.
  const code = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  code.split('\n').forEach((line, i) => {
    if (/content\s*:/.test(line) && LONG.test(line)) report(file, i + 1, line)
  })
}

for (const file of walk(join(ROOT, 'src'))) {
  const text = readFileSync(file, 'utf8')
  if (!LONG.test(text)) continue
  if (/\.(ts|tsx|mts)$/.test(file) && !file.endsWith('.d.ts')) checkScript(file, text)
  else if (file.endsWith('.css')) checkStylesheet(file, text)
}

if (failures.length > 0) {
  console.error(`\n  ✗ ${failures.length} long dash${failures.length === 1 ? '' : 'es'} in rendered text:\n`)
  for (const f of failures) console.error(`    ${f}`)
  console.error('\n  Use a comma, colon, full stop or parentheses; a hyphen in compounds.\n')
  process.exit(1)
}

console.log('  ✓ no long dashes in rendered text')
