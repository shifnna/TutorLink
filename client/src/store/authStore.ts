import { create } from "zustand";
import { IAuthState } from "../types/IAuthState";
import { authService } from "../services/authService";

export const useAuthStore = create<IAuthState>()(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      search: "",
      blocked: false,
      accessToken: null,
      
      setUser: (user: any) => set({ user, blocked: !!user?.blocked }),

      setSearch: (term) => set({ search: term }),

      fetchUser: async () => {
        try {
          set({ isLoading: true});
          const response = await authService.fetchUser ();
          const isBlocked = !!response.user?.blocked;
          set({ user: response.user, isAuthenticated: !isBlocked, blocked: isBlocked, isLoading: false });
        } catch (error: any) {
          set({ user: null, isLoading: false });
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
          set({ isLoading: true });
          const response = await authService.signup({name,email,password,confirmPassword,});

          set({user: response.user,isAuthenticated: true,isLoading: false});

          return response;
        } catch (error: any) {
          set({isLoading: false});
          throw error;
        }
      },

      verifyOtp: async (email: string, otp: string, type: string) => {
        try {
          set({ isLoading: true });
          const response = await authService.verifyOtp({ email, otp, type });
          set({user: response.user,isAuthenticated: type === "signup",isLoading: false,});
          return response;
        } catch (error: any) {
          set({isLoading: false});
          throw error;
        }
      },

      resendOtp: async (email: string, type: string) => {
        try {
          set({ isLoading: true});
          const response = await authService.resendOtp({ email, type });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({isLoading: false});
          throw error;
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true});
          const response = await authService.login({ email, password });

          set({user: response.user,isAuthenticated: true,isLoading: false,accessToken: response.accessToken});

          return response;
        } catch (error: any) {
          set({isLoading: false});
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
          set({ isLoading: true});
          const response = await authService.resetPassword({email,password,confirmPassword});
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({isLoading: false});
          throw error;
        }
      },

      logout: async () => {
        try {   
          const response = await authService.logout();
          set({ user: null, isAuthenticated: false,accessToken:null });
          return response;
        } catch (error) {
          throw error;
        }
      },

      applyForTutor: async ( description: string, languages: string, education: string, skills: string, experienceLevel: string, gender: string, occupation: string, profileImage: string | null, certificates: string | null, accountHolder: string, accountNumber: number, bankName: string, ifsc: string ) => {
        try {
          set({ isLoading: true});
          const response = await authService.applyForTutor({ description,languages,education,skills,experienceLevel,gender,occupation,profileImage,certificates,accountHolder,accountNumber,bankName,ifsc,
          });
          set({ isLoading: false });
          return response;
        } catch (error) {
          throw error;
        }
      },
    }),
);
