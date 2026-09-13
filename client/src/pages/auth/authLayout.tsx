import React, { useEffect } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLoader from "../common/pageLoader";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

// Same toast styling used on Home, so notifications look identical app-wide.
const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  const { isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Load the same display + mono typefaces used on Home / ExploreTutors.
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0E1016] px-6 py-12 font-sans text-[#F3F4F8]">
      {/* background glow — matches Home / ExploreTutors */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-5%] h-[60vmax] w-[60vmax] rounded-full opacity-25 mix-blend-screen blur-3xl animate-blob"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] h-[50vmax] w-[50vmax] rounded-full opacity-25 mix-blend-screen blur-3xl animate-blob"
          style={{
            background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="relative w-full max-w-md">
        <motion.div
          variants={item}
          className="rounded-3xl border border-[#2A2E3D] bg-[#171A24] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          {/* Logo */}
          <motion.button
            variants={item}
            type="button"
            onClick={() => navigate("/")}
            className="mb-8 flex w-full items-center justify-center gap-2.5"
          >
            <div className="rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] p-2">
              <FaGraduationCap className="h-5 w-5 text-[#0E1016]" />
            </div>
            <span style={fraunces} className="text-2xl font-semibold">
              Tutor
              <span className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] bg-clip-text text-transparent">
                Link
              </span>
            </span>
          </motion.button>

          {/* Heading */}
          <motion.h2 variants={item} style={{ ...fraunces, fontWeight: 550 }} className="mb-2 text-center text-3xl">
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              variants={item}
              className="mb-8 text-center text-sm leading-relaxed text-[#9CA1B5]"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* Form content */}
          <motion.div variants={item}>{children}</motion.div>
        </motion.div>

        <motion.p
          variants={item}
          style={mono}
          className="mt-6 text-center text-[11px] tracking-wider text-[#6B7185]"
        >
          MATCHED IN MINUTES, NOT DAYS
        </motion.p>
      </motion.div>

      {/* Loader */}
      {isLoading && (
        <PageLoader/>
      )}

      <Toaster position="top-center" reverseOrder={false} toastOptions={toastDarkOptions} />
    </div>
  );
};

export default AuthLayout;