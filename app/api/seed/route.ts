import { NextResponse } from "next/server"

// Simple mock seed function that doesn't rely on SQLite
export async function GET() {
  try {
    // Just return success without actually seeding a database
    console.log("Mock database seed called")

    return NextResponse.json(
      {
        success: true,
        message: "Mock database seed completed.",
      },
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "Error with mock database seed" },
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    )
  }
}
