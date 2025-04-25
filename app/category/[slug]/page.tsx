"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useProducts } from "@/contexts/product-context"

const categoryNames: Record<string, string> = {
  labios: "Labios",
  rostro: "Rostro",
  ojos: "Ojos",
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const categoryName = categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
  const { products } = useProducts()

  const categoryProducts = products.filter((product) => product.category === slug)

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#9D2449]">Categoría: {categoryName}</h1>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-8">No hay productos en esta categoría</p>
            <Link href="/">
              <Button className="bg-[#9D2449] hover:bg-[#7D1D3A] text-white">Volver al inicio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
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
        )}
      </div>
    </main>
  )
}
