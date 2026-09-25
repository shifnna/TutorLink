import { ITutor } from "../models/tutor.js";

export interface DashboardStatsResponseDTO {
  totalUsers: number;
  totalTutors: number;
  subscriptions: number;
  revenue: number;
  pendingApplications: ITutor[];
}

export interface rejectTutorDTO{
  message:string;
}
