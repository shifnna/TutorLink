import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

export const useAuthInit = () => {
  const { fetchUser } = useAuthStore(); // fetchUser handles setUser, logout-like reset on error
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("useAuthInit: Starting fetchUser..."); // Debug log (remove in prod)
        await fetchUser(); // This fetches, sets user/isAuthenticated, or clears on error
        console.log("useAuthInit: fetchUser completed"); // Debug log
      } catch (err) {
        console.error("useAuthInit: Error during init", err); // Debug log
        // fetchUser already handles error state (sets user: null, isAuthenticated: false)
      } finally {
        setLoading(false); // Always stop loading (success, error, or timeout)
      }
    };

    init();

    // Fallback timeout: Force stop loading after 10s if stuck (safety net)
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("useAuthInit: Fallback timeout - stopping loader");
        setLoading(false);
      }
    }, 10000); // 10s max

    return () => clearTimeout(timeoutId); // Cleanup
  }, [fetchUser, loading]); // Re-run if needed, but typically once

  return loading;
};