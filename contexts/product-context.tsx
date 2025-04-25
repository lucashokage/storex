"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ProductColor {
  id: number
  name: string
  colorCode: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  shade?: string
  discount?: number
  colors: ProductColor[]
  views?: number
}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "views">) => Promise<number>
  updateProduct: (id: number, product: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: number) => Promise<boolean>
  incrementViews: (id: number) => Promise<void>
  getMostViewed: (limit?: number) => Product[]
  isLoading: boolean
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Static product data for serverless environment
const staticProducts: Product[] = [
  {
    id: 1,
    name: "Aceite Labial Tintado Soft Pinch",
    description:
      "Un aceite labial ligero que proporciona un brillo sutil y un toque de color. Hidrata y nutre los labios con una fórmula no pegajosa.",
    price: 560,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "labios",
    shade: "Serenity",
    views: 0,
    colors: [
      { id: 1, name: "Serenity", colorCode: "#D75C5C" },
      { id: 2, name: "Passion", colorCode: "#8E2C48" },
      { id: 3, name: "Bliss", colorCode: "#F08080" },
      { id: 4, name: "Sunset", colorCode: "#E67E51" },
      { id: 5, name: "Cocoa", colorCode: "#8B4513" },
      { id: 6, name: "Rose", colorCode: "#F7A5A5" },
    ],
  },
  {
    id: 2,
    name: "Base Líquida Luminosa",
    description:
      "Una base de cobertura media a completa con acabado luminoso. Fórmula ligera que se siente como una segunda piel.",
    price: 850,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "rostro",
    views: 0,
    colors: [
      { id: 7, name: "100N", colorCode: "#F5DEB3" },
      { id: 8, name: "200N", colorCode: "#E8C39E" },
      { id: 9, name: "300N", colorCode: "#D2B48C" },
      { id: 10, name: "400N", colorCode: "#BC8F8F" },
    ],
  },
  {
    id: 3,
    name: "Máscara de Pestañas Voluminizadora",
    description:
      "Máscara que proporciona volumen y longitud a las pestañas. Fórmula de larga duración resistente al agua.",
    price: 420,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "ojos",
    views: 0,
    colors: [],
  },
  {
    id: 4,
    name: "Rubor Líquido Soft Pinch",
    description: "Un rubor líquido de larga duración que se difumina fácilmente para un acabado natural y radiante.",
    price: 490,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "rostro",
    views: 0,
    colors: [
      { id: 11, name: "Joy", colorCode: "#FF69B4" },
      { id: 12, name: "Hope", colorCode: "#FF6347" },
      { id: 13, name: "Grace", colorCode: "#DB7093" },
    ],
  },
  {
    id: 5,
    name: "Paleta de Sombras Discovery",
    description:
      "Una paleta versátil con 12 tonos mate y metálicos para crear múltiples looks. Fórmula altamente pigmentada y fácil de difuminar.",
    price: 780,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "ojos",
    views: 0,
    colors: [],
  },
  {
    id: 6,
    name: "Iluminador Líquido Positive Light",
    description:
      "Un iluminador líquido que proporciona un brillo natural y radiante. Se puede usar solo o mezclado con la base.",
    price: 520,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "rostro",
    views: 0,
    colors: [
      { id: 14, name: "Enlighten", colorCode: "#FFD700" },
      { id: 15, name: "Mesmerize", colorCode: "#F5F5DC" },
      { id: 16, name: "Transcend", colorCode: "#E6BE8A" },
    ],
  },
]

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load static products instead of from database
  useEffect(() => {
    // Load products from localStorage if available, otherwise use static data
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (e) {
        console.error("Error parsing products from localStorage:", e)
        setProducts(staticProducts)
      }
    } else {
      setProducts(staticProducts)
    }
    setIsLoading(false)
  }, [])

  // Save products to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products, isLoading])

  const addProduct = async (product: Omit<Product, "id" | "views">) => {
    try {
      const newProductId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1

      const newProduct: Product = {
        ...product,
        id: newProductId,
        views: 0,
      }

      setProducts((prev) => [...prev, newProduct])

      return newProductId
    } catch (error) {
      console.error("Error adding product:", error)
      throw error
    }
  }

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
      return true
    } catch (error) {
      console.error("Error updating product:", error)
      return false
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      setProducts((prev) => prev.filter((product) => product.id !== id))
      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  }

  const incrementViews = async (id: number) => {
    try {
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? { ...product, views: (product.views || 0) + 1 } : product)),
      )
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  }

  const getMostViewed = (limit = 6) => {
    return [...products].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        incrementViews,
        getMostViewed,
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
