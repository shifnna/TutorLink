import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaClipboardList,
  FaBox,
  FaChartBar,
  FaSignOutAlt,
  FaComments,
  FaFileAlt,
  FaMoneyBillWave,
  FaCrown,
} from "react-icons/fa";
import { authService } from "../../services/authService";

const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await authService.logout();
      logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const menuItems = [
    { icon: FaUsers, label: "Clients", path: "/admin-dashboard/clients" },
    { icon: FaUsers, label: "Tutors", path: "/admin-dashboard/tutors" },
    { icon: FaClipboardList, label: "Categories", path: "#" },
    { icon: FaBox, label: "Sessions", path: "/admin-dashboard/sessions" },
    { icon: FaComments, label: "Messages", path: "#" },
    { icon: FaFileAlt, label: "Applications", path: "/admin-dashboard/applications" },
    { icon: FaMoneyBillWave, label: "Revenue", path: "/admin-dashboard/revenew" },
    { icon: FaCrown, label: "Subscriptions", path: "#" },
    { icon: FaChartBar, label: "Reports", path: "#" },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col shadow-sm z-50">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-md">
          <FaGraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-extrabold text-slate-800">
          Tutor<span className="text-indigo-600">Link</span>
        </span>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, i) => {
          const Icon = item.icon;

          return (
            <a
              key={i}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-medium transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <Icon className="text-slate-400 group-hover:text-indigo-600 transition" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-5 border-t border-slate-100">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold shadow-md"
        >
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;