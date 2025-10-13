import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";
      
const axiosClient = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true
});


//// Attach access token to requests
axiosClient.interceptors.request.use((config)=>{
  const token = useAuthStore.getState().accessToken;
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


//// Handle responses globally
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message;

    if (originalRequest.url?.includes("/refresh")) {
      return Promise.reject(error);
    }
    
    //// 🚫 Blocked user
    if (error.response?.status === 403) {
      console.error("🚫 User Blocked:", message);
      useAuthStore.getState().logout();
      useAuthStore.setState({blocked:true});
      window.location.replace("/blocked");
      return Promise.reject(error);
    }

    //// ⚠️ Unauthorized - try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await authService.refresh();
        useAuthStore.setState({ accessToken: data.accessToken });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest); ////retry
      } catch (refreshError) {
        console.warn("🔁 Refresh token expired or invalid. Logging out...");
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    //// ❌ Other API errors
    if (error.response?.status >= 400) {
      console.error("❌ API Error:", message || error.message);
    }

    //// Important: rethrow so service functions can catch too
    return Promise.reject(error);
  }
);

export default axiosClient;
