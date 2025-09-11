import axiosClient from "../api/anxiosClient";

export const adminRepository = {
  getAllUsers: async () => {
    const response = await axiosClient.get("/api/admin/users");
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const res = await axiosClient.patch(`/api/admin/users/${id}/toggle`)
    return res.data;
  },  
};
