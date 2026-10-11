export type JobStatus = "open" | "closed" | "expired";

export interface IJobPost {
  _id: string;
  clientId: string | { _id: string; name?: string } | null; // an object (with name) on the tutor board
  title: string;
  subject: string;
  level: string;
  languages: string[];
  description: string;
  budgetMin: number;
  budgetMax: number;
  sessionDuration: number;
  preferredDays: string[];
  preferredTime: string;
  startDate: string; // YYYY-MM-DD
  validForDays: number;
  expiresAt: string;
  status: "open" | "closed";
  effectiveStatus: JobStatus; // "expired" is worked out by the server
  createdAt: string;
}

// what the form holds (budget stays a string while typing)
export interface IJobPostForm {
  title: string; subject: string; level: string; languages: string[]; description: string;
  budgetMin: string; budgetMax: string; sessionDuration: number; preferredDays: string[];
  preferredTime: string; startDate: string; validForDays: number;
}
export type JobPostPayload = Omit<IJobPostForm, "budgetMin" | "budgetMax"> & { budgetMin: number; budgetMax: number };

export interface IJobPostList { items: IJobPost[]; total: number; page: number; totalPages: number }
export interface IJobPostQuery {
  page?: number; limit?: number; search?: string; status?: string; minBudget?: number; sort?: string;
  subjects?: string[]; languages?: string[]; levels?: string[];
}
export interface IJobFilterOptions { subjects: string[]; languages: string[] }
export interface IJobPostResponse<T> { success: boolean; message?: string; data?: T; errors?: Record<string, string> }