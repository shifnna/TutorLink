import React from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, LogOut, User, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const TutorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-black/30 backdrop-blur-xl border-r border-violet-800/40 flex flex-col p-6 sticky top-0 h-screen shadow-2xl text-white">
      <h4 className="text-3xl font-extrabold mb-10 bg-gradient-to-r from-indigo-400 via-pink-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
        Tutor Panel
      </h4>

      <nav className="flex flex-col gap-3 text-gray-300">
        {/* Dashboard */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentPath === "/user-dashboard"
              ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-pink-700/40 text-white"
              : "hover:bg-violet-900/40 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 opacity-90" /> Dashboard
        </motion.button>

        {/* Profile */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/user-profile")}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentPath === "/user-profile"
              ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-pink-700/40 text-white"
              : "hover:bg-violet-900/40 hover:text-white"
          }`}
        >
          <User className="w-5 h-5 opacity-90" /> Profile
        </motion.button>

        {/* Session Management */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/session-management")}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentPath === "/session-management"
              ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-pink-700/40 text-white"
              : "hover:bg-violet-900/40 hover:text-white"
          }`}
        >
          <Calendar className="w-5 h-5 opacity-90" /> Session Management
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentPath === "/tutor/notifications"
              ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-pink-700/40 text-white"
              : "hover:bg-violet-900/40 hover:text-white"
          }`}
        >
          <Bell className="w-5 h-5 opacity-90" /> Notifications
        </motion.button>
      </nav>

      <div className="mt-auto">
        <Button
          onClick={handleLogout}
          className="w-full mt-6 bg-gradient-to-r from-red-500 via-rose-600 to-pink-500 hover:from-red-400 hover:to-pink-500 text-white font-semibold rounded-xl py-2 transition-all duration-300 shadow-md hover:shadow-xl"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default TutorSidebar;
