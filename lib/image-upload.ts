import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

// Tipos de archivos permitidos
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]

// Tamaño máximo de archivo (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${ALLOWED_FILE_TYPES.join(", ")}`,
      }
    }

    // Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      }
    }

    // Generar un nombre único para el archivo
    const filename = `${nanoid()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Subir el archivo a Vercel Blob
    const blob = await put(`products/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return {
      success: true,
      url: blob.url,
    }
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return {
      success: false,
      error: "Error al subir la imagen. Por favor, inténtalo de nuevo.",
    }
  }
}
