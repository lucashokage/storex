import { NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Falta el correo electrónico" }, { status: 400 })
    }

    const success = await sendTestEmail(email)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "No se pudo enviar el correo de prueba" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error al enviar correo de prueba:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
