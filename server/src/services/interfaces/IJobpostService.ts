import { JobListFilter } from "../../repositories/jobpostRepository.js";
import { JobPostInput } from "../../validators/jobpostValidator.js";
import { BoardView, JobPostView } from "../jobpostService.js";

type Effective = "open" | "closed" | "expired";
// "expired" is worked out from expiresAt, so no cron job is needed
const withStatus = <T extends { status: string; expiresAt: Date }>(p: T): T & { effectiveStatus: Effective } => ({
  ...p,
  effectiveStatus: p.status === "closed" ? "closed" : p.expiresAt.getTime() <= Date.now() ? "expired" : "open",
});
const paged = <T extends { status: string; expiresAt: Date }>(r: { items: T[]; total: number }, f: JobListFilter): Paged<T & { effectiveStatus: Effective }> => ({
  items: r.items.map(withStatus), total: r.total, page: f.page, totalPages: Math.max(1, Math.ceil(r.total / f.limit)),
});

type Paged<T> = { items: T[]; total: number; page: number; totalPages: number };

export interface IJobPostService {
  create(clientId: string, input: JobPostInput): Promise<JobPostView>;
  update(clientId: string, id: string, input: JobPostInput): Promise<JobPostView>;
  close(clientId: string, id: string): Promise<JobPostView>;
  remove(clientId: string, id: string): Promise<void>;
  getMine(clientId: string, f: JobListFilter): Promise<Paged<JobPostView>>;
  getBoard(f: JobListFilter): Promise<Paged<BoardView>>;
}