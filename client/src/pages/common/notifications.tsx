import React from "react";
import { motion } from "framer-motion";
import UserSidebar from "../../components/userCommon/sidebar";
import { Toaster } from "react-hot-toast";
import { useNotificationStore } from "../../store/notificationStore";
import { INotification } from "../../types/INotifications";

const NotificationPage: React.FC = () => {
  const { notifications, unreadCount, markAllSeen } = useNotificationStore();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-center" />

      <UserSidebar />

      <main className="flex-1 px-8 py-10 overflow-y-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Notifications
          </h1>

          {unreadCount > 0 && (
            <button
              onClick={markAllSeen}
              className="text-sm px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </motion.div>

        {/* Content */}
        <div className="space-y-4 max-w-3xl">

          {notifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-center mt-24 text-sm"
            >
              No notifications yet
            </motion.div>
          )}

          {notifications.map((n: INotification, index: number) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition
                ${!n.seen ? "border-indigo-500" : "border-slate-200"}`}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-base font-semibold text-slate-900">
                  {n.title}
                </h2>

                {!n.seen && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                    New
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {n.message}
              </p>

              {n.link && (
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:underline"
                >
                  Join session →
                </a>
              )}

              <p className="text-xs mt-3 text-slate-400">
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