import { IJobPost, JobPostLean } from "../../models/jobPost.js";
import { Types } from "mongoose";

export type JobListFilter = {
  page: number; limit: number; search?: string; subject?: string; language?: string;
  status?: "open" | "closed" | "expired"; minBudget?: number; sort?: "newest" | "budget_high" | "budget_low";
};
export type JobPostWithClient = Omit<JobPostLean, "clientId"> & { clientId: { _id: Types.ObjectId; name?: string } | null };
export type NewJobPost = Omit<IJobPost, "closedAt">;
type Page<T> = { items: T[]; total: number };
// plain object filter, so this file compiles on any mongoose version (the filter type was renamed in v9)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Filter = Record<string, any>;


export interface IJobPostRepository {
  create(data: NewJobPost): Promise<JobPostLean>;
  findOwned(id: string, clientId: string): Promise<JobPostLean | null>;
  update(id: string, data: Partial<IJobPost>): Promise<JobPostLean | null>;
  countOpen(clientId: string): Promise<number>;
  titleExists(clientId: string, titleKey: string, excludeId?: string): Promise<boolean>;
  listByClient(clientId: string, f: JobListFilter): Promise<Page<JobPostLean>>;
  listOpen(f: JobListFilter): Promise<Page<JobPostWithClient>>;
}