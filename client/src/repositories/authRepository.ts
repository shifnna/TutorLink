import axiosClient from "../api/anxiosClient";

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authRepository = {
  signup: async (data: SignupData) => {
    const response = await axiosClient.post("/api/auth/signup", data);
    return response.data; 
  },

  login: async (data: LoginData) => {
    const response = await axiosClient.post("/api/auth/login", data);
    return response.data; 
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
  const response = await axiosClient.post("/api/auth/verify-otp", data)
  return response.data;
  },

};
