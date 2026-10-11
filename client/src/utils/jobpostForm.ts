import { IJobPost, IJobPostForm, JobPostPayload } from "../types/IJobPost";

export const LEVELS = [
  { value: "class-1-5", label: "Class 1–5" }, { value: "class-6-8", label: "Class 6–8" }, { value: "class-9-10", label: "Class 9–10" },
  { value: "class-11-12", label: "Class 11–12" }, { value: "undergraduate", label: "Undergraduate" }, { value: "postgraduate", label: "Postgraduate" },
  { value: "professional", label: "Professional / skill" }, { value: "other", label: "Other" },
];
export const WEEKDAYS = [
  { value: "mon", label: "Mon" }, { value: "tue", label: "Tue" }, { value: "wed", label: "Wed" }, { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" }, { value: "sat", label: "Sat" }, { value: "sun", label: "Sun" },
];
export const TIMES = [
  { value: "morning", label: "Morning" }, { value: "afternoon", label: "Afternoon" }, { value: "evening", label: "Evening" },
  { value: "night", label: "Night" }, { value: "flexible", label: "Flexible" },
];
export const DURATIONS = [30, 45, 60, 90, 120];
export const VALID_FOR = [7, 15, 30];
// ADJUST: use the same subject and language lists as your tutor application / booking pages if you have them
export const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Accountancy", "Economics", "Malayalam", "Hindi", "Arabic", "Quran", "Coding", "Spoken English"];
export const LANGUAGES = ["English", "Malayalam", "Hindi", "Tamil", "Kannada", "Telugu", "Urdu", "Arabic"];

export const LIMITS = { titleMin: 5, titleMax: 100, subjectMin: 2, subjectMax: 50, descMin: 20, descMax: 1000, budgetMin: 50, budgetMax: 10000, maxLanguages: 5, maxStartAheadDays: 90 };

export const labelOf = (list: { value: string; label: string }[], value: string) => list.find((i) => i.value === value)?.label ?? value;

// local date as YYYY-MM-DD (the format <input type="date"> uses)
export const todayLocal = () => new Date().toLocaleDateString("en-CA");
export const addDaysLocal = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-CA"); };

export const emptyForm = (): IJobPostForm => ({
  title: "", subject: "", level: "", languages: [], description: "", budgetMin: "", budgetMax: "",
  sessionDuration: 60, preferredDays: [], preferredTime: "flexible", startDate: "", validForDays: 15,
});

export const toForm = (p: IJobPost): IJobPostForm => ({
  title: p.title, subject: p.subject, level: p.level, languages: [...p.languages], description: p.description,
  budgetMin: String(p.budgetMin), budgetMax: String(p.budgetMax), sessionDuration: p.sessionDuration,
  preferredDays: [...p.preferredDays], preferredTime: p.preferredTime, startDate: p.startDate, validForDays: p.validForDays,
});

export const toPayload = (f: IJobPostForm): JobPostPayload => ({
  ...f, title: f.title.trim(), subject: f.subject.trim(), description: f.description.trim(),
  budgetMin: Number(f.budgetMin), budgetMax: Number(f.budgetMax),
});

const CONTACT_INFO = /[\w.+-]+@[\w-]+\.[\w.-]+|(\+?\d[\s().-]*){10,}/;
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

// Same rules as the server. The server is still the final check.
export const validate = (f: IJobPostForm): Record<string, string> => {
  const e: Record<string, string> = {};
  const L = LIMITS;
  const title = oneLine(f.title), subject = oneLine(f.subject), desc = f.description.trim();

  if (title.length < L.titleMin) e.title = `Title must be at least ${L.titleMin} characters`;
  else if (title.length > L.titleMax) e.title = `Title can't be more than ${L.titleMax} characters`;

  if (subject.length < L.subjectMin) e.subject = "Enter the subject you need help with";
  else if (subject.length > L.subjectMax) e.subject = `Subject can't be more than ${L.subjectMax} characters`;
  else if (subject.includes(",")) e.subject = "Subject can't contain commas. Use 'and' instead.";

  if (!f.level) e.level = "Choose a level";
  if (f.languages.length === 0) e.languages = "Select at least one language";
  else if (f.languages.length > L.maxLanguages) e.languages = `Select up to ${L.maxLanguages} languages`;

  if (desc.length < L.descMin) e.description = `Describe what you need in at least ${L.descMin} characters`;
  else if (desc.length > L.descMax) e.description = `Description can't be more than ${L.descMax} characters`;
  else if (CONTACT_INFO.test(desc)) e.description = "Please don't add phone numbers or emails. Tutors will contact you through the in-app chat.";

  const min = Number(f.budgetMin), max = Number(f.budgetMax);
  const okBudget = (raw: string, n: number) => raw.trim() !== "" && Number.isInteger(n) && n >= L.budgetMin && n <= L.budgetMax;
  const range = `Enter a whole number from ₹${L.budgetMin} to ₹${L.budgetMax}`;
  if (!okBudget(f.budgetMin, min)) e.budgetMin = range;
  if (!okBudget(f.budgetMax, max)) e.budgetMax = range;
  else if (okBudget(f.budgetMin, min) && min > max) e.budgetMax = "Max budget can't be lower than min budget";

  if (f.preferredDays.length === 0) e.preferredDays = "Pick at least one day";

  if (!f.startDate) e.startDate = "Choose a start date";
  else if (f.startDate < todayLocal()) e.startDate = "Start date can't be in the past";
  else if (f.startDate > addDaysLocal(L.maxStartAheadDays)) e.startDate = `Start date must be within ${L.maxStartAheadDays} days from today`;

  return e;
};