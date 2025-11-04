import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, LogOut, User, Home, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const UserSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore(); // get user info from store
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const currentPath = location.pathname;

  const sessionPath = user?.role === "tutor" ? "/tutor/session-management" : "/client/session-management";
  // Base menu items for all users
  const menuItems = [
    { label: "Dashboard", icon: <Home className="w-5 h-5 opacity-90" />, path: "/user-dashboard" },
    { label: "Profile", icon: <User className="w-5 h-5 opacity-90" />, path: "/user-profile" },
    { label: "Session Management", icon: <Calendar className="w-5 h-5 opacity-90" />, path: sessionPath }    
  ];

  // Add tutor-only items
  if (user?.role === "tutor") {
    menuItems.push(
      { label: "Slot Management", icon: <Calendar className="w-5 h-5 opacity-90" />, path: "/slot-management" },
    );
  }

  // Common notifications section (optional)
  menuItems.push({
    label: "Notifications",
    icon: <Bell className="w-5 h-5 opacity-90" />,
    path: "/tutor/notifications",
  });

  return (
    <aside
      className={`bg-black/30 backdrop-blur-xl border-r border-violet-800/40 flex flex-col p-4 sticky top-0 h-screen shadow-2xl text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle button */}
      <div className="flex justify-between items-center mb-6">
        {isOpen && (
          <h4 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
            Tutor Panel
          </h4>
        )}
        <Button
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-violet-700 hover:bg-violet-600 p-1 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 justify-start ${
              currentPath === item.path
                ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-pink-700/40 text-white"
                : "hover:bg-violet-900/40 hover:text-white"
            }`}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </motion.button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <Button
          onClick={handleLogout}
          className="w-full mt-6 bg-gradient-to-r from-red-500 via-rose-600 to-pink-500 hover:from-red-400 hover:to-pink-500 text-white font-semibold rounded-xl py-2 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default UserSidebar;
