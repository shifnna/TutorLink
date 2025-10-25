import { ITutorApplication } from "./ITutorApplication";


export interface IAdminDashboardStats {
  totalUsers: number;
  totalTutors: number;
  subscriptions: number;
  revenue: number;
  pendingApplications: ITutorApplication[];
}