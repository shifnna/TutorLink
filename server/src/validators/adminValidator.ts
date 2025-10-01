import { z } from "zod";

export const toggleUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const approveTutorSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "Tutor User ID is required"),
  }),
});

export const rejectTutorSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Rejection message cannot be empty"),
  })
});
