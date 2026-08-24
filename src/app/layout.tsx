import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elyerromenu.com"),
  title: "Sunglasses Havana — Gafas de sol y ópticas en La Habana",
  description:
    "Catálogo digital de Sunglasses Havana. Gafas para miopía fotocromáticas, deportivas y de cerca. Aceptamos moneda nacional. Domicilio y recogida en Centro Habana, La Habana.",
  keywords: [
    "gafas", "gafas de sol", "miopía", "fotocromáticas", "La Habana",
    "Centro Habana", "Sunglasses Havana", "óptica", "catálogo",
  ],
  authors: [{ name: "Sunglasses Havana" }],
  icons: {
    icon: "/sunglasses/logo-s.webp",
    apple: "/sunglasses/logo-s.webp",
  },
  openGraph: {
    title: "Sunglasses Havana — Catálogo Digital",
    description:
      "Gafas de sol, miopía fotocromáticas y de cerca en La Habana. Aceptamos moneda nacional al cambio.",
    siteName: "Sunglasses Havana",
    type: "website",
    locale: "es_LA",
    images: [{ url: "/sunglasses/cover.webp", width: 1600, height: 900, alt: "Sunglasses Havana" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunglasses Havana",
    description: "Catálogo digital de gafas en La Habana.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F1812",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preload critical above-the-fold images for instant load on slow connections */}
        <link rel="preload" href="/sunglasses/cover-m.webp" as="image" fetchPriority="high" />
        <link rel="preload" href="/sunglasses/logo-s.webp" as="image" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#FAF7F2] text-[#2A1A14]`}
      >
        {children}
        <Toaster />
        {/* Register service worker for offline caching */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`,
          }}
        />
      </body>
    </html>
  );
}
