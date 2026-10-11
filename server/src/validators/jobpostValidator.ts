import { z } from "zod";
import { DURATIONS, JOB_LIMITS, LEVELS, TIMES, VALID_FOR_DAYS, WEEKDAYS } from "../models/jobPost.js";
import type { JobListFilter } from "../repositories/jobpostRepository.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const IST_MS = 5.5 * 60 * 60 * 1000;

// "today" in India, as YYYY-MM-DD, so the "no past dates" rule matches what the user sees
export const todayIST = () => new Date(Date.now() + IST_MS).toISOString().slice(0, 10);
const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const multiLine = (s: string) => s.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
const CONTACT_INFO = /[\w.+-]+@[\w-]+\.[\w.-]+|(\+?\d[\s().-]*){10,}/; // emails and phone numbers

const line = (label: string, min: number, max: number) =>
  z.string().transform(oneLine).pipe(z.string().min(min, `${label} must be at least ${min} characters`).max(max, `${label} can't be more than ${max} characters`));
const oneOf = (list: readonly number[], msg: string) => z.number().refine((n) => list.includes(n), msg);
const budget = z.number().int("Budget must be a whole number").min(JOB_LIMITS.budgetMin, `Minimum budget is ₹${JOB_LIMITS.budgetMin}`).max(JOB_LIMITS.budgetMax, `Budget can't be more than ₹${JOB_LIMITS.budgetMax}`);

export const jobPostSchema = z
  .object({
    title: line("Title", 5, 100),
    subject: line("Subject", 2, 50),
    level: z.enum(LEVELS),
    languages: z
      .array(line("Language", 2, 30))
      .min(1, "Select at least one language")
      .max(JOB_LIMITS.maxLanguages, `Select up to ${JOB_LIMITS.maxLanguages} languages`)
      .transform((list) => list.filter((l, i) => list.findIndex((x) => x.toLowerCase() === l.toLowerCase()) === i)), // removes repeats, keeps the first
    description: z.string().transform(multiLine).pipe(
      z.string().min(20, "Describe what you need in at least 20 characters").max(1000, "Description can't be more than 1000 characters")
        .refine((s) => !CONTACT_INFO.test(s), "Please don't add phone numbers or emails. Tutors will contact you through the in-app chat.")
    ),
    budgetMin: budget,
    budgetMax: budget,
    sessionDuration: oneOf(DURATIONS, "Choose a valid session duration"),
    preferredDays: z.array(z.enum(WEEKDAYS)).min(1, "Pick at least one day").transform((d) => WEEKDAYS.filter((w) => d.includes(w))),
    preferredTime: z.enum(TIMES),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid start date"),
    validForDays: oneOf(VALID_FOR_DAYS, "Choose how long the post stays open"),
  })
  .superRefine((d, ctx) => {
    const bad = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (d.budgetMin > d.budgetMax) bad("budgetMax", "Max budget can't be lower than min budget");
    const real = new Date(`${d.startDate}T00:00:00Z`);
    if (Number.isNaN(real.getTime()) || real.toISOString().slice(0, 10) !== d.startDate) return bad("startDate", "Choose a valid start date");
    const today = todayIST();
    if (d.startDate < today) bad("startDate", "Start date can't be in the past");
    else if (d.startDate > addDays(today, JOB_LIMITS.maxStartAheadDays)) bad("startDate", `Start date must be within ${JOB_LIMITS.maxStartAheadDays} days from today`);
  });

export type JobPostInput = z.infer<typeof jobPostSchema>;
export type ParsedJobPost = { ok: true; data: JobPostInput } | { ok: false; message: string; errors: Record<string, string> };

export const parseJobPost = (body: unknown): ParsedJobPost => {
  const r = jobPostSchema.safeParse(body);
  if (r.success) return { ok: true, data: r.data };
  const errors: Record<string, string> = {};
  for (const i of r.error.issues) {
    const key = String(i.path[0] ?? "form");
    const code = String(i.code);
    errors[key] ??= code === "invalid_type" ? "Enter a valid value" : code.startsWith("invalid_") && code !== "invalid_format" && !i.message.startsWith("Choose") && /expected one of|Invalid (option|enum)/i.test(i.message) ? "Choose a valid option" : i.message;
  }
  return { ok: false, message: Object.values(errors)[0] ?? "Invalid request", errors };
};

// ---------- query params for the list endpoints ----------
const int = (v: unknown, def: number, min: number, max: number) => {
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : def;
};
const text = (v: unknown, max = 60) => (typeof v === "string" ? oneLine(v).slice(0, max) : ""); // ignores ?a=1&a=2 arrays

export const parseListQuery = (q: Record<string, unknown>): JobListFilter => {
  const status = text(q.status);
  const sort = text(q.sort);
  return {
    page: int(q.page, 1, 1, 10000),
    limit: int(q.limit, 9, 1, 50),
    search: text(q.search) || undefined,
    subject: text(q.subject) || undefined,
    language: text(q.language) || undefined,
    status: status === "open" || status === "closed" || status === "expired" ? status : undefined,
    minBudget: text(q.minBudget) ? int(q.minBudget, 0, 0, JOB_LIMITS.budgetMax) : undefined,
    sort: sort === "budget_high" || sort === "budget_low" ? sort : "newest",
  };
};