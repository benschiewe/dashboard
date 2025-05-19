"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RiDonutChartFill } from "@remixicon/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { registerSchema } from "@/lib/validation/register" // Import your zod schema
import { useRouter } from "next/navigation"

type RegisterFormData = z.infer<typeof registerSchema> // Infer the form data type from the schema

export default function Example() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema), // Use zod schema for validation
  })

  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null) // State to track server error

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...rest } = data // Exclude confirmPassword from the data to be sent
    setServerError(null) // Reset server error before submission
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      })

      if (!response.ok) {
        if (response.status === 409) {
          const errorData = await response.json()
          setServerError(errorData.message || "Email already exists.") // Set server error
        } else {
          setServerError("Failed to create account. Please try again.")
        }
        return
      }

      alert("Account created successfully!")
      router.push("/login")
    } catch (error) {
      console.error("Error submitting form:", error)
      setServerError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-4 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <RiDonutChartFill
            className="mx-auto size-10 text-gray-900 dark:text-gray-50"
            aria-hidden={true}
          />
          <h3 className="mt-6 text-center text-lg font-bold text-gray-900 dark:text-gray-50">
            Create new account for workspace
          </h3>
        </div>
        <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="name" className="font-medium">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                {...register("name")}
                placeholder="Name"
                className="mt-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                {...register("email")}
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
              <Label htmlFor="enumber" className="font-medium">
                E-Number
              </Label>
              <Input
                type="text"
                id="enumber"
                {...register("enumber")}
                placeholder="e1234567"
                className="mt-2"
              />
              {errors.enumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.enumber.message}
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
                placeholder="Password"
                className="mt-2"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirm password
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Password"
                className="mt-2"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {serverError && ( // Conditionally render the server error
              <p className="text-sm text-red-500">{serverError}</p>
            )}
            <Button type="submit" className="mt-4 w-full">
              Create account
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600"
          >
            Sign in
          </a>
        </p>
      </div>
    </>
  )
}
