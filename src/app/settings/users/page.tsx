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
import { ModalAddUser } from "@/components/ui/settings/ModalAddUser"
import { users } from "@/data/data"
import { Course } from "@/types/course"
import { RiAddLine, RiCloseLine, RiMore2Fill } from "@remixicon/react"
import { useEffect, useState } from "react"

export default function Users() {
  const [dialogUser, setDialogUser] = useState<string | null>(null)
  const [userCourses, setUserCourses] = useState<Record<string, string[]>>(
    Object.fromEntries(users.map((u) => [u.name, u.courses || []]))
  )
  const [courses, setCourses] = useState<Course[]>([]) // State to store fetched courses

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
          <ModalAddUser>
            <Button className="mt-4 w-full gap-2 sm:mt-0 sm:w-fit">
              <RiAddLine
                className="-ml-1 size-4 shrink-0"
                aria-hidden="true"
              />
              Add user
            </Button>
          </ModalAddUser>
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
                          <ul className="max-h-48 overflow-auto py-1 border border-gray-200 rounded-md bg-white shadow-lg dark:bg-gray-900 dark:border-gray-800">
                            {courses.map((course) => (
                              <li
                                key={course.course_id}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() =>
                                  handleCourseToggle(user.name, course.course_id)
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={userCourses[user.name]?.includes(
                                    course.course_id
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
                        <select
                          className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                        >
                          <option
                            value="Admin"
                            className="text-sm font-sans"
                          >
                            Admin
                          </option>
                          <option
                            value="Professor"
                            className="text-sm font-sans"
                          >
                            Professor
                          </option>
                          <option
                            value="Student"
                            className="text-sm font-sans"
                          >
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