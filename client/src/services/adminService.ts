import axiosClient from "../api/axiosClient";
import { handleApi, ICommonResponse } from "../utils/apiHelper";
import { IUser } from "../types/IUser";
import { ITutorApplication } from "../types/ITutorApplication";
import { IAdminDashboardStats } from "../types/IAdminDashboard";
import { ROUTES } from "../utils/constants";

export const adminService = {
  getAllClients: async (): Promise<ICommonResponse<IUser[]>> =>
    handleApi<IUser[]>(axiosClient.get( `${ROUTES.ADMIN_API}/clients`)),

  getAllTutors: async (): Promise<ICommonResponse<IUser[]>> =>
    handleApi<IUser[]>(axiosClient.get(`${ROUTES.ADMIN_API}/tutors`)),

  getAllTutorApplications: async (): Promise<ICommonResponse<ITutorApplication[]>> =>
    handleApi<ITutorApplication[]>(axiosClient.get(`${ROUTES.ADMIN_API}/tutor-applications`)),

  toggleUserStatus: async (id: string): Promise<ICommonResponse<IUser>> =>
    handleApi<IUser>(axiosClient.patch(`${ROUTES.ADMIN_API}/users/${id}/toggle`)),

  approveTutor: async (userId: string): Promise<ICommonResponse<IUser>> =>
    handleApi<IUser>(axiosClient.patch(`${ROUTES.ADMIN_API}/users/approve/${userId}`)),

  getDashboardStats: async (): Promise<ICommonResponse<IAdminDashboardStats>> =>
    handleApi<IAdminDashboardStats>(axiosClient.get( `${ROUTES.ADMIN_API}/dashboard-stats`)),

  rejectTutor: async (userId: string, message: string): Promise<ICommonResponse<IUser>> =>
    handleApi<IUser>(axiosClient.patch(`${ROUTES.ADMIN_API}/users/reject/${userId}`, { message })),
};
