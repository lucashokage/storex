import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos" }, { status: 400 })
    }

    const success = await sendVerificationEmail(email, token)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el correo de verificación" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error al enviar correo de verificación:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
