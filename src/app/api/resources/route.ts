import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Get current user for authorization
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters for filtering/pagination
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "100", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    // Build filter conditions
    const whereClause: any = {}

    if (status) {
      whereClause.status = status
    }

    // Fetch resources with course information
    const resources = await db.resource.findMany({
      where: whereClause,
      include: {
        courses: {
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
        },
      },
      orderBy: {
        last_edited: "desc",
      },
      skip: offset,
      take: limit,
    })

    // DEBUG: Log the first resource to see what data we're getting from the database
    console.log(
      "DEBUG - First raw resource from DB:",
      JSON.stringify(
        resources.length > 0 ? resources[0] : "No resources found",
        null,
        2,
      ),
    )

    // Count total resources for pagination
    const totalCount = await db.resource.count({
      where: whereClause,
    })

    // Format the results to be more frontend-friendly and match the Usage schema
    const formattedResources = resources.map((resource) => {
      // Get the primary course info for each resource
      const primaryCourse =
        resource.courses?.length > 0 ? resource.courses[0].course : null

      // Format course string in the expected format (e.g., "CS-101")
      const courseString =
        primaryCourse && primaryCourse.department
          ? `${primaryCourse.department.department_abbreviation}-${primaryCourse.course_number}`
          : resource.course_number || "N/A"

      // Format the date
      const date = resource.last_edited
      const formattedDate =
        date instanceof Date
          ? `${String(date.getDate()).padStart(2, "0")}/${String(
              date.getMonth() + 1,
            ).padStart(2, "0")}/${date.getFullYear()} ${String(
              date.getHours(),
            ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
          : typeof date === "string"
            ? new Date(date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(",", "")
            : "Unknown date"

      const formatted = {
        id: resource.resource_id,
        name: resource.resource_name,

        // Format fields to match the Usage schema
        resourceName: resource.resource_name,
        // FIX: Use courseString instead of resource.course_number for the correct format
        course: courseString,
        professor: resource.professor,
        status: resource.status,
        lastEdited: formattedDate,

        // Keep these fields for other components that might use them
        courses:
          resource.courses?.map((rc) => ({
            id: rc.course.course_id,
            name: rc.course.course_name,
            number: rc.course.course_number,
            department:
              rc.course?.department?.department_abbreviation || "Unknown",
            departmentName:
              rc.course?.department?.department_name || "Unknown Department",
          })) || [],
      }

      // DEBUG: Log the first formatted resource to see how we're transforming it
      if (resource === resources[0]) {
        console.log(
          "DEBUG - First formatted resource:",
          JSON.stringify(formatted, null, 2),
        )
      }

      return formatted
    })

    return NextResponse.json({
      resources: formattedResources,
      meta: {
        total: totalCount,
        offset,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    )
  }
}
