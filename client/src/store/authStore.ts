import { create } from "zustand";
import { authRepository } from "../repositories/authRepository";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  signup: ( name: string, email: string, password: string, confirmPassword: string) => Promise<any>;

  verifyOtp: (email: string, otp: string, type: string) => Promise<any>;

  resendOtp: (email: string, type:string) => Promise<any>;

  login: (email: string, password: string) => Promise<any>;

  requestPasswordReset : (email:string,type:string) => Promise<any>;

  resetPassword : (email:string, password:string) => Promise<any>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  signup: async (name, email, password, confirmPassword) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authRepository.signup({
        name,
        email,
        password,
        confirmPassword,
      });

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response; 
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Signup failed",
      });
      throw error;
    }
  },

  verifyOtp: async (email: string, otp: string, type: string) => {
  try {
    set({ isLoading: true, error: null });
    const response = await authRepository.verifyOtp({ email, otp, type });
    set({ user: response.user, isAuthenticated: type==="signup", isLoading: false });
    return response;
  } catch (error: any) {
    set({ isLoading: false, error: error.response?.data?.error || "OTP failed" });
    throw error;
  }
  },

  resendOtp: async (email:string,type:string) => {
    try {
      set({ isLoading: true, error: null });
      const response =  await authRepository.resendOtp({email,type});
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({
      isLoading: false,
      error: error.response?.data?.error || "Resend OTP failed",
    });
    throw error;
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authRepository.login({ email, password });

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Login failed",
      });
      throw error;
    }
  },

  requestPasswordReset: async (email:string,type:string) => {
    try {
      const response = await authRepository.resendOtp({email,type});
      return response
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email: string, password: string) => {
  try {
    set({ isLoading: true, error: null });
    const response = await authRepository.resetPassword({ email, password });
    set({ isLoading: false });
    return response;
  } catch (error: any) {
    set({ isLoading: false, error: error.response?.data?.error || "Reset failed" });
    throw error;
  }
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));
