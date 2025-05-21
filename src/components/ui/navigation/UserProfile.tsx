"use client"

import { Button } from "@/components/Button"
import { cx, focusRing } from "@/lib/utils"
import { RiMore2Fill, RiLoginCircleLine } from "@remixicon/react"
import { useEffect } from "react"
import { DropdownUserProfile } from "./DropdownUserProfile"
import { useAuth } from "@/components/AuthProvider"

// Default user in case we can't fetch from the database
const defaultUser = {
  firstName: "Guest",
  lastName: "",
  email: "",
  initials: "?",
  role: "guest",
}

export const UserProfileDesktop = () => {
  const { user, isSignedIn, isLoading, refreshUserData } = useAuth()

  const fullName =
    user?.firstName + (user?.lastName ? ` ${user.lastName}` : "") || "Guest"

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData()
  }, [refreshUserData])

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" className="opacity-50" disabled>
        <span className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></span>
      </Button>
    )
  }

  // Show sign-in button if not signed in
  if (!isSignedIn) {
    return (
      <Button
        variant="ghost"
        className={cx(
          focusRing,
          "flex items-center gap-2 rounded-md py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:dark:bg-gray-400/10",
        )}
        onClick={() => (window.location.href = "/login")}
      >
        <RiLoginCircleLine className="size-4" />
        <span>Sign In</span>
      </Button>
    )
  }

  // Show user profile when signed in
  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          focusRing,
          "group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            aria-hidden="true"
          >
            {user?.initials || "?"}
          </span>
          <span>{fullName}</span>
        </span>
        <RiMore2Fill
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  )
}

export const UserProfileMobile = () => {
  const { user, isSignedIn, isLoading, refreshUserData } = useAuth()

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData()
  }, [refreshUserData])

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" className="p-1 opacity-50" disabled>
        <span className="h-7 w-7 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></span>
      </Button>
    )
  }

  // Show sign-in button if not signed in
  if (!isSignedIn) {
    return (
      <Button
        variant="ghost"
        className={cx(
          "rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:dark:bg-gray-400/10",
        )}
        onClick={() => (window.location.href = "/login")}
      >
        <RiLoginCircleLine className="size-5" />
      </Button>
    )
  }

  // Show user profile when signed in
  return (
    <DropdownUserProfile align="end">
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          "group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          aria-hidden="true"
        >
          {user?.initials || "?"}
        </span>
      </Button>
    </DropdownUserProfile>
  )
}
