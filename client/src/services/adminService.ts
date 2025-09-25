import axiosClient from "../api/axiosClient";

export const adminService = {
  getAllClients: async () => {
    const response = await axiosClient.get("/api/admin/clients");
    return response.data;
  },

  getAllTutors: async () => {
    const response = await axiosClient.get("/api/admin/tutors");
    console.log("tutors",response)
    return response.data;
  },

  getAllTutorApplications: async () => {
    const response = await axiosClient.get("/api/admin/tutor-applications");
    console.log("applications",response)
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await axiosClient.patch(`/api/admin/users/${id}/toggle`)
    return response.data;
  },
  
  approveTutor: async (userId:string) => {
    try {
      console.log('hello')
    const response = await axiosClient.patch(`/api/admin/users/approve/${userId}`);
    return response.data;
    } catch (err: any) {
    console.error("Axios error:", err.response?.data || err.message);
    throw err; 
    }
  },

  getDashboardStats: async () =>{
    return await axiosClient.get("/api/admin/dashboard-stats");
  }
};
