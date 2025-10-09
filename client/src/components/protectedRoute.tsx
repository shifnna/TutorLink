import { Navigate } from "react-router-dom";
import { JSX, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user, isAuthenticated, blocked, fetchUser  } = useAuthStore();

  useEffect(() => {
    if (!user) fetchUser ();
  }, []);

  if (blocked) return <Navigate to="/blocked" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
