// BlurHash placeholders: 32x32 JPEG encoded as data URIs.
// Generated at build time from the original elyerromenu blurhashes.
// These are inlined so cards show an instant blurred preview before the real image loads.
import placeholders from './blurhash-placeholders.json'

export function blurData(key: string): string | undefined {
  return (placeholders as Record<string, string>)[key]
}
