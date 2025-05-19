import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, password } = body

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Email already exists" },
        { status: 409 },
      )
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    })

    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "Username already exists" },
        { status: 409 },
      )
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    const { password: newUserPassword, ...rest } = newUser

    // Exclude the password from the response
    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in POST /api/user:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
