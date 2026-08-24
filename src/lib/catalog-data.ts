// Static catalog data for Sunglasses Havana — baked in for instant load.
// Source: https://elyerromenu.com/b/sunglasses-havana (catalog payload)

export type CatalogCategory = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  imageSmall: string
  count: number
  price: number // USD price implied by category
  blurKey: string
}

export type CatalogProduct = {
  id: string
  slug: string
  name: string
  note: string
  price: number // USD
  image: string
  imageSmall: string
  trending: boolean
  categoryId: string
  blurKey: string
}

export type BusinessInfo = {
  name: string
  slug: string
  phone: string
  phone2: string
  currency: string
  rating: number
  ratingCount: number
  priceRange: string
  county: string
  address: string
  scheduleNote: string
  deliveryNote: string
  delivery: boolean
  pickup: boolean
  logo: string
  logoSmall: string
  cover: string
  coverMedium: string
  blurKeyCover: string
  blurKeyLogo: string
}

export const business: BusinessInfo = {
  name: 'Sunglasses Havana',
  slug: 'sunglasses-havana',
  phone: '+5363185747',
  phone2: '+5363185747',
  currency: 'USD',
  rating: 5,
  ratingCount: 1,
  priceRange: '$$ - $$$$',
  county: 'Centro Habana, La Habana',
  address:
    'Desagüe / Franco y Oquendo # 165. 4 cuadras detrás de Carlos III. Centro Habana. La misma calle del teatro Lázaro Peña.',
  scheduleNote: 'En cualquier horario excepto de 12 del mediodía a 3 pm.',
  deliveryNote:
    'Debe contactarnos y enviarnos su dirección exacta porque el mensajero cobra por km.',
  delivery: true,
  pickup: true,
  logo: '/sunglasses/logo.webp',
  logoSmall: '/sunglasses/logo-s.webp',
  cover: '/sunglasses/cover.webp',
  coverMedium: '/sunglasses/cover-m.webp',
  blurKeyCover: 'cover',
  blurKeyLogo: 'logo',
}

export const categories: CatalogCategory[] = [
  {
    id: '6a1db1cb1ac1c423918eb735',
    name: 'Gafas 10 USD',
    slug: 'gafas-10-usd',
    description: 'Aceptamos moneda nacional al cambio.',
    image: '/sunglasses/cat-gafas-10-usd.webp',
    imageSmall: '/sunglasses/cat-gafas-10-usd.webp',
    count: 14,
    price: 10,
    blurKey: 'cat-gafas-10-usd',
  },
  {
    id: '6a1db32c1ac1c423918ee391',
    name: 'Gafas Deportivas 10 USD',
    slug: 'gafas-deportivas-10-usd',
    description: 'Aceptamos moneda nacional al cambio.',
    image: '/sunglasses/cat-gafas-deportivas-10-usd.webp',
    imageSmall: '/sunglasses/cat-gafas-deportivas-10-usd.webp',
    count: 10,
    price: 10,
    blurKey: 'cat-gafas-deportivas-10-usd',
  },
  {
    id: '6a1db3581ac1c423918ee86b',
    name: 'Gafas 12 USD',
    slug: 'gafas-12-usd',
    description: 'Aceptamos moneda nacional al cambio.',
    image: '/sunglasses/cat-gafas-12-usd.webp',
    imageSmall: '/sunglasses/cat-gafas-12-usd.webp',
    count: 4,
    price: 12,
    blurKey: 'cat-gafas-12-usd',
  },
  {
    id: '6a1db3801ac1c423918eec3c',
    name: 'Gafas 15 USD',
    slug: 'gafas-15-usd',
    description: 'Aceptamos moneda nacional al cambio.',
    image: '/sunglasses/cat-gafas-15-usd.webp',
    imageSmall: '/sunglasses/cat-gafas-15-usd.webp',
    count: 6,
    price: 15,
    blurKey: 'cat-gafas-15-usd',
  },
  {
    id: '6a239a51eda4a68fe62a3b2c',
    name: 'Artículos Varios — ¡Súper Ofertas!',
    slug: 'articulos-varios-super-ofertas',
    description:
      'Aquí podrá encontrar desde ropa, teléfonos hasta artículos para el hogar.',
    image: '/sunglasses/cat-articulos-varios.webp',
    imageSmall: '/sunglasses/cat-articulos-varios.webp',
    count: 2,
    price: 0,
    blurKey: 'cat-articulos-varios',
  },
  {
    id: '6a2555a1eda4a68fe65322c2',
    name: 'Gafas para Ver de Cerca',
    slug: 'gafas-para-ver-de-cerca',
    description:
      'Gafas para ver de cerca. También traemos algunos modelos por encargo.',
    image: '/sunglasses/cat-gafas-ver-cerca.webp',
    imageSmall: '/sunglasses/cat-gafas-ver-cerca.webp',
    count: 2,
    price: 0,
    blurKey: 'cat-gafas-ver-cerca',
  },
  {
    id: '6a2556d8eda4a68fe6533793',
    name: 'Gafas para Miopía Fotocromáticas',
    slug: 'gafas-para-miopia-fotocromaticas',
    description:
      'Gafas fotocromáticas para miopía. Se ajustan a la graduación de cada ojo.',
    image: '/sunglasses/cat-gafas-miopia.webp',
    imageSmall: '/sunglasses/cat-gafas-miopia.webp',
    count: 6,
    price: 30,
    blurKey: 'cat-gafas-miopia',
  },
]

