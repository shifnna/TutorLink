import { ICommonResponse } from "../utils/apiHelper";
import { ITutorApplication, ITutorApplicationForm } from "./ITutorApplication";
import { IUser } from "./IUser";

export interface ResendOtpPayload {
  email: string;
  type?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp : string;
  type : string;
}

export interface ResetPasswordData {
  password: string;
  email: string;
  confirmPassword: string;
}

export interface AuthSuccessData { 
  user?: IUser; 
  success?: boolean 
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  search: string;
  blocked: boolean;
  
  setUser: (user: IUser) => void,

  setSearch: (term: string) => void;

  fetchUser: () => Promise<void>,

  signup: ( name: string, email: string, password: string, confirmPassword: string) => Promise<ICommonResponse<IUser>>;

  verifyOtp: (email: string, otp: string, type: string) => Promise<AuthSuccessData>;

  resendOtp: (email: string, type:string) => Promise<{ message: string }>;

  login: (email: string, password: string) => Promise<ICommonResponse<IUser>>;

  requestPasswordReset : (email:string,type:string) => Promise<{ message: string }>;

  resetPassword : (email:string, password:string, confirmPassword:string) => Promise<{ message: string }>;

  logout: () => Promise<void>;

  applyForTutor: ( payload:ITutorApplicationForm ) => Promise<ITutorApplication>;
}

