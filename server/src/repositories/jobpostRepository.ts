import { injectable } from "inversify";
import { Types } from "mongoose";
import { IJobPost, JobPostLean, JobPostModel } from "../models/jobPost.js";
import { IJobPostRepository } from "./interfaces/IJobpostRepository.js";

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


const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // so user text can't act as a regex
const SORTS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  budget_high: { budgetMax: -1, createdAt: -1 },
  budget_low: { budgetMin: 1, createdAt: -1 },
};
// "open" = not deleted, status open and not past its expiry date
const openQuery = (): Filter => ({ isDeleted: false, status: "open", expiresAt: { $gt: new Date() } });

@injectable()
export class JobPostRepository implements IJobPostRepository {
  async create(data: NewJobPost): Promise<JobPostLean> {
    const doc = await JobPostModel.create(data);
    return doc.toObject() as unknown as JobPostLean;
  }

  async findOwned(id: string, clientId: string): Promise<JobPostLean | null> {
    return await JobPostModel.findOne({ _id: id, clientId, isDeleted: false }).lean<JobPostLean>();
  }

  async update(id: string, data: Partial<IJobPost>): Promise<JobPostLean | null> {
    return await JobPostModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true, runValidators: true }).lean<JobPostLean>();
  }

  async countOpen(clientId: string): Promise<number> {
    return await JobPostModel.countDocuments({ clientId, ...openQuery() });
  }

  async titleExists(clientId: string, titleKey: string, excludeId?: string): Promise<boolean> {
    const q: Filter = { clientId, titleKey, ...openQuery(), ...(excludeId ? { _id: { $ne: excludeId } } : {}) };
    return (await JobPostModel.exists(q)) !== null;
  }

  async listByClient(clientId: string, f: JobListFilter): Promise<Page<JobPostLean>> {
    const now = new Date();
    const byStatus: Filter =
      f.status === "open" ? { status: "open", expiresAt: { $gt: now } }
      : f.status === "expired" ? { status: "open", expiresAt: { $lte: now } }
      : f.status === "closed" ? { status: "closed" }
      : {};
    return this.paginate<JobPostLean>({ clientId, isDeleted: false, ...byStatus }, f);
  }

  async listOpen(f: JobListFilter): Promise<Page<JobPostWithClient>> {
    const q: Record<string, unknown> = { ...openQuery() };
    if (f.search) {
      const re = { $regex: esc(f.search), $options: "i" };
      q.$or = [{ title: re }, { subject: re }, { description: re }];
    }
    if (f.subject) q.subject = { $regex: `^${esc(f.subject)}$`, $options: "i" };
    if (f.language) q.languages = { $regex: `^${esc(f.language)}$`, $options: "i" };
    if (f.minBudget) q.budgetMax = { $gte: f.minBudget }; // tutor wants to earn at least this per hour
    return this.paginate<JobPostWithClient>(q as Filter, f, true);
  }

  private async paginate<T>(q: Filter, f: JobListFilter, withClient = false): Promise<Page<T>> {
    const find = JobPostModel.find(q).sort(SORTS[f.sort ?? "newest"]).skip((f.page - 1) * f.limit).limit(f.limit);
    if (withClient) find.populate("clientId", "name"); // only the name, never email/phone
    const [items, total] = await Promise.all([find.lean<T[]>(), JobPostModel.countDocuments(q)]);
    return { items, total };
  }
}