export const products: CatalogProduct[] = [
  {
    id: '6a255862eda4a68fe653521c',
    slug: 'gafas-0-50-0-75',
    name: 'Gafas -0,50 / -0,75',
    note: 'Con diferente graduación en cada lente tiene un costo de 50 USD.',
    price: 30,
    image: '/sunglasses/gafas-0-50-0-75.webp',
    imageSmall: '/sunglasses/gafas-0-50-0-75-s.webp',
    trending: true,
    categoryId: '6a2556d8eda4a68fe6533793',
    blurKey: 'gafas-0-50-0-75',
  },
  {
    id: '6a25582aeda4a68fe6534eff',
    slug: 'gafa-0-50-0-75-1-00',
    name: 'Gafa -0,50 / -0,75 / -1,00',
    note: 'Con diferente graduación en cada lente tiene un costo de 50 USD.',
    price: 30,
    image: '/sunglasses/gafa-0-50-0-75-1-00.webp',
    imageSmall: '/sunglasses/gafa-0-50-0-75-1-00-s.webp',
    trending: false,
    categoryId: '6a2556d8eda4a68fe6533793',
    blurKey: 'gafa-0-50-0-75-1-00',
  },
  {
    id: '6a2557ddeda4a68fe6534a1b',
    slug: 'gafas-gaticos',
    name: 'Gafas Gaticos',
    note: 'Con diferente graduación en cada lente tiene un costo de 50 USD.',
    price: 30,
    image: '/sunglasses/gafas-gaticos.webp',
    imageSmall: '/sunglasses/gafas-gaticos-s.webp',
    trending: false,
    categoryId: '6a2556d8eda4a68fe6533793',
    blurKey: 'gafas-gaticos',
  },
  {
    id: '6a255786eda4a68fe653443b',
    slug: 'gafas-0-50-1-00-1-75',
    name: 'Gafas -0,50 / -1,00 / -1,75',
    note: 'Con diferente graduación en cada lente tiene un costo de 50 USD.',
    price: 30,
    image: '/sunglasses/gafas-0-50-1-00-1-75.webp',
    imageSmall: '/sunglasses/gafas-0-50-1-00-1-75-s.webp',
    trending: false,
    categoryId: '6a2556d8eda4a68fe6533793',
    blurKey: 'gafas-0-50-1-00-1-75',
  },
  {
    id: '6a255723eda4a68fe6533dc8',
    slug: 'gafa-0-75',
    name: 'Gafa -0,75',
    note: 'Graduación única. Disponible en varios colores.',
    price: 30,
    image: '/sunglasses/gafa-0-75.webp',
    imageSmall: '/sunglasses/gafa-0-75-s.webp',
    trending: false,
    categoryId: '6a2556d8eda4a68fe6533793',
    blurKey: 'gafa-0-75',
  },
  {
    id: '6a2556adeda4a68fe65333db',
    slug: 'gafa-3-j',
    name: 'Gafa -3',
    note: 'Gafas para miopía. Con diferente graduación en cada ojo tiene un costo de 50 USD.',
    price: 30,
    image: '/sunglasses/gafa-3-j.webp',
    imageSmall: '/sunglasses/gafa-3-j-s.webp',
    trending: true,
    categoryId: '6a2556d8eda4a68fe6533793',
    blurKey: 'gafa-3-j',
  },
]

// Phone for WhatsApp ordering (digits only, with country code 53 for Cuba)
export const whatsappNumber = '5363185747'
