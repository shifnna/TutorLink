import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const otpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    type: z.enum(["signup", "forgot"]),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
    type: z.enum(["signup", "forgot"]),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }),
});
