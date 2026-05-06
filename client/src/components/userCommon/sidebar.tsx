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
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const currentPath = location.pathname;

  const sessionPath =
    user?.role === "tutor"
      ? "/tutor/session-management"
      : "/client/session-management";

  const menuItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    { label: "Profile", icon: <User className="w-5 h-5" />, path: "/user-profile" },
    { label: "Session Management", icon: <Calendar className="w-5 h-5" />, path: sessionPath },
  ];

  if (user?.role === "tutor") {
    menuItems.push({
      label: "Slot Management",
      icon: <Calendar className="w-5 h-5" />,
      path: "/slot-management",
    });
  }

  const notificationPath =
    user?.role === "tutor"
      ? "/tutor/notifications"
      : "/client/notifications";

  menuItems.push({
    label: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    path: notificationPath,
  });

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col p-4 h-screen sticky top-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Top */}
      <div className="flex justify-between items-center mb-6">
        {isOpen && (
          <h4 className="text-xl font-bold text-slate-900">
            Tutor Panel
          </h4>
        )}

        <Button
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${
                currentPath === item.path
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
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
          className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default UserSidebar;