"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { useProducts } from "@/contexts/product-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { products, incrementViews } = useProducts()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)

  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId)

  useEffect(() => {
    if (product) {
      incrementViews(product.id)
    }
  }, [product, incrementViews])

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    // Si no hay colores disponibles o no se ha seleccionado ninguno, usar el shade del producto
    const selectedColor = product.colors && product.colors.length > 0 ? product.colors[selectedColorIndex] : undefined

    // Asegurarnos de que la cantidad sea al menos 1
    const finalQuantity = Math.max(1, quantity)

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        shade: selectedColor?.name || product.shade,
        discount: product.discount,
      },
      finalQuantity,
    )

    toast({
      title: "Producto agregado",
      description: `${finalQuantity} ${finalQuantity > 1 ? "unidades" : "unidad"} de ${product.name} ${selectedColor ? `(${selectedColor.name})` : ""} agregado al carrito.`,
    })
  }

  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Contenido del producto */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="bg-[#FFF5F5] rounded-lg overflow-hidden relative">
            <div className="aspect-square relative">
              <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {product.discount && (
                <div className="absolute top-4 right-4 bg-[#9D2449] text-white px-3 py-1 rounded-md text-lg font-bold">
                  {product.discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col">
            {product.shade && <div className="text-lg text-muted-foreground mb-2">{product.shade}</div>}

            <h1 className="text-3xl font-bold mb-4 font-playfair">{product.name}</h1>

            <div className="mb-6">
              {product.discount ? (
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-[#9D2449]">${finalPrice.toFixed(2)} MXN</div>
                  <div className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)} MXN</div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-[#9D2449]">${product.price.toFixed(2)} MXN</div>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Color: {product.colors[selectedColorIndex].name}</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {product.colors.length > 5 && (
                    <button className="relative" onClick={() => setSelectedColorIndex((prev) => Math.max(0, prev - 1))}>
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}

                  {product.colors.map((color, index) => (
                    <button
                      key={color.id}
                      className={`w-12 h-12 rounded-full border-2 ${index === selectedColorIndex ? "border-[#9D2449]" : "border-transparent"}`}
                      style={{ backgroundColor: color.colorCode }}
                      aria-label={color.name}
                      onClick={() => setSelectedColorIndex(index)}
                    />
                  ))}

                  {product.colors.length > 5 && (
                    <button
                      className="relative"
                      onClick={() => setSelectedColorIndex((prev) => Math.min(product.colors.length - 1, prev + 1))}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Cantidad</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => prev + 1)}>
                  +
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-[#9D2449] hover:bg-[#7D1D3A] text-white py-6 text-lg"
              onClick={handleAddToCart}
            >
              AGREGAR A LA BOLSA • ${(finalPrice * quantity).toFixed(2)} MXN
            </Button>

            <div className="mt-8 prose">
              <h3 className="text-lg font-medium mb-2">Descripción</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
