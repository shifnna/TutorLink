import { ITutor } from "../../models/tutor";
import { IUser } from "../../models/user";

export interface IAdminService {
  getAllClients(): Promise<IUser[]>;
  getAllTutors(): Promise<ITutor[]>;
  approveTutor(tutorId: string): Promise<ITutor>;
  rejectTutor(userId: string, message: string): Promise<void>;
  blockUser(userId: string): Promise<IUser>;
  unblockUser(userId: string): Promise<IUser>;
  getAllTutorApplications(): Promise<ITutor[]>;
  toggleUserStatus(userId: string): Promise<IUser>;
  getDashboardStats(): Promise<{ totalUsers: number; totalTutors: number; subscriptions: number; revenue: number; pendingApplications: ITutor[] }>
}
