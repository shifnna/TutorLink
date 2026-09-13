import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, LogOut, User, Home, Menu } from "lucide-react";
import { FaGraduationCap } from "react-icons/fa";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

const UserSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  // Load the same display + mono typefaces as the homepage. The sidebar
  // renders on every panel page, so this is the one place that needs to do
  // it — guarded so it's a no-op if Home already injected the <link> tag.
  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

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
      className={`relative flex flex-col h-screen sticky top-0 bg-[#171A24]/95 backdrop-blur-xl border-r border-[#2A2E3D] text-[#F3F4F8] transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between gap-2 px-4 pt-5 pb-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
            <FaGraduationCap className="w-4 h-4 text-[#0E1016]" />
          </div>
          {isOpen && (
            <h4 style={fraunces} className="text-lg font-bold tracking-tight truncate">
              Tutor
              <span className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] bg-clip-text text-transparent">
                Panel
              </span>
            </h4>
          )}
        </div>

        <Button
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#1E2230] hover:bg-[#2A2E3D] text-[#9CA1B5] hover:text-[#F3F4F8] p-1.5 rounded-lg border border-[#2A2E3D] shrink-0 transition"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "text-[#F3F4F8] bg-gradient-to-r from-[#7C9CFF]/15 via-[#A78CF5]/15 to-[#C08BFA]/15"
                  : "text-[#9CA1B5] hover:text-[#F3F4F8] hover:bg-[#1E2230]"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gradient-to-b from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />
              )}
              <span className={active ? "text-[#7C9CFF]" : "text-[#9CA1B5] group-hover:text-[#F3F4F8]"}>
                {item.icon}
              </span>
              {isOpen && <span className="truncate">{item.label}</span>}
            </motion.button>
          );
        })}
      </nav>

      {/* Account card + Logout */}
      <div className="px-3 pb-5 pt-3 border-t border-[#2A2E3D] mt-2">
        {/* {isOpen ? (
          <div className="relative overflow-hidden rounded-xl border border-[#2A2E3D] bg-[#1E2230] p-3 mb-3">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#0E1016]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#F3F4F8] truncate">
                  {user?.role === "tutor" ? "Tutor account" : "Learner account"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-[#9CA1B5]">Active now</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto mb-3 w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center">
            <User className="w-4 h-4 text-[#0E1016]" />
          </div>
        )} */}

        <Button
          onClick={handleLogout}
          className={`w-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full py-2 flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition ${
            isOpen ? "px-4" : "px-0"
          }`}
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default UserSidebar;