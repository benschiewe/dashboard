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
import { RiExternalLinkLine } from "@remixicon/react"
import { useEffect, useState } from "react"

export default function General() {
  const [courses, setCourses] = useState<Course[]>([]) // State to store fetched courses

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
                  Manage your personal information and role.
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
                  <div className="col-span-full sm:col-span-3">
                    <Label htmlFor="year" className="font-medium">
                      Birth year
                    </Label>
                    <Input
                      autoComplete="off"
                      id="birthyear"
                      name="year"
                      type="number"
                      placeholder="1994"
                      enableStepper={false}
                      className="mt-2"
                      min="1900"
                      max={new Date().getFullYear()}
                      step="1"
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3">
                    <Label htmlFor="email" className="font-medium">
                      Role
                    </Label>
                    <Select defaultValue="member">
                      <SelectTrigger
                        name="role"
                        id="role"
                        className="mt-2"
                        disabled
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-xs text-gray-500">
                      Roles can only be changed by system admin.
                    </p>
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
                  <ul className="max-h-48 overflow-auto py-1 border border-gray-200 rounded-md bg-white shadow-lg dark:bg-gray-900 dark:border-gray-800">
                    {courses.map((course) => (
                      <li
                        key={course.course_id}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
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
        <section aria-labelledby="danger-zone">
          <form>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
              <div>
                <h2
                  id="danger-zone"
                  className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                >
                  Danger zone
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Manage general workspace. Contact system admin for more
                  information.{" "}
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline hover:underline-offset-4 dark:text-indigo-400"
                  >
                    Learn more
                    <RiExternalLinkLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                </p>
              </div>
              <div className="space-y-6 md:col-span-2">
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-10">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        Leave workspace
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Revoke your access to this team. Other people you have
                        added to the workspace will remain.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      className="text-red-600 dark:text-red-500"
                    >
                      Leave
                    </Button>
                  </div>
                </Card>
                <Card className="overflow-hidden p-0">
                  <div className="flex items-start justify-between gap-10 p-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 dark:text-gray-600">
                        Delete workspace
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-400 dark:text-gray-600">
                        Revoke your access to this team. Other people you have
                        added to the workspace will remain.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      disabled
                      className="whitespace-nowrap text-red-600 disabled:text-red-300 disabled:opacity-50 dark:text-red-500 disabled:dark:text-red-700"
                    >
                      Delete workspace
                    </Button>
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">
                      You cannot delete the workspace because you are not the
                      system admin.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </section>
      </div >
    </>
  )
}
