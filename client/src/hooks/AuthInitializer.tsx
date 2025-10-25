import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";

export const useAuthInit = () => {
  const { fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        //// Only refresh once on app start
        const userRes = await authService.fetchUser();

        //// Check if user is blocked or logged out
        const user = userRes.data;
        const isAuthenticated = !!user && !user.isBlocked;

        useAuthStore.setState({ user, isAuthenticated });

      } catch (err) {
        console.error("useAuthInit error:", err);
        useAuthStore.setState({ user: null, isAuthenticated: false });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return loading;
};

