import { ITutor } from "../../models/tutor";

export interface DashboardStatsResponseDTO {
  totalUsers: number;
  totalTutors: number;
  subscriptions: number;
  revenue: number;
  pendingApplications: ITutor[];
}