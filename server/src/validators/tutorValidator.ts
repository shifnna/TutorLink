import { z } from "zod";

export const applyTutorSchema = z.object({
  body: z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  languages: z.union([
  z.string().min(2, "Provide at least one language"),
  z.array(z.string().min(1)).nonempty("Provide at least one language")
  ]),

  skills: z.union([
  z.string().min(2, "Provide at least one skill"),
  z.array(z.string().min(1)).nonempty("Provide at least one skill")
  ]),

  education: z.string().min(2, "Education is required"),
  experienceLevel: z.string().min(2, "Experience level is required"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Gender must be male, female, or other" }),
  occupation: z.string().min(2, "Occupation is required"),

  profileImage: z.union([
  z.string().min(1, "Profile image is required"),
  z.array(z.string().min(1)).nonempty("Profile image is required")
  ]),

  certificates: z.union([
  z.string().min(1, "Certificates are required"),
  z.array(z.string().min(1)).nonempty("Certificates are required")
  ]),

  accountHolder: z.string().min(2, "Account holder name is required"),
  accountNumber: z
    .string()
    .regex(/^\d{6,18}$/, "Account number must be 6–18 digits"),
  bankName: z.string().min(2, "Bank name is required"),
  ifsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"), // standard IFSC format
  })
  
});


export const presignSchema = z.object({
  body: z.object({ 
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  })
});
