"use client"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { roles } from "@/data/data"
import { Course } from "@/types/course"
import {
  passwordUpdateSchema,
  type PasswordUpdateFormData,
} from "@/lib/validation/changePassword"
import { RiExternalLinkLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function General() {
  const [courses, setCourses] = useState<Course[]>([]) // State to store fetched courses
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false)
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(
    null,
  )
  // New state for server-side validation errors
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  // Password update form setup with React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Password update submission handler
  const onPasswordUpdate = async (data: PasswordUpdateFormData) => {
    try {
      // Clear previous states
      setPasswordUpdateError(null)
      setPasswordUpdateSuccess(false)
      setServerErrors({})

      // Send password update request to your API
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.newPassword,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 400) {
          // Field-specific validation errors
          if (responseData.error === "Current password is incorrect") {
            // Set error directly on the field
            setError("currentPassword", {
              type: "server",
              message: "Current password is incorrect",
            })
            return
          }

          // Handle other validation errors if needed
          if (
            responseData.details &&
            typeof responseData.details === "object"
          ) {
            // Set server validation errors from response details
            setServerErrors(responseData.details)
            return
          }
        }

        // Generic error handling for other error types
        throw new Error(responseData.error || "Failed to update password")
      }

      // Success handling
      setPasswordUpdateSuccess(true)
      reset() // Reset form fields
    } catch (error) {
      console.error("Error updating password:", error)
      setPasswordUpdateError(
        error instanceof Error ? error.message : "An unknown error occurred",
      )
    }
  }

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses")
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data: Course[] = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <>
      <div className="space-y-10">
        <section aria-labelledby="personal-information">
          <form>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="personal-information"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Personal information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Manage your personal information.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <div className="col-span-full sm:col-span-3">
                    <Label htmlFor="first-name" className="font-medium">
                      First name
                    </Label>
                    <Input
                      type="text"
                      id="first-name"
                      name="first-name"
                      autoComplete="given-name"
                      placeholder="Emma"
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                    <Label htmlFor="last-name" className="font-medium">
                      Last name
                    </Label>
                    <Input
                      type="text"
                      id="last-name"
                      name="last-name"
                      autoComplete="family-name"
                      placeholder="Stone"
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-full">
                    <Label htmlFor="email" className="font-medium">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      placeholder="emma@acme.com"
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-full mt-6 flex justify-end">
                    <Button type="submit">Save settings</Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <Divider />

        <section aria-labelledby="password-update">
          <form onSubmit={handleSubmit(onPasswordUpdate)} noValidate>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="password-update"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Update password
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Change your account password.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  {/* Success message */}
                  {passwordUpdateSuccess && (
                    <div className="col-span-full rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Password updated successfully!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generic error message - only for system/unexpected errors */}
                  {passwordUpdateError && (
                    <div className="col-span-full rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            {passwordUpdateError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-span-full">
                    <Label htmlFor="currentPassword" className="font-medium">
                      Current password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        {...register("currentPassword")}
                        type={showOldPassword ? "text" : "password"}
                        id="currentPassword"
                        autoComplete="current-password"
                        className={`pr-10 ${
                          errors.currentPassword || serverErrors.currentPassword
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        tabIndex={-1}
                      >
                        {showOldPassword ? (
                          <RiEyeOffLine className="size-4" />
                        ) : (
                          <RiEyeLine className="size-4" />
                        )}
                      </button>
                    </div>
                    {(errors.currentPassword ||
                      serverErrors.currentPassword) && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.currentPassword?.message ||
                          serverErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="newPassword" className="font-medium">
                      New password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        {...register("newPassword")}
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        autoComplete="new-password"
                        className={`pr-10 ${
                          errors.newPassword || serverErrors.password
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <RiEyeOffLine className="size-4" />
                        ) : (
                          <RiEyeLine className="size-4" />
                        )}
                      </button>
                    </div>
                    {(errors.newPassword || serverErrors.password) && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.newPassword?.message || serverErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="confirmPassword" className="font-medium">
                      Confirm new password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        autoComplete="new-password"
                        className={`pr-10 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <RiEyeOffLine className="size-4" />
                        ) : (
                          <RiEyeLine className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-full mt-6 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update password"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <Divider />

        <section aria-labelledby="manage-courses">
          <form>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="manage-courses"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Manage courses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Manage your courses.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="relative mt-2">
                  <ul className="max-h-48 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                    {courses.map((course) => (
                      <li
                        key={course.course_id}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <input
                          type="checkbox"
                          readOnly
                          className="form-checkbox"
                        />
                        <span>
                          {course.course_name} (
                          {course.department.department_abbreviation})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </section>
        <Divider />
      </div>
    </>
  )
}
