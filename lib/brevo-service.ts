"use server"

import type { EmailConfig } from "./email-config"

interface BrevoEmailOptions {
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
  attachment?: Array<{
    url?: string
    content?: string
    name: string
  }>
}

export async function sendBrevoEmail(options: BrevoEmailOptions, config: EmailConfig): Promise<boolean> {
  try {
    if (!config.api_key) {
      console.error("Brevo API key is missing")
      return false
    }

    const sender = options.sender || {
      name: config.mail_from_name || "Tienda X",
      email: config.mail_from_address || "noreply@example.com",
    }

    const payload = {
      sender,
      to: options.to,
      subject: options.subject,
      htmlContent: options.htmlContent,
      attachment: options.attachment,
    }

    console.log("Sending email via Brevo API:", {
      to: options.to,
      subject: options.subject,
    })

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.api_key,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Brevo API error:", errorData)
      return false
    }

    const data = await response.json()
    console.log("Email sent via Brevo API:", data)
    return true
  } catch (error) {
    console.error("Error sending email via Brevo API:", error)
    return false
  }
}

export async function createBrevoCampaign(
  config: EmailConfig,
  campaignData: {
    name: string
    subject: string
    htmlContent: string
    listIds: number[]
    scheduledAt?: string
  },
): Promise<boolean> {
  try {
    if (!config.api_key) {
      console.error("Brevo API key is missing")
      return false
    }

    const payload = {
      name: campaignData.name,
      subject: campaignData.subject,
      sender: {
        name: config.mail_from_name || "Tienda X",
        email: config.mail_from_address || "noreply@example.com",
      },
      type: "classic",
      htmlContent: campaignData.htmlContent,
      recipients: { listIds: campaignData.listIds },
      scheduledAt: campaignData.scheduledAt,
    }

    console.log("Creating campaign via Brevo API:", {
      name: campaignData.name,
      subject: campaignData.subject,
    })

    const response = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.api_key,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Brevo API error:", errorData)
      return false
    }

    const data = await response.json()
    console.log("Campaign created via Brevo API:", data)
    return true
  } catch (error) {
    console.error("Error creating campaign via Brevo API:", error)
    return false
  }
}
