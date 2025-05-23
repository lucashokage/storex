import { NextResponse } from "next/server"

// Datos estáticos para los productos
const productsData = [
  {
    id: 1,
    name: "Aceite Labial Tintado Soft Pinch",
    description:
      "Un aceite labial ligero que proporciona un brillo sutil y un toque de color. Hidrata y nutre los labios con una fórmula no pegajosa.",
    price: 560,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "labios",
    shade: "Serenity",
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
    colors: [],
  },
  {
    id: 4,
    name: "Rubor Líquido Soft Pinch",
    description: "Un rubor líquido de larga duración que se difumina fácilmente para un acabado natural y radiante.",
    price: 490,
    imageUrl: "/placeholder.svg?height=600&width=400",
    category: "rostro",
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
    colors: [
      { id: 14, name: "Enlighten", colorCode: "#FFD700" },
      { id: 15, name: "Mesmerize", colorCode: "#F5F5DC" },
      { id: 16, name: "Transcend", colorCode: "#E6BE8A" },
    ],
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const product = productsData.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}
