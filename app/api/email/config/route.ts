import { NextResponse } from "next/server"
import { loadEmailConfig, saveEmailConfig } from "@/lib/email-config"
import type { EmailConfig } from "@/lib/email-config"

export async function GET() {
  try {
    const config = await loadEmailConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error("Error loading email config:", error)
    return NextResponse.json({ error: "Failed to load email configuration" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const config = (await request.json()) as EmailConfig
    await saveEmailConfig(config)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving email config:", error)
    return NextResponse.json({ error: "Failed to save email configuration" }, { status: 500 })
  }
}
