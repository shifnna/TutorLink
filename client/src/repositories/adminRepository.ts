import axiosClient from "../api/axiosClient";

export const adminRepository = {
  getAllUsers: async () => {
    const response = await axiosClient.get("/api/admin/users");
    return response.data;
  },

  getAllTutors: async () => {
    const response = await axiosClient.get("/api/admin/tutor-applications");
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await axiosClient.patch(`/api/admin/users/${id}/toggle`)
    return response.data;
  },
  
  approveTutor: async (userId:string) => {
    try {
    const response = await axiosClient.patch(`/api/admin/users/approve/${userId}`);
    return response.data;
    } catch (err: any) {
    console.error("Axios error:", err.response?.data || err.message);
    throw err; 
    }
  }
};
