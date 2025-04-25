import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { ProductProvider } from "@/contexts/product-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { LoadingProvider } from "@/components/loading-provider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Tienda X - Belleza Premium",
  description: "Tu destino para productos de belleza premium",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-montserrat">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LoadingProvider>
            <AuthProvider>
              <ProductProvider>
                <CartProvider>
                  {children}
                  <footer className="py-4 text-center text-sm text-muted-foreground border-t">
                    Tienda X - Todos los derechos reservados &copy; {new Date().getFullYear()}
                  </footer>
                  <Toaster />
                </CartProvider>
              </ProductProvider>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
