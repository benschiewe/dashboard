import { db } from "./db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export type UserProfile = {
  id: string // Added id field
  firstName: string
  lastName: string
  email: string
  initials: string
  role: string
  enumber: string // Added enumber field
  createdAt: Date // Added timestamps
  lastLogin: Date // Added lastLogin
  updatedAt: Date // Added updatedAt
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true, // Select id field
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        enumber: true, // Select enumber
        created_at: true, // Select timestamps
        last_login: true,
        updated_at: true,
      },
    })

    if (!user) {
      return null
    }

    // Get initials from first and last name
    const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`

    return {
      id: user.id, // Include id
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      initials: initials,
      role: user.role.toLowerCase(),
      enumber: user.enumber, // Include enumber
      createdAt: user.created_at, // Include timestamps
      lastLogin: user.last_login,
      updatedAt: user.updated_at,
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

// Optional: Add a more comprehensive function for password checking
export async function getUserForPasswordCheck(
  identifier: { email: string } | { id: string },
) {
  try {
    const user = await db.user.findUnique({
      where: identifier,
      select: {
        id: true,
        email: true,
        password: true,
      },
    })
    return user
  } catch (error) {
    console.error("Error fetching user for password check:", error)
    return null
  }
}
