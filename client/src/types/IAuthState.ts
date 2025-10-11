import { IUser } from "./IUser";

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  search: string;
  blocked: boolean;
  accessToken: string;

  setUser: (user: IUser | null) => void;
  setAuthState: (data: Partial<IAuthState>) => void;
  setSearch: (term: string) => void;

  fetchUser: () => Promise<void>;

  setLoading: (value: boolean) => Promise<void>;

  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<IUser>;

  verifyOtp: (email: string, otp: string, type: string) => Promise<{ user?: IUser; success?: boolean }>;

  resendOtp: (email: string, type: string) => Promise<{ message: string }>;

  login: (email: string, password: string) => Promise<{ user: IUser; accessToken: string }>;

  refreshAccessToken: () => Promise<string>;

  requestPasswordReset: (email: string, type: string) => Promise<{ message: string }>;

  resetPassword: (email: string, password: string, confirmPassword: string) => Promise<{ message: string }>;

  logout: () => Promise<void>;

  applyForTutor: (
    description: string,
    languages: string,
    education: string,
    skills: string,
    experienceLevel: string,
    gender: string,
    occupation: string,
    profileImage: string | null,
    certificates: string | null,
    accountHolder: string,
    accountNumber: number,
    bankName: string,
    ifsc: string
  ) => Promise<{ message: string }>;
}
