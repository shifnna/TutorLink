import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/adminCommon/sidebar";
import { adminService } from "../../services/adminService";
import { IAdminDashboardStats } from "../../types/IAdminDashboard";
import { ITutorApplication } from "../../types/ITutorApplication";
import { motion } from "framer-motion";

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
        }
      } catch {
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
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 ml-64 p-10 overflow-y-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900">
              Admin Dashboard
            </h2>
            <p className="text-slate-500 mt-1">
              Monitor platform performance & activities
            </p>
          </div>

          <span className="text-slate-500 text-sm font-medium">
            Welcome back 👋
          </span>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              color: "from-indigo-500 to-indigo-600",
            },
            {
              title: "Total Tutors",
              value: stats.totalTutors,
              color: "from-pink-500 to-fuchsia-600",
            },
            {
              title: "Subscriptions",
              value: stats.subscriptions,
              color: "from-amber-500 to-orange-500",
            },
            {
              title: "Revenue",
              value: `₹${stats.revenue}`,
              color: "from-emerald-500 to-green-600",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.color}`} />

              <h3 className="text-slate-500 font-semibold text-sm mb-3">
                {card.title}
              </h3>

              <p className="text-4xl font-extrabold text-slate-900">
                {card.value}
              </p>
            </motion.div>
          ))}

        </div>

        {/* PENDING APPLICATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Pending Tutor Applications
          </h3>

          {stats.pendingApplications.length > 0 ? (
            <ul className="space-y-4">
              {stats.pendingApplications.map((app: ITutorApplication) => (
                <li
                  key={app._id}
                  className="flex justify-between items-center bg-slate-50 rounded-xl p-4 border border-slate-100"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {app.tutorId?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {app.education || "No education info"}
                    </p>
                  </div>

                  <span className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">
                    Pending
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No pending applications.</p>
          )}
        </motion.div>

        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Recent Notifications
          </h3>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-slate-600">
              💬 New message from{" "}
              <span className="font-semibold text-slate-800">
                Client — Sarah
              </span>
            </p>
          </div>
        </motion.div>

      </main>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminDashboard;