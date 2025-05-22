import { db } from "@/lib/db"
import { registerSchemaNoConfirm } from "@/lib/validation/register"
import { hash, compare } from "bcrypt"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/user"
import { z } from "zod"

const userUpdateSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    // Only accept the current password when updating the password
    currentPassword: z.string().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided, currentPassword must also be provided
      if (data.password && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: "Current password is required when updating password",
      path: ["currentPassword"],
    },
  )

export async function POST(req: Request) {
  try {
    console.log("Received POST request") // Debug: Log when the request is received

    const body = await req.json()
    console.log("Request body:", body) // Debug: Log the parsed request body

    const { firstName, lastName, email, enumber, password } =
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
        first_name: firstName,
        last_name: lastName,
        email,
        enumber,
        password: hashedPassword,
        role: "USER", // Default role
        created_at: new Date(),
        updated_at: new Date(),
        last_login: new Date(),
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

export async function PUT(req: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await req.json()

    // Validate the update data
    const validationResult = userUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 },
      )
    }

    const updateData = validationResult.data

    // Create a clean update object with only the fields to update
    const userUpdate: Record<string, any> = {}

    // Process normal fields (non-password)
    for (const [key, value] of Object.entries(updateData)) {
      if (
        key !== "password" &&
        key !== "currentPassword" &&
        value !== undefined
      ) {
        userUpdate[key] = value
      }
    }

    // Special handling for password updates
    if (updateData.password) {
      // Verify current password
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true }, // Only select the password field
      })

      if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(
        updateData.currentPassword as string,
        dbUser.password,
      )

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        )
      }

      // Hash the new password
      userUpdate.password = await bcrypt.hash(updateData.password, 10)
    }

    // If there's nothing to update, return early
    if (Object.keys(userUpdate).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 200 },
      )
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: userUpdate,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Never return password in response
      },
    })

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 },
    )
  }
}
