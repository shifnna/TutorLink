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
import { Button } from "../../components/ui/button";
import { authRepository } from "../../repositories/authRepository";
import {toast,Toaster} from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import React from "react";

const Sidebar :React.FC = () => {
    const {logout} = useAuthStore();
    const navigate = useNavigate();

    async function handleLogout() {
    try {
      const response = await authRepository.logout() //rmv cookies
      logout(); //remv frm state/store
      navigate("/");
      toast.success(response.message)
    } catch (err) {
      console.error("Logout failed:", err);
    }
    }

  return (
    <div>
      <aside className="w-72 bg-black/40 backdrop-blur-md border-r border-purple-800/40 shadow-lg flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-purple-700/40">
          <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            TutorLink Admin
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
          <a href="/admin-dashboard/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaUsers /> Clients
          </a>
          <a href="/admin-dashboard/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaUsers /> Tutors
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaClipboardList /> Categories
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaBox /> Sessions
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaComments /> Messages
          </a>
          <a href="/admin-dashboard/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaFileAlt /> Tutor Applications
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaMoneyBillWave /> Revenue & Commission
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaCrown /> Subscriptions
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-800/40 transition">
            <FaChartBar /> Reports
          </a>
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-purple-700/40">
          <Button onClick={()=>handleLogout()} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl font-bold hover:scale-105 transition">
            <FaSignOutAlt /> Logout
          </Button>
        </div>
      </aside>
    <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default Sidebar
