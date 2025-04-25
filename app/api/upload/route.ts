import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Tipo de archivo no permitido" }, { status: 400 })
    }

    // Validar tamaño de archivo (5MB máximo)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande (máximo 5MB)" },
        { status: 400 },
      )
    }

    // Generar un nombre único para el archivo
    const filename = `${nanoid()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Subir el archivo a Vercel Blob
    const blob = await put(`products/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
