"use client"

import { UserProfile } from "@/lib/user"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react"
import { signOut as nextAuthSignOut } from "next-auth/react"

interface AuthContextType {
  user: UserProfile | null
  isSignedIn: boolean
  isLoading: boolean
  refreshUserData: () => Promise<void>
  signOut: (callbackUrl?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  isLoading: true,
  refreshUserData: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [refreshCount, setRefreshCount] = useState(0)

  // Use useCallback to memoize the fetchUserData function
  // This prevents it from being recreated on every render
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/user/profile")

      if (response.ok) {
        const data = await response.json()
        setIsSignedIn(data.isSignedIn)

        if (data.isSignedIn && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }, []) // Empty dependency array so this function is stable

  // This handles the initial data fetch
  useEffect(() => {
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // This effect handles refreshes triggered by refreshCount changes
  useEffect(() => {
    if (refreshCount > 0) {
      fetchUserData()
    }
  }, [refreshCount, fetchUserData])

  // Provide a way to trigger refresh without causing infinite loops
  const refreshUserData = useCallback(async () => {
    setRefreshCount((prev) => prev + 1)
  }, [])

  // Handle sign out
  const signOut = useCallback(async (callbackUrl = "/login") => {
    try {
      // First update our local state
      setIsLoading(true)

      // Then call NextAuth's signOut
      await nextAuthSignOut({
        callbackUrl,
        redirect: true,
      })

      // Update local state (though this might not run due to the redirect)
      setUser(null)
      setIsSignedIn(false)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn,
        isLoading,
        refreshUserData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
