import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";
      
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000", 
  withCredentials: true
});


//// Handle responses globally
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //// If refresh also fails
    if (error.response?.status === 403) {
      console.warn("🔒 Refresh token invalid. Logging out...");
      useAuthStore.getState().logout();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    //// If access token expired, try refresh endpoint once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.refresh(); //// backend sets new cookie automatically
        return axiosClient(originalRequest); //// retry request
      } catch (err) {
        useAuthStore.getState().logout();
        window.location.replace("/login");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
