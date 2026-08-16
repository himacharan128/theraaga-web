import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

/**
 * `next lint` was removed in Next 16, so the previous `lint` script pointed at
 * a command that no longer exists and had never actually run. This restores it
 * against ESLint directly.
 *
 * eslint-config-next 16 exports flat config natively, so no FlatCompat shim —
 * the shim path throws a circular-JSON error against this version.
 *
 * Deliberately narrow. The real quality gates here are `npm run verify`
 * (typecheck, contrast, no-prices, enquiry validation) and the two Playwright
 * suites; this exists to catch the class of mistake those cannot, chiefly
 * accidental <img> and raw <a> usage where next/image and next/link are
 * required.
 */
const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Copy is authored with real typographic characters already; this rule
      // only fires on the ASCII quotes we do not use.
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default config
