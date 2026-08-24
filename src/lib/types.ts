export type Category = { id: string; name: string; slug: string; description: string; image: string; sortOrder: number; createdAt: string; updatedAt: string; _count?: { products: number } }
export type Addon = { id: string; name: string; price: number; active: boolean; sortOrder: number; productId: string | null; createdAt: string; updatedAt: string }
export type Product = { id: string; slug: string; name: string; description: string; note: string; price: number; imageUrl: string; imageSmall: string; featured: boolean; trending: boolean; active: boolean; categoryId: string; category?: Category; addons?: Addon[]; createdAt: string; updatedAt: string }
export type Neighborhood = { id: string; name: string; price: number | null; active: boolean; municipalityId: string; createdAt: string; updatedAt: string }
export type Municipality = { id: string; name: string; sortOrder: number; neighborhoods?: Neighborhood[]; createdAt: string; updatedAt: string }
export type SiteConfig = {
  id: string; whatsappNumber: string; phoneDisplay: string; businessName: string; tagline: string
  heroImage: string; logoImage: string; contactAddress: string; contactHours: string; deliveryNote: string
  mapLat: number; mapLng: number; mapZoom: number; instagramUrl: string; facebookUrl: string
  primaryColor: string; footerColor: string; orderMessageTemplate: string; cartMessageTemplate: string; updatedAt: string
}
