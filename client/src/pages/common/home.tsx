import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Search, MessageSquare, BookOpen } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGraduationCap,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import ApplicationModal from "../client/applicationModal";
import Dropdown from "../../components/userCommon/dropdown";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 * i },
  }),
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.5, ease: easeOutExpo },
  }),
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">

      {/* BACKGROUND (FIXED LAYER — DOESN'T BREAK SCROLL) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-30 animate-blob mix-blend-multiply blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-30 animate-blob mix-blend-multiply blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)", animationDelay: "-4s" }}
        />
        <div className="absolute top-[30%] left-[40%] w-[40vmax] h-[40vmax] rounded-full opacity-30 animate-blob mix-blend-multiply blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, transparent 70%)", animationDelay: "-8s" }}
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      </div>

      {/* NAVBAR (FIXED PREMIUM) */}
      <motion.header
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 md:px-12 py-4 
        bg-white/70 backdrop-blur-xl border-b border-slate-200/50 
        shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <FaGraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Tutor<span className="text-indigo-600">Link</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          {["Home", "About", "Contact"].map((label, i) => (
            <motion.a
              key={label}
              href="#"
              className="relative py-1 hover:text-indigo-600 transition"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {label}
            </motion.a>
          ))}
        </nav>

        <div>
          {user ? (
            <Dropdown />
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white rounded-full px-6 py-2.5 shadow-md hover:scale-105 transition"
            >
              Log In
            </Button>
          )}
        </div>
      </motion.header>

      {/* PAGE CONTENT WRAPPER */}
      <div className="pt-28">

        {/* HERO */}
        <section className="relative text-center px-6 py-24">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.h2 className="text-6xl md:text-7xl font-black leading-tight">
              Master Any Subject with
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Expert Tutors
              </span>
            </motion.h2>

            <motion.p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">
              Unlock your potential with personalized learning experiences.
            </motion.p>

            <motion.div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => (user ? setIsModalOpen(true) : navigate("/login"))}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-xl hover:scale-105 transition"
              >
                Become a Tutor
              </Button>

              <Button
                onClick={() => (user ? navigate("/explore-tutors") : navigate("/login"))}
                variant="outline"
                className="px-8 py-4 rounded-full"
              >
                Find Tutor
              </Button>

              <Button
                onClick={() => (user ? navigate("/find-job") : navigate("/login"))}
                variant="outline"
                className="px-8 py-4 rounded-full"
              >
                Find Job
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-24">
          <h3 className="text-center text-4xl font-bold mb-20">
            How TutorLink Works
          </h3>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { icon: Search, title: "Discover Tutors", desc: "Browse profiles." },
              { icon: MessageSquare, title: "Connect & Chat", desc: "Discuss goals." },
              { icon: BookOpen, title: "Start Learning", desc: "Begin lessons." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" whileInView="visible">
                <Card className="hover:-translate-y-2 transition">
                  <CardContent className="text-center p-10">
                    <Icon className="mx-auto mb-6 w-10 h-10 text-indigo-600" />
                    <h4 className="font-bold text-xl mb-3">{title}</h4>
                    <p className="text-slate-500">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-[2.5rem] p-12 text-center shadow-2xl">
            <h3 className="text-4xl font-bold mb-6">
              Ready to transform your future?
            </h3>
            <Button
              onClick={() => !user && navigate("/login")}
              className="bg-white text-black px-10 py-5 rounded-full font-bold hover:scale-105 transition"
            >
              Get Started Now
            </Button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t py-12 text-center">
          <p className="text-slate-400">© 2025 TutorLink Inc.</p>

          <div className="flex justify-center gap-6 mt-4">
            <FaInstagram />
            <FaFacebook />
            <FaLinkedin />
            <FaYoutube />
          </div>
        </footer>
      </div>

      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toaster />
    </div>
  );
};

export default Home;