"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartProduct {
  id: number
  name: string
  price: number
  imageUrl: string
  shade?: string
  quantity: number
  discount?: number
}

interface CartContextType {
  items: CartProduct[]
  addToCart: (product: Omit<CartProduct, "quantity">, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e)
        setItems([])
      }
    }
    setIsInitialized(true)
  }, [])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isInitialized])

  // Mejoramos la función addToCart para asegurar que los productos se añadan correctamente

  const addToCart = (product: Omit<CartProduct, "quantity">, quantity = 1) => {
    // Validar que la cantidad sea positiva
    if (quantity <= 0) {
      quantity = 1
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Si el producto ya existe, actualizar la cantidad
        const updatedItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )

        // Guardar en localStorage inmediatamente
        if (isInitialized) {
          localStorage.setItem("cart", JSON.stringify(updatedItems))
        }

        return updatedItems
      } else {
        // Si el producto no existe, añadirlo al carrito
        const newItems = [...prevItems, { ...product, quantity }]

        // Guardar en localStorage inmediatamente
        if (isInitialized) {
          localStorage.setItem("cart", JSON.stringify(newItems))
        }

        return newItems
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce((total, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price
    return total + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
