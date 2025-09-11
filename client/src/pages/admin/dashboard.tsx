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
import { authRepository } from "../../repositories/authRepository";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {toast,Toaster} from "react-hot-toast";

const AdminDashboard: React.FC = () => {
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400">
            Dashboard Overview
          </h2>
          <span className="text-gray-400 text-sm">Welcome, Admin 👋</span>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-yellow-300">1,245</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Total Tutors</h3>
            <p className="text-4xl font-bold text-pink-400">320</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
            <p className="text-4xl font-bold text-indigo-400">780</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-green-400">₹2,30,000</p>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="mt-10 bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
          <h3 className="text-xl font-bold mb-4">Pending Tutor Applications</h3>
          <ul className="text-gray-300 space-y-3">
            <li>📄 Application from <span className="text-white font-semibold">Alice Johnson</span> (Maths) - Awaiting Review</li>
            <li>📄 Application from <span className="text-white font-semibold">Bob Brown</span> (Physics) - Awaiting Review</li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
          <h3 className="text-xl font-bold mb-4">Recent Notifications</h3>
          <ul className="text-gray-300 space-y-3">
            <li>💬 New message from <span className="text-white font-semibold">Client - Sarah</span></li>
          </ul>
        </div>
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminDashboard;
