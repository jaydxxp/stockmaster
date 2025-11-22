// lib/validation/auth.ts
import { z } from "zod";

//  login ID:  
export const loginIdSchema = z
  .string()
  .min(6, "Login ID must be at least 6 characters")
  .max(12, "Login ID must be at most 12 characters");

// email
export const emailSchema = z.string().email("Invalid email address");

//   password 
export const passwordSchema = z
  .string()
  .min(9, "Password must be more than 8 characters") // > 8 means min 9
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character");
  
    export const resetPasswordSchema = z.object({
      email: z.string().email(),
      otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must be numeric"),
      newPassword: passwordSchema,
    });

export const signupSchema = z.object({
  loginId: loginIdSchema,
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
});
