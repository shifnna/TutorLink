import React, { useCallback, useEffect, useState } from "react";
import SessionTable, { ISession } from "../../components/userCommon/sessionTable";
import { useAuthStore } from "../../store/authStore";
import { getAllSessions } from "../../services/sessionService";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

const TutorSessionManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<ISession[]>([]);

  const fetchSessions = useCallback(async () => {

    try {

      if (!user?._id)
        return;

      const res = await getAllSessions();

      console.log(
        "Tutor Sessions:",
        res.data?.data
      );

      setSessions(
        res.data?.data || []
      );

    }catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
    }
  },[user])

  useEffect(() => {
    if (user) fetchSessions();
  }, [user,fetchSessions]);

  return (
    <div className="relative flex min-h-screen bg-[#0E1016] text-[#F3F4F8]">

      {/* Ambient background, same treatment as the homepage */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)", animationDelay: "-4s" }}
        />
        <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
      </div>

      <Toaster position="top-center" toastOptions={toastDarkOptions} />
      {/* <UserSidebar /> */}

      <main className="relative flex-1 px-8 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {/* HEADER */}
          <div className="mb-10">
            <span
              style={mono}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Sessions
            </span>

            {/* <h2 style={fraunces} className="mt-4  font-bold tracking-tight">
              Session Management
            </h2> */}
            <p className="text-[#9CA1B5] mt-2 text-sm">
              Manage all your sessions, track progress, and stay organized.
            </p>
          </div>

          {/* CARD */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2E3D]">
              <h2 className="text-sm font-semibold text-[#F3F4F8]">
                All Sessions
              </h2>

              <span style={mono} className="text-xs text-[#9CA1B5]">
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