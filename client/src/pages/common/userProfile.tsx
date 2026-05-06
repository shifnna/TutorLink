import React from "react";
import UserSidebar from "../../components/userCommon/sidebar";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const UserProfile: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-center" />
      <UserSidebar />

      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Profile
          </h1>

          <div className="bg-white border border-slate-600 rounded-xl p-6 shadow-sm">
            <p className="text-slate-600 text-sm">
              Your profile details will appear here.
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default UserProfile;