import { db } from "@/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt" // Import the extended JWT type
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!existingUser) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password,
          existingUser.password,
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          role: existingUser.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id // Add user ID to the token
        token.email = user.email // Add user email to the token
        token.role = user.role // Add user role to the token
        token.iat = Math.floor(Date.now() / 1000) // Set issued at timestamp
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 // Set expiration timestamp (1 day)
      }
      return token
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.id // Add user ID to the session
      session.user.email = token.email // Add user email to the session
      session.user.role = token.role // Add user role to the session
      return session
    },
  },
}
