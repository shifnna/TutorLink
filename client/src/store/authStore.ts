import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAuthState } from "../types/IAuthState";
import { authService } from "../services/authService";

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      search: "",
      blocked: false,
  
      setAuthState: (data: Partial<IAuthState>) => set(data),
      
      setUser: (user: any) => set({ user, blocked: !!user?.blocked }),

      setSearch: (term) => set({ search: term }),
      
      setLoading: async (value: boolean) => set({ isLoading: value }),

      fetchUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.fetchUser ();
          set({ user: response.user, isAuthenticated: true, blocked: !!response.user?.blocked, isLoading: false });
        } catch (error: any) {
          set({ user: null, isLoading: false, error: error?.message || null });
          if (error?.response?.status === 401) {
            set({ isAuthenticated: false, blocked: false });
          } else if (error?.response?.status === 403) {
            set({ isAuthenticated: true, blocked: true });
          } else {
            set({ isAuthenticated: false, blocked: false });
          }
        }
      },

      signup: async (name, email, password, confirmPassword) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.signup({
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
          const response = await authService.verifyOtp({ email, otp, type });
          set({
            user: response.user,
            isAuthenticated: type === "signup",
            isLoading: false,
          });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "OTP failed",
          });
          throw error;
        }
      },

      resendOtp: async (email: string, type: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.resendOtp({ email, type });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
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
          const response = await authService.login({ email, password });

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

      requestPasswordReset: async (email: string, type: string) => {
        try {
          const response = await authService.resendOtp({ email, type });
          return response;
        } catch (error) {
          throw error;
        }
      },

      resetPassword: async (email: string, password: string, confirmPassword:string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.resetPassword({
            email,
            password,
            confirmPassword
          });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Reset failed",
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ user: null, isAuthenticated: false });
          const response = await authService.logout();
          return response;
        } catch (error) {
          throw error;
        }
      },

      applyForTutor: async (
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
      ) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.applyForTutor({
            description,
            languages,
            education,
            skills,
            experienceLevel,
            gender,
            occupation,
            profileImage,
            certificates,
            accountHolder,
            accountNumber,
            bankName,
            ifsc,
          });
          set({ isLoading: false });
          return response;
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these
    }
  )
);
