/** Only the external hostname is retained; never a referrer path or query. */
export function externalReferrerHost(value: string | null): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol)) return undefined
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'theraaga.in' || host.endsWith('.theraaga.in') || host === 'localhost') return undefined
    return host.length <= 100 ? host : undefined
  } catch { return undefined }
}
