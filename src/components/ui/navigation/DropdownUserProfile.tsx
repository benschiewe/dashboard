"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import {
  RiArrowRightUpLine,
  RiComputerLine,
  RiMoonLine,
  RiSunLine,
  RiLogoutBoxRLine,
  RiUser3Line,
} from "@remixicon/react"
import { useTheme } from "next-themes"
import * as React from "react"
import { useAuth } from "@/components/AuthProvider"

export type DropdownUserProfileProps = {
  children: React.ReactNode
  align?: "center" | "start" | "end"
}

export function DropdownUserProfile({
  children,
  align = "start",
}: DropdownUserProfileProps) {
  // Theme handling
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // Auth state
  const { user, signOut, isLoading } = useAuth()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  // Mount effect for theme
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render menu if theme isn't loaded yet
  if (!mounted) {
    return null
  }

  // Get the email from auth context
  const userEmail = user?.email || "Loading..."

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>Theme</DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value)
                  }}
                >
                  <DropdownMenuRadioItem
                    aria-label="Switch to Light Mode"
                    value="light"
                    iconType="check"
                  >
                    <RiSunLine className="size-4 shrink-0" aria-hidden="true" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to Dark Mode"
                    value="dark"
                    iconType="check"
                  >
                    <RiMoonLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to System Mode"
                    value="system"
                    iconType="check"
                  >
                    <RiComputerLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RiUser3Line
                className="mr-2 size-4 shrink-0"
                aria-hidden="true"
              />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              Documentation
              <RiArrowRightUpLine
                className="mb-1 ml-1 size-2.5 shrink-0 text-gray-500"
                aria-hidden="true"
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={async () => {
                setIsSigningOut(true)
                await signOut("/login") // Use signOut from auth context
              }}
              disabled={isSigningOut || isLoading}
            >
              <RiLogoutBoxRLine
                className="mr-2 size-4 shrink-0"
                aria-hidden="true"
              />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
