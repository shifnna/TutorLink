
// GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { JSX, useEffect } from "react";

interface Props {
  children: JSX.Element;
}

const GuestRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, fetchUser, user } = useAuthStore();

  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export default GuestRoute;
