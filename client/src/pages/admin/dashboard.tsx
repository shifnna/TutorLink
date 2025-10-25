import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/adminCommon/sidebar";
import { adminService } from "../../services/adminService";
import { IAdminDashboardStats } from "../../types/IAdminDashboard";
import { ITutorApplication } from "../../types/ITutorApplication";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<IAdminDashboardStats>({
    totalUsers: 0,
    totalTutors: 0,
    subscriptions: 0,
    revenue: 0,
    pendingApplications: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setStats({
            totalUsers: 0,
            totalTutors: 0,
            subscriptions: 0,
            revenue: 0,
            pendingApplications: [],
          });
          console.error(res.message || "Failed to fetch stats");
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setStats({
          totalUsers: 0,
          totalTutors: 0,
          subscriptions: 0,
          revenue: 0,
          pendingApplications: [],
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white">
      <Sidebar />
      <main className="flex-1 p-10 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 text-transparent bg-clip-text">
            Dashboard Overview
          </h2>
          <span className="text-gray-400 text-base">Welcome, Admin 👋</span>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="bg-gradient-to-b from-black/30 via-purple-900/10 to-black/50 rounded-2xl p-7 shadow-xl border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-yellow-300">{stats.totalUsers}</p>
          </div>
          <div className="bg-gradient-to-b from-black/30 via-purple-900/10 to-black/50 rounded-2xl p-7 shadow-xl border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Total Tutors</h3>
            <p className="text-4xl font-bold text-pink-400">{stats.totalTutors}</p>
          </div>
          <div className="bg-gradient-to-b from-black/30 via-purple-900/10 to-black/50 rounded-2xl p-7 shadow-xl border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
            <p className="text-4xl font-bold text-indigo-400">{stats.subscriptions}</p>
          </div>
          <div className="bg-gradient-to-b from-black/30 via-purple-900/10 to-black/50 rounded-2xl p-7 shadow-xl border border-purple-800/40">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-green-400">₹{stats.revenue}</p>
          </div>
        </div>
        {/* Pending Applications */}
        <div className="mt-10 bg-gradient-to-b from-black/30 via-purple-900/10 to-black/40 rounded-2xl p-7 shadow-lg border border-purple-800/40">
          <h3 className="text-xl font-bold mb-4">Pending Tutor Applications</h3>
          <ul className="text-gray-300 space-y-3">
            {stats.pendingApplications.length > 0 ? (
              stats.pendingApplications.map((app: ITutorApplication) => (
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
        <div className="mt-10 bg-gradient-to-b from-black/30 via-purple-900/10 to-black/40 rounded-2xl p-7 shadow-lg border border-purple-800/40">
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
