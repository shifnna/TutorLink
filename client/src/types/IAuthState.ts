import { IUser } from "./IUser";

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  search: string;
  blocked: boolean;
  
  setUser: (user: any) => void,

  setSearch: (term: string) => void;

  fetchUser: () => Promise<void>,

  signup: ( name: string, email: string, password: string, confirmPassword: string) => Promise<any>;

  verifyOtp: (email: string, otp: string, type: string) => Promise<any>;

  resendOtp: (email: string, type:string) => Promise<any>;

  login: (email: string, password: string) => Promise<any>;

  requestPasswordReset : (email:string,type:string) => Promise<any>;

  resetPassword : (email:string, password:string, confirmPassword:string) => Promise<any>;

  logout: () => void;

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
  ) => Promise<any>;
}