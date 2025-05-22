"use client"

import { Button } from "@/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { Label } from "@/components/Label"
import { Input } from "@/components/Input"
import { ModalAddUser } from "@/components/ui/settings/ModalAddUser"
import { users } from "@/data/data"
import { Course } from "@/types/course"
import { RiAddLine, RiCloseLine, RiMore2Fill } from "@remixicon/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { registerSchema } from "@/lib/validation/register"

// Define the type for the form data
type RegisterFormData = z.infer<typeof registerSchema>

export default function Users() {
  const [dialogUser, setDialogUser] = useState<string | null>(null)
  const [userCourses, setUserCourses] = useState<Record<string, string[]>>(
    Object.fromEntries(users.map((u) => [u.name, u.courses || []])),
  )
  const [courses, setCourses] = useState<Course[]>([]) // State to store fetched courses
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Form setup for user registration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // Handler for user registration
  const onSubmitRegistration = async (data: RegisterFormData) => {
    const { confirmPassword, ...rest } = data // Exclude confirmPassword
    setServerError(null) // Reset server error
    setRegistrationSuccess(false) // Reset success message

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
          setServerError(errorData.message || "Email already exists.")
        } else {
          setServerError("Failed to create account. Please try again.")
        }
        return
      }

      // Success handling
      setRegistrationSuccess(true)
      reset() // Reset form fields

      // Optional: Close dialog or keep open to show success message
      // setIsAddUserDialogOpen(false)

      // Refresh user list (you'll need to implement this part)
      // fetchUsers()
    } catch (error) {
      console.error("Error submitting form:", error)
      setServerError("An unexpected error occurred. Please try again.")
    }
  }

  // Fetch courses from the API
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

  // Handler for toggling course selection
  const handleCourseToggle = (userName: string, courseId: string) => {
    setUserCourses((prev) => {
      const current = prev[userName] || []
      return {
        ...prev,
        [userName]: current.includes(courseId)
          ? current.filter((id) => id !== courseId)
          : [...current, courseId],
      }
    })
  }

  return (
    <>
      <section aria-labelledby="existing-users">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3
              id="existing-users"
              className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
            >
              Users
            </h3>
            <p className="text-sm leading-6 text-gray-500">
              Workspace administrators can add, manage, and remove users.
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Your role: <strong></strong>
            </p>
          </div>
          {/* Replace ModalAddUser with Dialog */}
          <Dialog
            open={isAddUserDialogOpen}
            onOpenChange={setIsAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="mt-4 w-full gap-2 sm:mt-0 sm:w-fit">
                <RiAddLine
                  className="-ml-1 size-4 shrink-0"
                  aria-hidden="true"
                />
                Add user
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogClose asChild>
                <Button
                  className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                  variant="ghost"
                  aria-label="Close"
                >
                  <RiCloseLine className="size-5 shrink-0" />
                </Button>
              </DialogClose>
              <DialogHeader>
                <DialogTitle className="text-base">Add New User</DialogTitle>
                <DialogDescription className="mt-1 text-sm/6">
                  Create a new account for this workspace.
                </DialogDescription>
              </DialogHeader>

              {/* Registration success message */}
              {registrationSuccess && (
                <div className="mt-4 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
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
                        User account created successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmitRegistration)}
                className="mt-6 space-y-4"
                noValidate
              >
                <div>
                  <Label htmlFor="firstName" className="font-medium">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    {...register("firstName")}
                    placeholder="First Name"
                    className="mt-2"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-medium">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Last Name"
                    className="mt-2"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
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

                {/* Server error message */}
                {serverError && (
                  <p className="text-sm text-red-500">{serverError}</p>
                )}

                <DialogFooter className="mt-6">
                  {/* Cancel button */}
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>

                  {/* Submit button */}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <ul
          role="list"
          className="mt-6 divide-y divide-gray-200 dark:divide-gray-800"
        >
          {users.map((user) => (
            <li
              key={user.name}
              className="flex items-center justify-between gap-x-6 py-2.5"
            >
              <div className="flex items-center gap-x-4 truncate">
                <span
                  className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 sm:flex dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                  aria-hidden="true"
                >
                  {user.initials}
                </span>
                <div className="truncate">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog
                  open={dialogUser === user.name}
                  onOpenChange={(open) =>
                    setDialogUser(open ? user.name : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900"
                      aria-label="User actions"
                    >
                      <RiMore2Fill
                        className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
                        aria-hidden="true"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md overflow-auto">
                    <DialogClose asChild>
                      <Button
                        className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                        variant="ghost"
                        aria-label="Close"
                      >
                        <RiCloseLine className="size-5 shrink-0" />
                      </Button>
                    </DialogClose>
                    <form action="#" method="POST">
                      <DialogHeader>
                        <DialogTitle className="text-base">
                          User actions
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm/6">
                          Change user role or manage courses.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-6">
                        <Label
                          htmlFor={`courses-${user.name}`}
                          className="font-medium"
                        >
                          Manage Courses
                        </Label>
                        <div className="relative mt-2">
                          <ul className="max-h-48 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                            {courses.map((course) => (
                              <li
                                key={course.course_id}
                                className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() =>
                                  handleCourseToggle(
                                    user.name,
                                    course.course_id,
                                  )
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={userCourses[user.name]?.includes(
                                    course.course_id,
                                  )}
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
                      <div className="mt-6">
                        <Label
                          htmlFor={`role-${user.name}`}
                          className="font-medium"
                        >
                          User Role
                        </Label>
                        <select className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50">
                          <option value="Admin" className="font-sans text-sm">
                            Admin
                          </option>
                          <option
                            value="Professor"
                            className="font-sans text-sm"
                          >
                            Professor
                          </option>
                          <option value="Student" className="font-sans text-sm">
                            Student
                          </option>
                        </select>
                      </div>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button
                            type="submit"
                            variant="destructive"
                            className="w-full"
                          >
                            Delete user permanently
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
