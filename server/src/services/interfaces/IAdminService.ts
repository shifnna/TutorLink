import { ClientsQueryDTO, PaginatedClientsDTO } from "../../controllers/adminController";
import { generateLinkDTO, rejectTutorDTO } from "../../dtos/admin.dto";
import { LoginRequestDTO } from "../../dtos/auth.dto";
import { IUserWithTutorDTO } from "../../dtos/tutor.dto";
import { ISession } from "../../models/session";
import { ITutor } from "../../models/tutor";
import { IUser } from "../../models/user";

export interface IAdminService {
  getAllClients(query: ClientsQueryDTO): Promise<PaginatedClientsDTO>;
  getAllTutors(): Promise<IUserWithTutorDTO[]>;
  approveTutor(tutorId: string): Promise<ITutor>;
  rejectTutor(userId: string, dto: rejectTutorDTO): Promise<void>;
  blockUser(userId: string): Promise<IUser>;
  unblockUser(userId: string): Promise<IUser>;
  getAllTutorApplications(): Promise<ITutor[]>;
  toggleUserStatus(userId: string): Promise<IUser>;
  getDashboardStats(): Promise<{ totalUsers: number; totalTutors: number; subscriptions: number; revenue: number; pendingApplications: ITutor[] }>;
  getAllSessions(): Promise<ISession[]>;
  generateLink(dto: generateLinkDTO): Promise<string>;
  releasePayment(sessionId: string): Promise<void>;
  adminLogin(dto: LoginRequestDTO): Promise<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}>;
}
