import axiosClient from "../api/axiosClient";

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
    localStorage.setItem("token", response.data.token); 
    return response.data; 
  },

  verifyOtp: async (data: { email: string; otp: string, type:string }) => {
  const response = await axiosClient.post("/api/auth/verify-otp", data)
  return response.data;
  },

  resendOtp: async (data:any) => { //same for send otp to reset pass
  const response = await axiosClient.post("/api/auth/resend-otp", data)
  return response.data;
  },
  
  resetPassword: async (data: { email: string; password: string }) => {
  const response = await axiosClient.post("/api/auth/reset-password", data);
  return response.data;
  },

  logout: async ()=>{
    const response = await axiosClient.post("/api/auth/logout")
    return response.data;
  },

  applyForTutor: async (data:{description: string,languages: string,education: string,skills: string,experienceLevel: string,gender: string,occupation: string,profileImage: string | null,certificates: string | null,accountHolder: string,accountNumber: number,bankName: string,ifsc: string})=>{
    console.log("my data",data)
    const response = await axiosClient.post("/api/user/apply-for-tutor",data)
    return response.data;
  }
};
