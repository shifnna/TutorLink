import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import {
  FaGraduationCap, FaThLarge, FaUsers, FaChalkboardTeacher, FaBox,
  FaSignOutAlt, FaFileAlt, FaComments,
} from "react-icons/fa";
import { authService } from "../../services/authService";

const menuItems = [
  { icon: FaThLarge, label: "Dashboard", path: "/admin-dashboard", end: true },
  { icon: FaUsers, label: "Clients", path: "/admin-dashboard/clients" },
  { icon: FaChalkboardTeacher, label: "Tutors", path: "/admin-dashboard/tutors" },
  { icon: FaBox, label: "Sessions", path: "/admin-dashboard/sessions" },
  { icon: FaFileAlt, label: "Applications", path: "/admin-dashboard/applications" },
  { icon: FaComments, label: "Messages", path: "/admin-dashboard/messages", showUnread: true },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { conversations } = useChatStore();
  const navigate = useNavigate();

  const unreadChats = conversations.filter((c) => c.unreadCount > 0).length;

  async function handleLogout() {
    try {
      await authService.logout();
      logout();
      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error("Logout failed:", err instanceof Error ? err.message : err);
    }
  }

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-[#171A24] border-r border-[#2A2E3D] flex flex-col shadow-sm z-50">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#2A2E3D]">
        <div className="bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] p-2 rounded-xl shadow-md">
          <FaGraduationCap className="w-6 h-6 text-[#0E1016]" />
        </div>
        <span className="text-xl font-extrabold text-[#F3F4F8]">
          Tutor<span className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] bg-clip-text text-transparent">Link</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        <p className="px-4 pb-2 text-[10px] uppercase tracking-wider text-[#6B7185]">Menu</p>
        {menuItems.map(({ icon: Icon, label, path, end, showUnread }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                isActive ? "bg-[#1E2230] text-[#F3F4F8]" : "text-[#9CA1B5] hover:bg-[#1E2230] hover:text-[#F3F4F8]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#7C9CFF] to-[#C08BFA] transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
                <Icon className={`transition ${isActive ? "text-[#7C9CFF]" : "text-[#6B7185] group-hover:text-[#7C9CFF]"}`} />
                <span className="flex-1">{label}</span>
                {showUnread && unreadChats > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#7C9CFF] text-[#0E1016] text-[11px] font-bold flex items-center justify-center">
                    {unreadChats > 9 ? "9+" : unreadChats}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2E3D] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-bold text-sm flex items-center justify-center">
            {(user?.name?.[0] || "A").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || "Admin"}</p>
            <p className="text-[11px] text-[#6B7185]">Administrator</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] rounded-xl py-3 font-semibold shadow-md hover:scale-[1.02] transition"
        >
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;