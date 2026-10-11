import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { JobPostError } from "../services/jobpostService.js";
import { parseJobPost, parseListQuery } from "../validators/jobpostValidator.js";
import { TYPES } from "../types/types.js";
import { IJobPostService } from "../services/interfaces/IJobpostService.js";

type Result = { status?: number; message?: string; data?: unknown };

// ADJUST: read the logged-in user the same way your other controllers do
const who = (req: Request) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = ((req as any).user ?? {}) as Record<string, unknown>;
  const id = String(u.id ?? u._id ?? u.userId ?? "");
  if (!id) throw new JobPostError("Please log in to continue", 401);
  return { id, role: String(u.role ?? "") };
};
const only = (role: string, ...allowed: string[]) => {
  if (!allowed.includes(role)) throw new JobPostError("You are not allowed to do this", 403);
};
const body = (req: Request) => {
  const r = parseJobPost(req.body);
  if (!r.ok) throw new JobPostError(r.message, 400, r.errors);
  return r.data;
};
const postId = (req: Request) => String(req.params.id);

@injectable()
export class JobPostController {
  constructor(@inject(TYPES.IJobpostService) private readonly service: IJobPostService) {}

  // one place for try/catch and the response shape: { success, message, data } or { success:false, message, errors }
  private run(fn: (req: Request) => Promise<Result>) {
    return async (req: Request, res: Response): Promise<void> => {
      try {
        const r = await fn(req);
        res.status(r.status ?? 200).json({ success: true, message: r.message, data: r.data });
      } catch (e) {
        if (e instanceof JobPostError) {
          res.status(e.statusCode).json({ success: false, message: e.message, errors: e.errors });
          return;
        }
        console.error("[JobPost]", e);
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
      }
    };
  }

  create = this.run(async (req) => {
    const u = who(req);
    only(u.role, "client");
    return { status: 201, message: "Requirement posted", data: await this.service.create(u.id, body(req)) };
  });

  update = this.run(async (req) => {
    const u = who(req);
    only(u.role, "client");
    return { message: "Requirement updated", data: await this.service.update(u.id, postId(req), body(req)) };
  });

  close = this.run(async (req) => {
    const u = who(req);
    only(u.role, "client");
    return { message: "Requirement closed", data: await this.service.close(u.id, postId(req)) };
  });

  remove = this.run(async (req) => {
    const u = who(req);
    only(u.role, "client");
    await this.service.remove(u.id, postId(req));
    return { message: "Requirement deleted" };
  });

  mine = this.run(async (req) => {
    const u = who(req);
    only(u.role, "client");
    return { data: await this.service.getMine(u.id, parseListQuery(req.query)) };
  });

  board = this.run(async (req) => {
    const u = who(req);
    only(u.role, "tutor", "admin");
    return { data: await this.service.getBoard(parseListQuery(req.query)) };
  });
}