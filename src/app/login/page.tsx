"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { loginSchema } from "@/lib/validation/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuth } from "@/components/AuthProvider"

export default function SignInPage() {
  const { refreshUserData } = useAuth()

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setLoginError("Incorrect username or password")
      } else {
        setLoginError(null)
        await refreshUserData() // Refresh auth state
        await router.push("/")
      }
    } catch (error) {
      // Error handling...
    } finally {
      setIsLoading(false)
    }
  }
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null) // State to track login error
  const [isLoading, setIsLoading] = useState<boolean>(false) // State to track loading state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-4 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-gray-50">
            Welcome Back
          </h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            Enter your credentials to access your account.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                {...register("email")}
                autoComplete="email"
                placeholder="john@company.com"
                className="mt-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                {...register("password")}
                autoComplete="password"
                placeholder="Password"
                className="mt-2"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              {loginError && (
                <p className="mt-1 text-sm text-red-500">{loginError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Signing in..." : "Sign in"}{" "}
              {/* Show loading text */}
            </Button>
          </form>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            {"Don't have an account? "}
            <a
              href="/register"
              className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600"
            >
              Register now
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
