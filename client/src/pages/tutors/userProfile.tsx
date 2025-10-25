import React from "react";
import TutorSidebar from "../../components/tutorCommon/sidebar";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const UserProfile: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#160733] to-[#1a002e] text-white">
      <Toaster position="top-center" />
      <TutorSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Profile
        </h1>
        <span>Your profile details will appear here.</span>
        </motion.section>
      </main>
    </div>
  );
};

export default UserProfile;
