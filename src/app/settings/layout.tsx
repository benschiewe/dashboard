"use client"

import { siteConfig } from "@/app/siteConfig"
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { UserProfile } from "@/lib/user" // Import only the type, not the functions

// Base navigation items for all authenticated users
const baseNavigationSettings = [
  { name: "General", href: siteConfig.baseLinks.settings.general },
]

// Role-specific navigation items - add "user" role with empty array
const roleNavigationSettings = {
  admin: [{ name: "Users", href: siteConfig.baseLinks.settings.users }],
  user: [], // Added "user" role with empty navigation items
  // Add more role-specific navigation items as needed
}

// Helper function to build navigation based on user role
function buildNavigationForRole(
  role: string,
): Array<{ name: string; href: string }> {
  // Convert role to lowercase for case-insensitive comparison
  const normalizedRole = role.toLowerCase()
  console.log("Building navigation for role:", normalizedRole)

  const roleNavItems =
    roleNavigationSettings[
      normalizedRole as keyof typeof roleNavigationSettings
    ] || []
  return [...baseNavigationSettings, ...roleNavItems]
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [navigationSettings, setNavigationSettings] = useState(
    baseNavigationSettings,
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserAndBuildNav() {
      try {
        setIsLoading(true)

        // Fetch user from API endpoint instead of calling getCurrentUser directly
        const response = await fetch("/api/me")

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData: UserProfile = await response.json()
        console.log("User data:", userData) // Debug log

        // Use the role from userData to build navigation
        setNavigationSettings(buildNavigationForRole(userData.role))
      } catch (error) {
        console.error("Error fetching user data:", error)
        setNavigationSettings(baseNavigationSettings)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndBuildNav()
  }, [])

  // Rest of your component code remains the same
  return (
    <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Settings
      </h1>
      <TabNavigation className="mt-4 sm:mt-6 lg:mt-10">
        {/* Render navigation based on loading state */}
        {isLoading ? (
          <div className="flex space-x-4">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              ></div>
            ))}
          </div>
        ) : (
          navigationSettings.map((item) => (
            <TabNavigationLink
              key={item.name}
              asChild
              active={pathname === item.href}
            >
              <Link href={item.href}>{item.name}</Link>
            </TabNavigationLink>
          ))
        )}
      </TabNavigation>
      <div className="pt-6">{children}</div>
    </div>
  )
}
