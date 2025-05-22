import { z } from "zod"

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  enumber: z
    .string()
    .min(1, "E-Number is required")
    .regex(
      /^e\d{7}$/,
      "E-Number must be in format: e followed by 7 digits (e.g., e1234567)",
    ),
})

// Define the type for form data
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
