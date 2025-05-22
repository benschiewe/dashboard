export interface Course {
    course_id: string
    course_name: string
    course_number: string
    department: {
        department_name: string
        department_abbreviation: string
    }
    start_date: string
    end_date: string
    status: string
}