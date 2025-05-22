import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/user"
import { registerSchemaNoConfirm } from "@/lib/validation/register"
import { compare, hash } from "bcrypt"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const userUpdateSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    // Only accept the current password when updating the password
    currentPassword: z.string().optional(),
    password: z.string().optional(),
    enumber: z.string().optional(),
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
    // Get the current user with ID included
    const user = await getCurrentUser()
    console.log("Retrieved user:", JSON.stringify(user, null, 2))

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the ID exists
    if (!user.id) {
      console.error("User ID is undefined", user)
      return NextResponse.json({ error: "User ID is missing" }, { status: 500 })
    }

    // Parse and validate the request body
    const body = await req.json()
    const validationResult = userUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 },
      )
    }

    const updateData = validationResult.data

    // Create a clean update object with only the fields to update
    // Convert camelCase keys to snake_case for Prisma
    const userUpdate: Record<string, any> = {}

    // Process normal fields (non-password) with proper field name mapping
    if (updateData.firstName !== undefined) {
      userUpdate.first_name = updateData.firstName
    }

    if (updateData.lastName !== undefined) {
      userUpdate.last_name = updateData.lastName
    }

    if (updateData.email !== undefined) {
      userUpdate.email = updateData.email
    }

    if (updateData.enumber !== undefined) {
      userUpdate.enumber = updateData.enumber
    }

    // Special handling for password updates
    if (updateData.password) {
      // Use the dedicated function for password checking
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { password: true },
      })

      if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Compare passwords
      const passwordMatch = await compare(
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
      userUpdate.password = await hash(updateData.password, 10)
    }

    // Always update the updated_at timestamp
    userUpdate.updated_at = new Date()

    // If there's nothing to update, return early
    if (Object.keys(userUpdate).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 200 },
      )
    }

    console.log("Updating user with data:", userUpdate)

    // Update the user
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: userUpdate,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        enumber: true,
        created_at: true,
        last_login: true,
        updated_at: true,
      },
    })

    // Format the response to match our UserProfile type
    const formattedUser = {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      role: updatedUser.role.toLowerCase(),
      enumber: updatedUser.enumber,
      createdAt: updatedUser.created_at,
      lastLogin: updatedUser.last_login,
      updatedAt: updatedUser.updated_at,
      // Calculate initials on the fly
      initials: `${updatedUser.first_name.charAt(0)}${updatedUser.last_name.charAt(0)}`,
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: formattedUser,
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
