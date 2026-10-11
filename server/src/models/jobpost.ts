import { Schema, model, Types } from "mongoose";

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export const LEVELS = ["class-1-5", "class-6-8", "class-9-10", "class-11-12", "undergraduate", "postgraduate", "professional", "other"] as const;
export const TIMES = ["morning", "afternoon", "evening", "night", "flexible"] as const;
export const DURATIONS = [30, 45, 60, 90, 120] as const;
export const VALID_FOR_DAYS = [7, 15, 30] as const;
export const JOB_LIMITS = { maxOpenPerClient: 5, budgetMin: 50, budgetMax: 10000, maxStartAheadDays: 90, maxLanguages: 5 } as const;

export interface IJobPost {
  clientId: Types.ObjectId; // direct reference to User (not a separate Client model)
  title: string;
  titleKey: string; // lowercase title, used to catch duplicate posts
  subject: string;
  level: (typeof LEVELS)[number];
  languages: string[];
  description: string;
  budgetMin: number; // ₹ per hour
  budgetMax: number;
  sessionDuration: number; // minutes
  preferredDays: (typeof WEEKDAYS)[number][];
  preferredTime: (typeof TIMES)[number];
  startDate: string; // "YYYY-MM-DD" (date only, so no timezone shifts)
  validForDays: number;
  expiresAt: Date;
  status: "open" | "closed";
  closedAt?: Date | null;
  isDeleted: boolean;
}

export type JobPostLean = IJobPost & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

const jobPostSchema = new Schema<IJobPost>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    titleKey: { type: String, required: true },
    subject: { type: String, required: true, trim: true, maxlength: 50 },
    level: { type: String, enum: [...LEVELS], required: true },
    languages: { type: [String], validate: { validator: (v: string[]) => v.length >= 1 && v.length <= JOB_LIMITS.maxLanguages, message: "Select 1 to 5 languages" } },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    budgetMin: { type: Number, required: true, min: JOB_LIMITS.budgetMin, max: JOB_LIMITS.budgetMax },
    budgetMax: { type: Number, required: true, min: JOB_LIMITS.budgetMin, max: JOB_LIMITS.budgetMax },
    sessionDuration: { type: Number, required: true, min: 30, max: 120 },
    preferredDays: { type: [{ type: String, enum: [...WEEKDAYS] }], validate: { validator: (v: string[]) => v.length >= 1, message: "Pick at least one day" } },
    preferredTime: { type: String, enum: [...TIMES], default: "flexible" },
    startDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    validForDays: { type: Number, required: true, min: 7, max: 30 },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    closedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

jobPostSchema.index({ status: 1, isDeleted: 1, expiresAt: 1, createdAt: -1 }); // tutor board
jobPostSchema.index({ clientId: 1, isDeleted: 1, createdAt: -1 }); // "my requirements"

export const JobPostModel = model<IJobPost>("JobPost", jobPostSchema);