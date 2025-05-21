import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    role: string // Add the custom role field
  }

  interface Session {
    user: {
      id: string
      email: string
      role: string // Add the custom role field to the session
    }
  }

  interface JWT {
    id: string // User ID
    email: string // User email
    role: string // User role
    iat?: number // Issued at timestamp (optional, added by NextAuth)
    exp?: number // Expiration timestamp (optional, added by NextAuth)
  }
}
