import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { JOB_LIMITS } from "../models/jobPost.js";
import { JobListFilter, JobPostWithClient } from "../repositories/jobpostRepository.js";
import { JobPostInput } from "../validators/jobpostValidator.js";
import type { JobPostLean } from "../models/jobPost.js";
import { TYPES } from "../types/types.js";
import { IJobPostService } from "./interfaces/IJobpostService.js";
import { IJobPostRepository } from "../repositories/interfaces/IJobpostRepository.js";

export class JobPostError extends Error {
  constructor(message: string, public statusCode = 400, public errors?: Record<string, string>) {
    super(message);
  }
}

type Effective = "open" | "closed" | "expired";
type Paged<T> = { items: T[]; total: number; page: number; totalPages: number };
export type JobPostView = JobPostLean & { effectiveStatus: Effective };
export type BoardView = JobPostWithClient & { effectiveStatus: Effective };

const DAY_MS = 24 * 60 * 60 * 1000;
const ID = /^[a-f\d]{24}$/i;

// "expired" is worked out from expiresAt, so no cron job is needed
const withStatus = <T extends { status: string; expiresAt: Date }>(p: T): T & { effectiveStatus: Effective } => ({
  ...p,
  effectiveStatus: p.status === "closed" ? "closed" : p.expiresAt.getTime() <= Date.now() ? "expired" : "open",
});
const paged = <T extends { status: string; expiresAt: Date }>(r: { items: T[]; total: number }, f: JobListFilter): Paged<T & { effectiveStatus: Effective }> => ({
  items: r.items.map(withStatus), total: r.total, page: f.page, totalPages: Math.max(1, Math.ceil(r.total / f.limit)),
});

@injectable()
export class JobPostService implements IJobPostService {
  constructor(@inject(TYPES.IJobpostRepository) private readonly repo: IJobPostRepository) {}

  // 404 for "not yours" too, so nobody can find out which ids exist
  private async owned(id: string, clientId: string) {
    const post = ID.test(id) ? await this.repo.findOwned(id, clientId) : null;
    if (!post) throw new JobPostError("Requirement not found. It may have been deleted.", 404);
    return post;
  }

  private async noDuplicate(clientId: string, titleKey: string, excludeId?: string) {
    if (await this.repo.titleExists(clientId, titleKey, excludeId)) {
      const message = "You already have an open requirement with this title. Change the title or close the old one.";
      throw new JobPostError(message, 409, { title: message });
    }
  }

  async create(clientId: string, input: JobPostInput) {
    if ((await this.repo.countOpen(clientId)) >= JOB_LIMITS.maxOpenPerClient) {
      throw new JobPostError(`You can keep up to ${JOB_LIMITS.maxOpenPerClient} requirements open at once. Close one to post a new one.`, 400);
    }
    const titleKey = input.title.toLowerCase();
    await this.noDuplicate(clientId, titleKey);
    const post = await this.repo.create({
      ...input, titleKey, clientId: new Types.ObjectId(clientId), status: "open", isDeleted: false,
      expiresAt: new Date(Date.now() + input.validForDays * DAY_MS),
    });
    return withStatus(post);
  }

  async update(clientId: string, id: string, input: JobPostInput) {
    const post = await this.owned(id, clientId);
    if (post.status === "closed") throw new JobPostError("A closed requirement can't be edited. Post a new one instead.", 400);
    if (post.expiresAt.getTime() <= Date.now()) throw new JobPostError("This requirement has expired. Post a new one instead.", 400);
    const titleKey = input.title.toLowerCase();
    await this.noDuplicate(clientId, titleKey, id);
    const { title, subject, level, languages, description, budgetMin, budgetMax, sessionDuration, preferredDays, preferredTime, startDate } = input;
    // expiry date is not changed on edit
    const updated = await this.repo.update(id, { title, titleKey, subject, level, languages, description, budgetMin, budgetMax, sessionDuration, preferredDays, preferredTime, startDate });
    if (!updated) throw new JobPostError("Requirement not found. It may have been deleted.", 404);
    return withStatus(updated);
  }

  async close(clientId: string, id: string) {
    const post = await this.owned(id, clientId);
    if (post.status === "closed") return withStatus(post); // closing twice is fine
    const closed = await this.repo.update(id, { status: "closed", closedAt: new Date() });
    if (!closed) throw new JobPostError("Requirement not found. It may have been deleted.", 404);
    return withStatus(closed);
  }

  async remove(clientId: string, id: string) {
    await this.owned(id, clientId);
    await this.repo.update(id, { isDeleted: true }); // soft delete, data is kept
  }

  async getMine(clientId: string, f: JobListFilter) {
    return paged(await this.repo.listByClient(clientId, f), f);
  }

  async getBoard(f: JobListFilter) {
    return paged(await this.repo.listOpen(f), f);
  }
}