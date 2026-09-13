import React from "react";
import { motion } from "framer-motion";
import { BellOff } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useNotificationStore } from "../../store/notificationStore";
import { INotification } from "../../types/INotifications";
import { useAuthStore } from "../../store/authStore";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

const NotificationPage: React.FC = () => {
const { user } = useAuthStore(); // add this import at top: import { useAuthStore } from "../../store/authStore";
const { notifications, unreadCount, markAllSeen, markOneSeen } = useNotificationStore();

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8 max-w-3xl"
        >
          <div>
            <span
              style={mono}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Updates
            </span>

            <h1 style={fraunces} className="mt-4 text-3xl font-bold tracking-tight">
              Notifications
            </h1>
          </div>

          {unreadCount > 0 && (
  <button
    onClick={() => user?._id && markAllSeen(user._id)}
    className="mt-1 text-sm px-4 py-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 hover:bg-[#171A24] hover:border-[#7C9CFF] text-[#F3F4F8] transition"
  >
    Mark all as read <span style={mono}>({unreadCount})</span>
  </button>
)}
        </motion.div>

        {/* Content */}
        <div className="space-y-4 max-w-3xl">

          {notifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 text-center mt-24"
            >
              <div className="w-12 h-12 rounded-full bg-[#1E2230] border border-[#2A2E3D] flex items-center justify-center">
                <BellOff className="w-5 h-5 text-[#9CA1B5]" />
              </div>
              <p className="text-[#9CA1B5] text-sm">
                You&apos;re all caught up — no notifications yet.
              </p>
            </motion.div>
          )}

          {notifications.map((n: INotification, index: number) => (
            <motion.div
    key={n._id}
    onClick={() => !n.seen && markOneSeen(n._id)}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    className={`relative overflow-hidden pl-6 p-5 rounded-xl border bg-[#171A24] hover:bg-[#1E2230] transition cursor-pointer
      ${!n.seen ? "border-[rgba(124,156,255,0.35)]" : "border-[#2A2E3D]"}`}
  >
              {!n.seen && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />
              )}

              <div className="flex justify-between items-start">
                <h2 className="text-base font-semibold text-[#F3F4F8]">
                  {n.title}
                </h2>

                {!n.seen && (
                  <span
                    style={mono}
                    className="text-[10px] px-2 py-1 rounded-full bg-[rgba(124,156,255,0.12)] border border-[rgba(124,156,255,0.3)] text-[#7C9CFF] uppercase tracking-wide"
                  >
                    New
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-[#9CA1B5] leading-relaxed">
                {n.message}
              </p>

              {n.link && (
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm font-medium text-[#7C9CFF] hover:text-[#A78CF5] hover:underline transition"
                >
                  Join session →
                </a>
              )}

              <p style={mono} className="text-xs mt-3 text-[#9CA1B5]/70">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;