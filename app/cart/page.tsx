"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const { toast } = useToast()

  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal + shipping

  const handleSendToWhatsApp = () => {
    if (!customerName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa tu nombre para continuar",
        variant: "destructive",
      })
      return
    }

    // Formatear el mensaje para WhatsApp
    let message = `*Nuevo pedido de ${customerName}*\n\n`
    message += "*Productos:*\n"

    items.forEach((item, index) => {
      const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price

      message += `${index + 1}. ${item.name} ${item.shade ? `(${item.shade})` : ""}\n`
      message += `   Cantidad: ${item.quantity}\n`
      message += `   Precio: ${itemPrice.toFixed(2)} MXN\n`
      message += `   Subtotal: ${(itemPrice * item.quantity).toFixed(2)} MXN\n\n`
    })

    message += `\n*Subtotal:* ${subtotal.toFixed(2)} MXN\n`
    message += `*Envío:* ${shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} MXN`}\n`
    message += `*Total:* ${total.toFixed(2)} MXN\n\n`

    if (customerPhone) {
      message += `*Teléfono:* ${customerPhone}\n`
    }

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message)

    // Número de WhatsApp de la tienda (reemplazar con el número real)
    const whatsappNumber = "5215512345678"

    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank")

    // Mostrar mensaje de éxito
    toast({
      title: "Pedido enviado",
      description: "Tu pedido ha sido enviado a WhatsApp correctamente",
    })

    // Opcional: limpiar el carrito después de enviar
    // clearCart();
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Contenido del carrito */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-playfair">Tu Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-8">Agrega algunos productos para comenzar a comprar</p>
            <Link href="/">
              <Button className="bg-[#9D2449] hover:bg-[#7D1D3A] text-white">Continuar Comprando</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {items.map((item) => {
                const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price

                return (
                  <div key={item.id} className="flex gap-4 border-b py-6">
                    <div className="w-24 h-24 bg-[#FFF5F5] rounded-md overflow-hidden relative flex-shrink-0">
                      <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.shade && <p className="text-sm text-muted-foreground">{item.shade}</p>}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.discount ? (
                        <>
                          <div className="font-bold">${(itemPrice * item.quantity).toFixed(2)} MXN</div>
                          <div className="text-sm text-muted-foreground mt-1 line-through">
                            ${(item.price * item.quantity).toFixed(2)} MXN
                          </div>
                        </>
                      ) : (
                        <div className="font-bold">${(itemPrice * item.quantity).toFixed(2)} MXN</div>
                      )}
                      <div className="text-sm text-muted-foreground mt-1">${itemPrice.toFixed(2)} MXN c/u</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#FFF5F5] rounded-lg p-6 dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-4 font-playfair">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)} MXN</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} MXN`}</span>
                  </div>

                  <div className="border-t pt-3 font-bold flex justify-between">
                    <span>Total</span>
                    <span>${total.toFixed(2)} MXN</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tu nombre *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nombre completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-[#9D2449] hover:bg-[#7D1D3A] text-white py-6"
                  onClick={handleSendToWhatsApp}
                  disabled={!customerName.trim()}
                >
                  ADQUIRIR VÍA WHATSAPP
                </Button>

                {subtotal < 2000 && (
                  <div className="mt-4 text-sm text-center">
                    Te faltan ${(2000 - subtotal).toFixed(2)} MXN para envío gratis
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
