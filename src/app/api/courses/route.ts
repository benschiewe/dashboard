import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Fetch all courses from the database
        const courses = await db.course.findMany({
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
                start_date: true,
                end_date: true,
                status: true,
            },
        })

        // Return the courses as a JSON response
        return NextResponse.json(courses)
    } catch (error) {
        console.error("Error fetching courses:", error)
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
    }
}