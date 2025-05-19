import { db } from "@/lib/db"
import { registerSchemaNoConfirm } from "@/lib/validation/register"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    console.log("Received POST request") // Debug: Log when the request is received

    const body = await req.json()
    console.log("Request body:", body) // Debug: Log the parsed request body

    const { name, email, enumber, password } =
      registerSchemaNoConfirm.parse(body)

    console.log("Checking if email exists:", email) // Debug: Log email check
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    })

    if (existingUserByEmail) {
      console.log("Email already exists:", email) // Debug: Log if email exists
      return NextResponse.json(
        { user: null, message: "Email already exists" },
        { status: 409 },
      )
    }

    console.log("Checking if eNumber exists:", enumber) // Debug: Log eNumber check
    const existingUserByEnum = await db.user.findUnique({
      where: { enumber: enumber },
    })

    if (existingUserByEnum) {
      console.log("eNumber already exists:", enumber) // Debug: Log if eNumber exists
      return NextResponse.json(
        { user: null, message: "eNumber already exists" },
        { status: 409 },
      )
    }

    console.log("Hashing password") // Debug: Log before hashing password
    const hashedPassword = await hash(password, 10)
    console.log("Password hashed successfully") // Debug: Log after hashing password

    console.log("Creating new user in the database") // Debug: Log before creating user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        enumber,
        password: hashedPassword,
      },
    })
    console.log("New user created:", newUser) // Debug: Log the created user

    const { password: newUserPassword, ...rest } = newUser

    // Exclude the password from the response
    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error occurred:", error) // Debug: Log the error
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    )
  }
}
