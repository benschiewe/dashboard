import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    // If no token is found, redirect to login
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Define role-based access control
  const adminRoutes = ["/admin", "/settings"]
  const userRoutes = ["/dashboard"]

  if (adminRoutes.includes(req.nextUrl.pathname) && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/no-access", req.url))
  }

  if (userRoutes.includes(req.nextUrl.pathname) && token.role !== "USER") {
    return NextResponse.redirect(new URL("/no-access", req.url))
  }

  // If everything checks out, proceed
  return NextResponse.next()
}

// Specify the routes that require the middleware
export const config = {
  matcher: ["/admin/:path*", "/settings/:path*", "/dashboard/:path*"],
}
