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
        if (!useAuthStore.getState().accessToken) {
          const data = await authService.refresh();
          if (data?.accessToken) {
            useAuthStore.setState({ accessToken: data.accessToken });
          }
        }

        await fetchUser();
      } catch (err) {
        console.error("useAuthInit error:", err);
        useAuthStore.setState({ user: null, isAuthenticated: false, accessToken: null });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchUser]);

  return loading;
};
