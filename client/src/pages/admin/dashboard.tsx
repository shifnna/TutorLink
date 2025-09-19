import {Toaster} from "react-hot-toast";
import Sidebar from "../../components/admin/sidebar";

const AdminDashboard: React.FC = () => {
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white">
      {/* Sidebar */}
      <Sidebar/>
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
