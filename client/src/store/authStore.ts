import { create } from "zustand";
import { IAuthState } from "../types/IAuthState";
import { authService } from "../services/authService";
import { IUser } from "../types/IUser";
import { ITutorApplicationForm } from "../types/ITutorApplication";

export const useAuthStore = create<IAuthState>()(
  (set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    search: "",
    blocked: false,

    setUser: (user: IUser) => set({ user, blocked: !!user?.isBlocked }),

    setSearch: (term) => set({ search: term }),

    fetchUser: async () => {
      set({ isLoading: true });
      const response = await authService.fetchUser();
      set({ isLoading: false });

      if (!response.success || !response.data || !response.data) {
        set({ user: null, isAuthenticated: false, blocked: false });
        throw new Error(response.message);
      }

      const user : IUser = response.data;
      const blocked : boolean = !!user?.isBlocked;
      set({ user, blocked, isAuthenticated: !blocked });
    },

    signup: async (name, email, password, confirmPassword) => {
      set({ isLoading: true });
      const response = await authService.signup({ name, email, password, confirmPassword });
      set({ isLoading: false });

      if (!response.success || !response.data) throw new Error(response.message);

      set({ user: response.data, isAuthenticated: true });
      return response;
    },

    login: async (email, password) => {
      set({ isLoading: true });
      const response = await authService.login({ email, password });
      set({ isLoading: false });

      if (!response.success || !response.data) throw new Error(response.message);

      set({ user: response.data, isAuthenticated: true });
      return response;
    },

    verifyOtp: async (email, otp, type) => {
      set({ isLoading: true });
      const response = await authService.verifyOtp({ email, otp, type });
      set({ isLoading: false });

      if (!response.success) throw new Error(response.message);

      const user = response.data?.user;
      set({ user , isAuthenticated: type === "signup" });
      return {
       user,
       success: response.success,
      };
    },

    resendOtp: async (email, type) => {
      set({ isLoading: true });
      const response = await authService.resendOtp({ email, type });
      set({ isLoading: false });

      if (!response.success) throw new Error(response.message);
      return response.data!;
    },

    requestPasswordReset: async (email, type) => {
      const response = await authService.resendOtp({ email, type });
      if (!response.success) throw new Error(response.message);
      return response.data!;
    },

    resetPassword: async (email, password, confirmPassword) => {
      set({ isLoading: true });
      const response = await authService.resetPassword({ email, password, confirmPassword });
      set({ isLoading: false });

      if (!response.success) throw new Error(response.message);
      return response.data!;
    },

    logout: async () => {
      const response = await authService.logout();
      if (!response.success) throw new Error(response.message);
      set({ user: null, isAuthenticated: false });
    },

    applyForTutor: async (payload: ITutorApplicationForm) => {
      set({ isLoading: true });
      const response = await authService.applyForTutor(payload);
      set({ isLoading: false });

      if (!response.success) throw new Error(response.message);
      return response.data!;
    },
  })
);
