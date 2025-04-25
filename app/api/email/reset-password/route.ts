import { NextResponse } from "next/server"
import { sendPasswordResetEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos" }, { status: 400 })
    }

    const success = await sendPasswordResetEmail(email, token)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el correo de restablecimiento" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error al enviar correo de restablecimiento:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
