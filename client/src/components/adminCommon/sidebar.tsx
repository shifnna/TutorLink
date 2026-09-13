import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaBox,
  FaSignOutAlt,
  FaFileAlt,
} from "react-icons/fa";
import { authService } from "../../services/authService";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await authService.logout();
      logout();
      navigate("/");
    } catch (err:unknown) {
      if (err instanceof Error) {
      console.error("Logout failed:", err.message);
    } else {
      console.error("Logout failed:", err);
    }
    }
  }

  const menuItems = [
    { icon: FaUsers, label: "Clients", path: "/admin-dashboard/clients" },
    { icon: FaUsers, label: "Tutors", path: "/admin-dashboard/tutors" },
    // { icon: FaClipboardList, label: "Categories", path: "#" },
    { icon: FaBox, label: "Sessions", path: "/admin-dashboard/sessions" },
    // { icon: FaComments, label: "Messages", path: "#" },
    { icon: FaFileAlt, label: "Applications", path: "/admin-dashboard/applications" },
    // { icon: FaMoneyBillWave, label: "Revenue", path: "/admin-dashboard/revenew" },
    // { icon: FaCrown, label: "Subscriptions", path: "#" },
    // { icon: FaChartBar, label: "Reports", path: "#" },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-[#171A24] border-r border-[#2A2E3D] flex flex-col shadow-sm z-50">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#2A2E3D]">
        <div className="bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] p-2 rounded-xl shadow-md">
          <FaGraduationCap className="w-6 h-6 text-[#0E1016]" />
        </div>
        <span className="text-xl font-extrabold text-[#F3F4F8]" style={fraunces}>
          Tutor<span className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] bg-clip-text text-transparent">Link</span>
        </span>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, i) => {
  const Icon = item.icon;

  if (item.path === "#") {
    return (
      <span key={i} aria-disabled="true"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#4B5065] font-medium cursor-not-allowed select-none"
        title="Coming soon"
      >
        <Icon className="text-[#3A3F52]" />
        {item.label}
      </span>
    );
  }

  return (
    <NavLink key={i} to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
          isActive ? "bg-[#1E2230] text-[#F3F4F8]" : "text-[#9CA1B5] hover:bg-[#1E2230] hover:text-[#F3F4F8]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`transition ${isActive ? "text-[#7C9CFF]" : "text-[#6B7185] group-hover:text-[#7C9CFF]"}`} />
          {item.label}
        </>
      )}
    </NavLink>
  );
})}
      </nav>

      {/* LOGOUT */}
      <div className="p-5 border-t border-[#2A2E3D]">
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