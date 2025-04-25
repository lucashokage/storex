"use server"

import { revalidatePath } from "next/cache"

// En un entorno real, obtendríamos el ID del usuario de la sesión
const MOCK_USER_ID = "user-1"

export async function addToCart(formData: FormData) {
  // Simulamos la acción del servidor
  const productId = Number.parseInt(formData.get("productId") as string)

  // En un entorno real, aquí se guardaría en la base de datos
  console.log(`Añadiendo producto ${productId} al carrito`)

  revalidatePath("/cart")
  revalidatePath("/product/[id]")
}

export async function removeFromCart(formData: FormData) {
  const itemId = Number.parseInt(formData.get("itemId") as string)

  // En un entorno real, aquí se eliminaría de la base de datos
  console.log(`Eliminando item ${itemId} del carrito`)

  revalidatePath("/cart")
}

export async function updateCartQuantity(formData: FormData) {
  const itemId = Number.parseInt(formData.get("itemId") as string)
  const quantity = Number.parseInt(formData.get("quantity") as string)

  // En un entorno real, aquí se actualizaría en la base de datos
  console.log(`Actualizando cantidad del item ${itemId} a ${quantity}`)

  revalidatePath("/cart")
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const shade = (formData.get("shade") as string) || null
  const imageUrl = formData.get("imageUrl") as string
  const colorsJson = formData.get("colors") as string

  // En un entorno real, aquí se guardaría en la base de datos
  console.log(`Creando producto: ${name}`)

  revalidatePath("/admin/products")
  revalidatePath("/")
}

export async function updateProduct(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const name = formData.get("name") as string

  // En un entorno real, aquí se actualizaría en la base de datos
  console.log(`Actualizando producto ${id}: ${name}`)

  revalidatePath("/admin/products")
  revalidatePath(`/product/${id}`)
  revalidatePath("/")
}

export async function deleteProduct(formData: FormData) {
  const productId = Number.parseInt(formData.get("productId") as string)

  // En un entorno real, aquí se eliminaría de la base de datos
  console.log(`Eliminando producto ${productId}`)

  revalidatePath("/admin/products")
  revalidatePath("/")
}
