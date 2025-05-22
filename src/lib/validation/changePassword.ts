import { z } from "zod"

// Define the password requirements once to keep them consistent
const passwordRequirements = {
  min: 8,
  hasUppercase: /[A-Z]/,
  hasSymbol: /[\W_]/,
}

// Base password validation schema
const passwordValidation = z
  .string()
  .min(passwordRequirements.min, "Password must be at least 8 characters long")
  .regex(
    passwordRequirements.hasUppercase,
    "Password must contain at least one uppercase letter",
  )
  .regex(
    passwordRequirements.hasSymbol,
    "Password must contain at least one symbol",
  )

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  // Add refinement to check if passwords match
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  })
  // Add refinement to check that new password is different from current
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

// Infer the type for use in your form
export type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>
