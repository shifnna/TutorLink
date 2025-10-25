import axiosClient from "../api/axiosClient";
import { IUser } from "../types/IUser";
import { ITutorApplicationForm, ITutorApplication } from "../types/ITutorApplication";
import { LoginData, ResendOtpPayload, SignupData, VerifyOtpData, ResetPasswordData } from "../types/IAuthState";
import { handleApi } from "../utils/apiHelper";
import { ROUTES } from "../utils/constants";

export const authService = {
  fetchUser: async () => 
    handleApi<IUser>(axiosClient.get("/api/auth/me")),
  
  signup: async (data: SignupData) => 
    handleApi<IUser>(axiosClient.post( `${ROUTES.AUTH_API}/signup`, data)),

  login: async (data: LoginData) => 
    handleApi<IUser>(axiosClient.post( `${ROUTES.AUTH_API}/login`, data)),

  verifyOtp: async (data: VerifyOtpData) => 
    handleApi<{ user: IUser }>(axiosClient.post( `${ROUTES.AUTH_API}/verify-otp`, data)),

  resendOtp: async (data: ResendOtpPayload) => 
    handleApi<{ message: string }>(axiosClient.post( `${ROUTES.AUTH_API}/resend-otp`, data)),

  resetPassword: async (data: ResetPasswordData) => 
    handleApi<{ message: string }>(axiosClient.post( `${ROUTES.AUTH_API}/reset-password`, data)),

  logout: async () => 
    handleApi<null>(axiosClient.post( `${ROUTES.AUTH_API}/logout`)),

  applyForTutor: async (data: ITutorApplicationForm) => 
    handleApi<ITutorApplication>(axiosClient.post( `${ROUTES.AUTH_API}/apply-for-tutor`, data)),

  refresh: async () => 
    handleApi<{ accessToken: string }>(axiosClient.post( `${ROUTES.AUTH_API}/refresh`, {})),
};
