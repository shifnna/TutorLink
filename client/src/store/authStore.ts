import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAuthState } from "../types/IAuthState";
import { authService } from "../services/authService";
import { IUser } from "../types/IUser";

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      accessToken: "",
      search: "",
      blocked: false,

      setAuthState: (data: Partial<IAuthState>) => set(data),

      setUser: (user: IUser | null) => set({ user, blocked: !!user?.isBlocked }),

      setSearch: (term) => set({ search: term }),

      setLoading: async (value: boolean) => {
        set({ isLoading: value });
      },

      fetchUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.fetchUser();
          const isBlocked = !!response.user?.blocked;
          set({
            user: response.user,
            isAuthenticated: !isBlocked,
            blocked: isBlocked,
            isLoading: false,
          });
        } catch (error: unknown) {
          let message = "Failed to fetch user";
          if (error instanceof Error) message = error.message;

          set({ user: null, isLoading: false, error: message });
          set({ isAuthenticated: false, blocked: false });
        }
      },

      signup: async (name, email, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signup({ name, email, password, confirmPassword });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.user;
        } catch (error: unknown) {
          let message = "Signup failed";
          if (error instanceof Error) message = error.message;
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      verifyOtp: async (email, otp, type) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.verifyOtp({ email, otp, type });
          set({
            user: response.user ?? null,
            isAuthenticated: type === "signup",
            isLoading: false,
          });
          return response;
        } catch (error: unknown) {
          let message = "OTP verification failed";
          if (error instanceof Error) message = error.message;
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      resendOtp: async (email, type) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.resendOtp({ email, type });
          set({ isLoading: false });
          return response;
        } catch (error: unknown) {
          let message = "Resend OTP failed";
          if (error instanceof Error) message = error.message;
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return response;
        } catch (error: unknown) {
          let message = "Login failed";
          if (error instanceof Error) message = error.message;
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      refreshAccessToken: async () => {
        try {
          const response = await authService.refreshToken();
          set({ accessToken: response.accessToken });
          return response.accessToken;
        } catch (error: unknown) {
          set({ user: null, accessToken: "", isAuthenticated: false });
          let message = "Failed to refresh token";
          if (error instanceof Error) message = error.message;
          throw new Error(message);
        }
      },

      requestPasswordReset: async (email, type) => {
        try {
          const response = await authService.resendOtp({ email, type });
          return response;
        } catch (error: unknown) {
          let message = "Request password reset failed";
          if (error instanceof Error) message = error.message;
          throw new Error(message);
        }
      },

      resetPassword: async (email, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.resetPassword({ email, password, confirmPassword });
          set({ isLoading: false });
          return response;
        } catch (error: unknown) {
          let message = "Reset password failed";
          if (error instanceof Error) message = error.message;
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      logout: async () => {
        try {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem("auth-storage");
          await authService.logout();
        } catch (error: unknown) {
          let message = "Logout failed";
          if (error instanceof Error) message = error.message;
          throw new Error(message);
        }
      },

      applyForTutor: async (
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
        ifsc
      ) => {
        set({ isLoading: true, error: null });
        try {
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
        } catch (error: unknown) {
          let message = "Tutor application failed";
          if (error instanceof Error) message = error.message;
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
