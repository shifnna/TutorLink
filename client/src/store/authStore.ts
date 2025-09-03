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

  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<any>;

  verifyOtp: (email: string, otp: string) => Promise<any>;

  login: (email: string, password: string) => Promise<any>;

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

  verifyOtp: async (email: string, otp: string) => {
  try {
    set({ isLoading: true, error: null });
    const response = await authRepository.verifyOtp({ email, otp });
    set({ user: response.user, isAuthenticated: true, isLoading: false });
    return response;
  } catch (error: any) {
    set({ isLoading: false, error: error.response?.data?.error || "OTP failed" });
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

  logout: () => set({ user: null, isAuthenticated: false }),
}));
