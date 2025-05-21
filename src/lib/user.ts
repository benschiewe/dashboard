import { db } from "./db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export type UserProfile = {
  firstName: string
  lastName: string
  email: string
  initials: string
  role: string
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
        first_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      return null
    }

    // Get initials from first and last name
    const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`

    return {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      initials: initials,
      role: user.role.toLowerCase(),
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}
