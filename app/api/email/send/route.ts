import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { to, subject, message } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos" }, { status: 400 })
    }

    console.log("Sending email to:", to)
    console.log("Subject:", subject)

    const success = await sendEmail({
      to,
      subject,
      message,
    })

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "No se pudo enviar el correo" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error al enviar correo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
