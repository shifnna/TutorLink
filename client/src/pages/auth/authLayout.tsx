import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  const { isLoading } = useAuthStore();

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Animated Background (same style as Home) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-30 animate-blob mix-blend-multiply filter blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-30 animate-blob mix-blend-multiply filter blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        <div
          className="absolute top-[30%] left-[40%] w-[40vmax] h-[40vmax] rounded-full opacity-30 animate-blob mix-blend-multiply filter blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.4) 0%, transparent 70%)",
            animationDelay: "-8s",
          }}
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      </div>

      {/* Center Card */}
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md"
        >
          <motion.div
            variants={item}
            className="bg-white rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-slate-100"
          >
            {/* Logo */}
            <motion.div
              variants={item}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
                className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200"
              >
                <FaGraduationCap className="w-7 h-7 text-white" />
              </motion.div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                Tutor<span className="text-indigo-600">Link</span>
              </h1>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={item}
              className="text-2xl font-bold text-center text-slate-900 mb-3"
            >
              {title}
            </motion.h2>

            {subtitle && (
              <motion.p
                variants={item}
                className="text-center text-slate-500 mb-8"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}

            {/* Form Content */}
            <motion.div variants={item}>{children}</motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AuthLayout;