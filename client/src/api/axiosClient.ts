import axios from "axios";
import { useAuthStore } from "../store/authStore";
      
const axiosClient = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // //or from store
  },
});

//// Intercept responses globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403) {
      console.error("🚫 User Blocked:", message);
      const authStore = useAuthStore.getState();

      authStore.logout();
      useAuthStore.setState({blocked:true});

      window.location.replace("/blocked");
    } else if (status === 401) {
      console.warn("⚠️ Unauthorized:", message);
    } else if (status >= 400) {
      console.error("❌ API Error:", message || error.message);
    }

    //// Important: rethrow so service functions can catch too
    return Promise.reject(error);
  }
);

export default axiosClient;
