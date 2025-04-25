"use server"

import nodemailer from "nodemailer"
import { loadEmailConfig, isBrevoConfig } from "./email-config"
import { sendBrevoEmail } from "./brevo-service"

interface EmailOptions {
  to: string | string[]
  subject: string
  message: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType?: string
  }>
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const config = await loadEmailConfig()

    // Verificar si la configuración es válida
    if (!config.mail_host || !config.mail_port || !config.mail_from_address) {
      console.error("Email configuration is incomplete", config)
      return false
    }

    // Check if we should use Brevo API instead of SMTP
    if ((await isBrevoConfig(config)) && config.api_key) {
      console.log("Using Brevo API for sending email")

      // Format recipients for Brevo API
      const recipients = Array.isArray(options.to) ? options.to.map((email) => ({ email })) : [{ email: options.to }]

      return sendBrevoEmail(
        {
          to: recipients,
          subject: options.subject,
          htmlContent: options.message,
          sender: {
            name: config.mail_from_name || "Tienda X",
            email: config.mail_from_address || "noreply@example.com",
          },
          attachment: options.attachments?.map((att) => ({
            name: att.filename,
            content: typeof att.content === "string" ? att.content : att.content.toString("base64"),
          })),
        },
        config,
      )
    }

    console.log("Using SMTP for sending email with configuration:", {
      host: config.mail_host,
      port: config.mail_port,
      secure: config.mail_encryption === "ssl",
      auth: {
        user: config.mail_username,
        pass: config.mail_password ? "******" : undefined,
      },
    })

    // Crear el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: config.mail_host,
      port: config.mail_port,
      secure: config.mail_encryption === "ssl",
      auth: {
        user: config.mail_username,
        pass: config.mail_password,
      },
    })

    // Preparar los destinatarios
    const recipients = Array.isArray(options.to) ? options.to.join(",") : options.to

    // Enviar el correo
    const info = await transporter.sendMail({
      from: `"${config.mail_from_name || "Tienda X"}" <${config.mail_from_address}>`,
      to: recipients,
      subject: options.subject,
      html: options.message,
      attachments: options.attachments,
    })

    console.log("Email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://tiendax.com"}/reset-password?token=${resetToken}`

  const message = `
    <h1>Restablecimiento de contraseña</h1>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
    <p><a href="${resetUrl}" style="background-color: #9D2449; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a></p>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    <p>Este enlace expirará en 24 horas.</p>
  `

  return sendEmail({
    to: email,
    subject: "Restablecimiento de contraseña - Tienda X",
    message,
  })
}

export async function sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://tiendax.com"}/verify-email?token=${verificationToken}`

  const message = `
    <h1>Verificación de correo electrónico</h1>
    <p>Gracias por registrarte en Tienda X. Haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
    <p><a href="${verificationUrl}" style="background-color: #9D2449; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar correo electrónico</a></p>
    <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
  `

  return sendEmail({
    to: email,
    subject: "Verificación de correo electrónico - Tienda X",
    message,
  })
}

export async function sendTestEmail(email: string): Promise<boolean> {
  const message = `
    <h1>Correo de prueba</h1>
    <p>Este es un correo de prueba para verificar la configuración de correo electrónico.</p>
    <p>Si estás recibiendo este correo, significa que la configuración es correcta.</p>
    <p>¡Gracias por usar Tienda X!</p>
  `

  return sendEmail({
    to: email,
    subject: "Correo de prueba - Tienda X",
    message,
  })
}
