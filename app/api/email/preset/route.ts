import { NextResponse } from "next/server"
import { getEmailPreset } from "@/lib/email-config"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const name = url.searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Missing preset name" }, { status: 400 })
    }

    const preset = await getEmailPreset(name)
    return NextResponse.json(preset)
  } catch (error) {
    console.error("Error loading email preset:", error)
    return NextResponse.json({ error: "Failed to load email preset" }, { status: 500 })
  }
}
