import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/admin/sidebar";
import { adminService } from "../../services/adminService";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    subscriptions: 0,
    revenue: 0,
    pendingApplications: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 ml-72 overflow-y-auto">
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
            <p className="text-4xl font-bold text-yellow-300">{stats.totalUsers}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Total Tutors</h3>
            <p className="text-4xl font-bold text-pink-400">{stats.totalTutors}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
            <p className="text-4xl font-bold text-indigo-400">{stats.subscriptions}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-green-400">₹{stats.revenue}</p>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="mt-10 bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
          <h3 className="text-xl font-bold mb-4">Pending Tutor Applications</h3>
          <ul className="text-gray-300 space-y-3">
            {stats.pendingApplications.length > 0 ? (
              stats.pendingApplications.map((app: any) => (
                <li key={app._id}>
                  📄 Application from{" "}
                  <span className="text-white font-semibold">{app.tutorId?.name}</span>{" "}
                  ({app.education || "N/A"}) - Awaiting Review
                </li>
              ))
            ) : (
              <p className="text-gray-400">No pending applications.</p>
            )}
          </ul>
        </div>

        {/* Recent Activity (Dummy) */}
        <div className="mt-10 bg-white/10 rounded-2xl p-6 shadow-lg border border-purple-800/40">
          <h3 className="text-xl font-bold mb-4">Recent Notifications</h3>
          <ul className="text-gray-300 space-y-3">
            <li>
              💬 New message from{" "}
              <span className="text-white font-semibold">Client - Sarah</span>
            </li>
          </ul>
        </div>
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminDashboard;
