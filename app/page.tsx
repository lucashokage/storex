"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { useProducts } from "@/contexts/product-context"

export default function Home() {
  const { products, getMostViewed } = useProducts()

  // Mostrar los productos más vistos o todos si no hay suficientes visitas
  const featuredProducts = getMostViewed(6).length >= 3 ? getMostViewed(6) : products.slice(0, 6)

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Sección de héroe */}
      <section className="py-12 bg-[#FFF5F5]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#9D2449] mb-6">Belleza que Inspira</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Descubre nuestra colección de productos premium para realzar tu belleza natural.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#9D2449] hover:bg-[#7D1D3A] text-white px-8 py-6 rounded-md text-lg">
              Comprar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#9D2449]">Productos Destacados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group">
                <div className="bg-[#FFF5F5] rounded-lg overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-[#9D2449] text-white px-2 py-1 rounded-md text-sm font-bold">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {product.discount ? (
                      <>
                        <p className="text-[#9D2449] font-bold">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)} MXN
                        </p>
                        <p className="text-muted-foreground line-through text-sm">${product.price.toFixed(2)} MXN</p>
                      </>
                    ) : (
                      <p className="text-[#9D2449] font-bold">${product.price.toFixed(2)} MXN</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-[#9D2449] hover:bg-[#7D1D3A] text-white">Ver Todos los Productos</Button>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-[#FFF5F5]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#9D2449]">Nuestras Categorías</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/category/labios"
              className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
            >
              <h3 className="text-xl font-bold mb-2">Labios</h3>
              <p className="text-muted-foreground">Descubre nuestra colección de productos para labios</p>
            </Link>

            <Link
              href="/category/rostro"
              className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
            >
              <h3 className="text-xl font-bold mb-2">Rostro</h3>
              <p className="text-muted-foreground">Bases, correctores y más para un rostro perfecto</p>
            </Link>

            <Link
              href="/category/ojos"
              className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
            >
              <h3 className="text-xl font-bold mb-2">Ojos</h3>
              <p className="text-muted-foreground">Sombras, delineadores y máscaras para miradas intensas</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
