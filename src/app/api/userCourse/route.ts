import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { getCurrentUser } from "@/lib/user"

// Define the validation schema for the incoming request
const userCourseSchema = z.object({
  enumber: z.string().min(1, "E-Number is required"),
  courseIds: z.array(z.string().min(1, "Course ID is required")),
})

export async function POST(req: NextRequest) {
  try {
    // Get the current user to check permissions
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can manage user courses." },
        { status: 401 },
      )
    }

    // Parse and validate the request body
    const body = await req.json()
    const validationResult = userCourseSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { enumber, courseIds } = validationResult.data

    // Check if user exists
    const user = await db.user.findUnique({
      where: { enumber },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: `User with E-Number ${enumber} not found` },
        { status: 404 },
      )
    }

    // Verify all courses exist
    const courses = await db.course.findMany({
      where: {
        course_id: {
          in: courseIds,
        },
      },
      select: { course_id: true },
    })

    if (courses.length !== courseIds.length) {
      const foundCourseIds = courses.map((course) => course.course_id)
      const missingCourseIds = courseIds.filter(
        (id) => !foundCourseIds.includes(id),
      )

      return NextResponse.json(
        {
          error: "Some courses do not exist",
          missingCourseIds,
        },
        { status: 404 },
      )
    }

    // Create array of user course records
    const currentDate = new Date()
    const userCourseData = courseIds.map((courseId) => ({
      enumber,
      course_id: courseId,
      enrollment_date: currentDate,
    }))

    // Create the user-course associations with transaction
    const result = await db.$transaction(async (prisma) => {
      // First delete any existing associations for this user to avoid duplicates
      await prisma.userCourse.deleteMany({
        where: {
          enumber,
          course_id: {
            in: courseIds,
          },
        },
      })

      // Then create the new associations
      return await prisma.userCourse.createMany({
        data: userCourseData,
        skipDuplicates: true,
      })
    })

    return NextResponse.json(
      {
        message: `Successfully enrolled user in ${result.count} courses`,
        affectedCourses: courseIds,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding user courses:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// GET endpoint to retrieve courses for a user
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const enumber = url.searchParams.get("enumber")

    // Validate input
    if (!enumber) {
      return NextResponse.json(
        { error: "E-Number is required as a query parameter" },
        { status: 400 },
      )
    }

    // Get the current user to check permissions
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow users to see only their own courses, or admins to see anyone's courses
    if (currentUser.role !== "admin" && currentUser.enumber !== enumber) {
      return NextResponse.json(
        { error: "You can only view your own courses" },
        { status: 403 },
      )
    }

    // Fetch user courses with course details
    const userCourses = await db.userCourse.findMany({
      where: {
        enumber,
      },
      include: {
        course: {
          select: {
            course_id: true,
            course_name: true,
            course_number: true,
            department: {
              select: {
                department_name: true,
                department_abbreviation: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(userCourses)
  } catch (error) {
    console.error("Error retrieving user courses:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// DELETE endpoint to remove course associations
export async function DELETE(req: NextRequest) {
  try {
    // Get the current user to check permissions
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can delete user courses." },
        { status: 401 },
      )
    }

    // Parse the URL to get query parameters
    const url = new URL(req.url)
    const enumber = url.searchParams.get("enumber")
    const courseId = url.searchParams.get("courseId")

    // Validate input
    if (!enumber) {
      return NextResponse.json(
        { error: "E-Number is required as a query parameter" },
        { status: 400 },
      )
    }

    // If course ID is provided, delete specific association, otherwise delete all
    if (courseId) {
      await db.userCourse.delete({
        where: {
          enumber_course_id: {
            enumber,
            course_id: courseId,
          },
        },
      })

      return NextResponse.json({
        message: `Successfully removed course ${courseId} from user ${enumber}`,
      })
    } else {
      // Delete all course associations for this user
      const result = await db.userCourse.deleteMany({
        where: { enumber },
      })

      return NextResponse.json({
        message: `Successfully removed all ${result.count} courses from user ${enumber}`,
      })
    }
  } catch (error) {
    console.error("Error deleting user courses:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
