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

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-black/30 backdrop-blur-xl border-r border-violet-800/40 shadow-2xl flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-4 px-7 py-7 border-b border-purple-700/40">
        <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce drop-shadow-xl" />
        <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent leading-tight tracking-tight">
          TutorLink Admin
        </span>
      </div>
      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-6 overflow-y-auto text-base">
        <a
          href="/admin-dashboard/clients"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaUsers className="opacity-80" /> Clients
        </a>
        <a
          href="/admin-dashboard/tutors"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaUsers className="opacity-80" /> Tutors
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaClipboardList className="opacity-80" /> Categories
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaBox className="opacity-80" /> Sessions
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaComments className="opacity-80" /> Messages
        </a>
        <a
          href="/admin-dashboard/applications"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaFileAlt className="opacity-80" /> Tutor Applications
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaMoneyBillWave className="opacity-80" /> Revenue & Commission
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaCrown className="opacity-80" /> Subscriptions
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-violet-900/30 hover:text-pink-400"
        >
          <FaChartBar className="opacity-80" /> Reports
        </a>
      </nav>
      {/* Logout */}
      <div className="px-5 py-8 border-t border-purple-700/40">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 font-bold bg-gradient-to-r from-pink-500 via-fuchsia-800 to-indigo-500 rounded-xl py-3 hover:from-pink-400 hover:to-indigo-400 transition"
        >
          <FaSignOutAlt className="w-5 h-5" /> Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
