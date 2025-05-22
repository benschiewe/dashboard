import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

// Helper function to check if a user's role has sufficient permissions
function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy: Record<Role, number> = {
    ADMIN: 30, // Highest permission level
    PROFESSOR: 20, // Professor has more permissions than user
    USER: 10, // Basic user permissions
    GUEST: 0, // Lowest permissions
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export async function middleware(req: NextRequest) {
  console.log("Middleware running on path:", req.nextUrl.pathname)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  console.log("Token found:", !!token)

  if (!token) {
    // If no token is found, redirect to login
    console.log("No token found, redirecting to login")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const userRole = (token.role as Role) || "PROFESSOR"
  console.log("User role:", userRole)

  // Define role-based access control with path checking
  const path = req.nextUrl.pathname

  // Admin-only routes
  if (path.startsWith("/admin") && !hasPermission(userRole, "ADMIN")) {
    console.log(
      "Access denied: User role",
      userRole,
      "tried to access admin path",
    )
    return NextResponse.redirect(new URL("/no-access", req.url))
  }

  // Professor+ routes (both professors and admins can access)
  if (path.startsWith("/settings") && !hasPermission(userRole, "USER")) {
    console.log(
      "Access denied: User role",
      userRole,
      "tried to access settings path",
    )
    return NextResponse.redirect(new URL("/no-access", req.url))
  }

  // User+ routes (users, professors, and admins can access)
  if (path.startsWith("/overview") && !hasPermission(userRole, "USER")) {
    console.log(
      "Access denied: User role",
      userRole,
      "tried to access overview path",
    )
    return NextResponse.redirect(new URL("/no-access", req.url))
  }

  // If everything checks out, proceed
  console.log("Access granted for", token.email, "with role", userRole)
  return NextResponse.next()
}

// Specify the routes that require the middleware
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/settings",
    "/settings/:path*",
    "/overview",
    "/overview/:path*",
  ],
}
