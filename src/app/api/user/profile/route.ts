import { getCurrentUser } from "@/lib/user"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({
        isSignedIn: false,
        user: null,
      })
    }

    return NextResponse.json({
      isSignedIn: true,
      user: user,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      {
        isSignedIn: false,
        user: null,
      },
      { status: 500 },
    )
  }
}
