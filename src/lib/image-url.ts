export function imageUrl(url: string | undefined | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Uploaded images: /uploads/xxx.webp → serve via /api/files/uploads/xxx.webp
  if (url.startsWith('/uploads/')) return `/api/files${url}`
  // Product images: /sunglasses/products/xxx.webp → serve from public folder
  return url
}
