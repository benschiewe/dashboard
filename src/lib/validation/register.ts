import { z } from "zod"

const baseRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  enumber: z
    .string()
    .regex(/^e\d{7}$/, "Enumber must start with 'e' followed by 7 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .regex(
      /[A-Z]/,
      "Confirm password must contain at least one uppercase letter",
    )
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Confirm password must contain at least one special character",
    ),
})

export const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"], // Error will be associated with the confirmPassword field
  },
)

export const registerSchemaNoConfirm = baseRegisterSchema.omit({
  confirmPassword: true,
})
