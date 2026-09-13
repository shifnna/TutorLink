import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/adminCommon/sidebar";
import { adminService } from "../../services/adminService";
import { IAdminDashboardStats } from "../../types/IAdminDashboard";
import { ITutorApplication } from "../../types/ITutorApplication";
import { motion } from "framer-motion";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<IAdminDashboardStats>({
    totalUsers: 0,
    totalTutors: 0,
    subscriptions: 0,
    revenue: 0,
    pendingApplications: [],
  });

  // Load the display + mono typefaces used by the midnight theme
  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

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
    <div className="relative flex min-h-screen bg-[#0E1016] text-[#F3F4F8] overflow-hidden">

      {/* background glow — matches Home / ExploreTutors */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }}
        />
      </div>

      <Sidebar />

      <main className="flex-1 ml-64 p-10 overflow-y-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2" style={mono}>Overview</p>
            <h2 className="text-4xl font-extrabold" style={fraunces}>
              Admin Dashboard
            </h2>
            <p className="text-[#9CA1B5] mt-1">
              Monitor platform performance & activities
            </p>
          </div>

          <span className="text-[#9CA1B5] text-sm font-medium">
            Welcome back 👋
          </span>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              color: "from-[#7C9CFF] to-[#A78CF5]",
            },
            {
              title: "Total Tutors",
              value: stats.totalTutors,
              color: "from-[#C08BFA] to-[#A78CF5]",
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
              className="relative overflow-hidden bg-[#171A24] rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-[#2A2E3D]"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.color}`} />

              <h3 className="relative text-[#9CA1B5] font-semibold text-sm mb-3">
                {card.title}
              </h3>

              <p className="relative text-4xl font-extrabold text-[#F3F4F8]" style={mono}>
                {card.value}
              </p>
            </motion.div>
          ))}

        </div>

        {/* PENDING APPLICATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171A24] rounded-3xl p-8 shadow-sm border border-[#2A2E3D] mb-10"
        >
          <h3 className="text-2xl font-bold mb-6" style={fraunces}>
            Pending Tutor Applications
          </h3>

          {stats.pendingApplications.length > 0 ? (
            <ul className="space-y-4">
              {stats.pendingApplications.map((app: ITutorApplication) => (
                <li
                  key={app._id}
                  className="flex justify-between items-center bg-[#0E1016] rounded-xl p-4 border border-[#2A2E3D]"
                >
                  <div>
                    <p className="font-semibold text-[#F3F4F8]">
                      {app.tutorId?.name}
                    </p>
                    <p className="text-sm text-[#9CA1B5]">
                      {app.education || "No education info"}
                    </p>
                  </div>

                  <span className="text-sm px-3 py-1 bg-amber-500/15 text-amber-400 rounded-full font-semibold">
                    Pending
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#6B7185]">No pending applications.</p>
          )}
        </motion.div>

        {/* RECENT ACTIVITY */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171A24] rounded-3xl p-8 shadow-sm border border-[#2A2E3D]"
        >
          <h3 className="text-2xl font-bold mb-6" style={fraunces}>
            Recent Notifications
          </h3>

          <div className="bg-[#0E1016] p-4 rounded-xl border border-[#2A2E3D]">
            <p className="text-[#D7D9E2]">
              💬 New message from{" "}
              <span className="font-semibold text-[#F3F4F8]">
                Client — Sarah
              </span>
            </p>
          </div>
        </motion.div> */}

      </main>

      <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { background: "#171A24", color: "#F3F4F8", border: "1px solid #2A2E3D" } }} />
    </div>
  );
};

export default AdminDashboard;