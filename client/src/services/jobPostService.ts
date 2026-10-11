import axiosClient from "../api/axiosClient";
import { IJobFilterOptions, IJobPost, IJobPostList, IJobPostQuery, IJobPostResponse, JobPostPayload } from "../types/IJobPost";

type Failure = { response?: { status?: number; data?: unknown; config?: { url?: string } }; message?: string };

// Never throws. Always gives back { success, message, data, errors } so the UI code stays simple.
const call = async <T>(request: Promise<{ data: IJobPostResponse<T> }>): Promise<IJobPostResponse<T>> => {
  try {
    return (await request).data;
  } catch (e) {
    const err = e as Failure;
    const body = err.response?.data;
    // a normal reply from our API: { success: false, message, errors }
    if (body && typeof body === "object" && "success" in body) return { ...(body as IJobPostResponse<T>), success: false };

    // anything else (HTML 404 page, server down...): show a clear message and log the details for you
    const status = err.response?.status;
    console.error("[jobPostService] request failed:", { status: status ?? "no response", url: err.response?.config?.url, reason: err.message });
    const message =
      status === 404 ? "This page isn't ready on the server yet. Please try again later."
      : status === 401 ? "Please log in again to continue."
      : status && status >= 500 ? "The server had a problem. Please try again in a moment."
      : "Can't reach the server. Check your internet and try again.";
    return { success: false, message };
  }
};

// drop empty values and turn lists into "a,b,c" so the URL stays clean
const clean = (q: IJobPostQuery) =>
  Object.fromEntries(
    Object.entries(q)
      .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v])
  );

export const jobPostService = {
  create: (payload: JobPostPayload) => call<IJobPost>(axiosClient.post("/job-posts", payload)),
  update: (id: string, payload: JobPostPayload) => call<IJobPost>(axiosClient.patch(`/job-posts/${id}`, payload)),
  close: (id: string) => call<IJobPost>(axiosClient.patch(`/job-posts/${id}/close`)),
  remove: (id: string) => call<null>(axiosClient.delete(`/job-posts/${id}`)),
  getMine: (query: IJobPostQuery) => call<IJobPostList>(axiosClient.get("/job-posts/mine", { params: clean(query) })),
  getBoard: (query: IJobPostQuery) => call<IJobPostList>(axiosClient.get("/job-posts", { params: clean(query) })),
  getFilterOptions: () => call<IJobFilterOptions>(axiosClient.get("/job-posts/filters")),
};