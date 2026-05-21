import React, { useEffect, useState } from "react";
import SessionTable, { ISession } from "../../components/userCommon/sessionTable";
import { useAuthStore } from "../../store/authStore";
import UserSidebar from "../../components/userCommon/sidebar";
import { getAllSessions } from "../../services/sessionService";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

const TutorSessionManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<ISession[]>([]);

  const fetchSessions =
  async () => {

    try {

      if (!user?._id)
        return;

      const res =
        await getAllSessions(
          user._id
        );

      console.log(
        "Tutor Sessions:",
        res.data?.data
      );

      setSessions(
        res.data?.data || []
      );

    } catch (error) {

      console.error(
        error
      );
    }
  };

  useEffect(() => {
    if (user) fetchSessions();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-center" />
      <UserSidebar />

      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Session Management
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Manage all your sessions, track progress, and stay organized.
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">
                All Sessions
              </h2>

              <span className="text-xs text-slate-400">
                {sessions.length} total
              </span>
            </div>

            {/* TABLE */}
            <div className="p-6">
              <SessionTable
                sessions={sessions}
                refreshSessions={fetchSessions}
                role="tutor"
              />
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TutorSessionManagement;