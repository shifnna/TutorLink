import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Search,
  MessageSquare,
  BookOpen,
  Link2,
  ShieldCheck,
  CalendarDays,
  TrendingUp,
  BadgeCheck,
  Star,
  Sparkles,
  UserRound,
  Video,
} from "lucide-react";
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

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 * i },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.5, ease: easeOutExpo },
  }),
};

// Midnight theme type treatment — Fraunces for display, Space Mono for labels/stats
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const howItWorks = [
  {
    icon: Search,
    step: "01",
    title: "Tell us what you need",
    desc: "Share your goals and availability — it takes under two minutes.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Get matched",
    desc: "We connect you with a vetted, subject-tested tutor within 24 hours.",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Start learning",
    desc: "Book sessions, message your tutor, and track progress after every class.",
  },
];

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer science",
  "English literature",
  "Spanish",
  "SAT / ACT prep",
  "Music theory",
  "Economics",
  "Essay writing",
];

const features = [
  {
    icon: ShieldCheck,
    title: "Vetted experts",
    desc: "Every tutor passes a background check and a subject assessment.",
  },
  {
    icon: CalendarDays,
    title: "Flexible scheduling",
    desc: "Book sessions that fit around school, work, or family life.",
  },
  {
    icon: TrendingUp,
    title: "Progress you can see",
    desc: "Session notes and goal tracking land in your inbox after every class.",
  },
  {
    icon: BadgeCheck,
    title: "Money-back guarantee",
    desc: "Not the right fit? Your first session is fully refundable.",
  },
];

const testimonials = [
  {
    initials: "PN",
    name: "Priya N.",
    role: "Studying calculus",
    quote:
      "My calculus tutor explained limits in a way that finally clicked. I went from a C to an A- in one semester.",
  },
  {
    initials: "MD",
    name: "Marcus D.",
    role: "Learning Spanish",
    quote:
      "Booking around my work shifts was the hard part everywhere else. Here I found a tutor with the exact hours I needed.",
  },
  {
    initials: "ER",
    name: "Elena R.",
    role: "Tutor on TutorLink",
    quote:
      "I teach music theory on the side around my own studies. The scheduling tools make it genuinely easy to fit in.",
  },
];

const heroStats = [
  { n: "8,400+", l: "Tutors" },
  { n: "120+", l: "Subjects" },
  { n: "46,000+", l: "Sessions matched" },
  { n: "4.9/5", l: "Avg. rating" },
];

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};


/* =========================================================
   ANIMATED TUTOR VISUAL
   ========================================================= */

const TutorAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: easeOutExpo }}
      className="relative mx-auto mb-5 h-[135px] w-full max-w-[500px] flex items-center justify-center"
    >
      <motion.div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(124,156,255,0.8) 0%, rgba(192,139,250,0.4) 45%, transparent 75%)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[18%] top-[35px]"
        animate={{ y: [-4, 5, -4], rotate: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-4 h-4 text-[#7C9CFF]" />
      </motion.div>

      <motion.div
        className="absolute right-[19%] top-[22px]"
        animate={{ y: [5, -5, 5], rotate: [0, -12, 0], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C08BFA]" />
      </motion.div>

      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="relative w-[190px] h-[112px] rounded-[24px] border border-[#30364A] bg-[#171A24] shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

          <div className="absolute left-5 top-5">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shadow-lg"
            >
              <UserRound className="w-7 h-7 text-[#0E1016]" />
            </motion.div>
          </div>

          <div className="absolute left-[82px] top-[19px] text-left">
            <p className="text-[13px] font-semibold text-[#F3F4F8]">Your Tutor</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-[#9CA1B5]">Available now</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 fill-current text-[#C08BFA]" />
              <span className="text-[9px] text-[#9CA1B5]">4.9 rating</span>
            </div>
          </div>

          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#7C9CFF]" />
              <span className="w-1 h-1 rounded-full bg-[#A78CF5]" />
              <span className="w-1 h-1 rounded-full bg-[#C08BFA]" />
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#9CA1B5]">
              <Video className="w-3 h-3" />
              Live
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [3, -5, 3], rotate: [0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute right-[21%] bottom-[12px] z-20 w-9 h-9 rounded-full bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center border-4 border-[#0E1016] shadow-lg"
      >
        <Link2 className="w-4 h-4 text-[#0E1016]" />
      </motion.div>

      <motion.div
        className="absolute left-[28%] right-[28%] bottom-[8px] h-px opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, #7C9CFF, #C08BFA, transparent)",
        }}
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  // Load the display + mono typefaces used by the midnight theme
  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0E1016] text-[#F3F4F8] font-sans selection:bg-[#7C9CFF]/25 selection:text-[#F3F4F8]">

      {/* BACKGROUND (FIXED LAYER — DOESN'T BREAK SCROLL) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)", animationDelay: "-4s" }}
        />
        <div
          className="absolute top-[30%] left-[40%] w-[40vmax] h-[40vmax] rounded-full opacity-20 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.35) 0%, transparent 70%)", animationDelay: "-8s" }}
        />
        <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
      </div>


      {/* PAGE CONTENT WRAPPER */}
      <div className="pt-5">

        {/* HERO */}
        <section className="relative text-center px-6 py-24 max-w-5xl mx-auto">
          <motion.div variants={container} initial="hidden" animate="visible">
            <TutorAnimation />

            <motion.div
              variants={cardVariants}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-6"
              style={mono}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Matched with a real tutor, not a search result
            </motion.div>

            <motion.h2 variants={cardVariants} custom={1} className="text-6xl md:text-7xl leading-tight" style={{ ...fraunces, fontWeight: 550 }}>
              Master Any Subject
              <span className="block bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA] bg-clip-text text-transparent">
                with Expert Tutors
              </span>
            </motion.h2>

            <motion.p variants={cardVariants} custom={2} className="mt-6 text-[#9CA1B5] text-lg max-w-2xl mx-auto">
              Tell us what you're learning, get matched with a vetted tutor within 24 hours, and book sessions that fit your schedule — not the other way around.
            </motion.p>

            <motion.div variants={cardVariants} custom={3} className="mt-10 flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => (user ? setIsModalOpen(true) : navigate("/login"))}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold shadow-xl hover:scale-105 transition"
              >
                Become a tutor
              </Button>

              <Button
                onClick={() => (user ? navigate("/explore-tutors") : navigate("/login"))}
                variant="outline"
                className="px-8 py-4 rounded-full border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] transition"
              >
                Find a tutor
              </Button>

              <Button
                onClick={() => (user ? navigate("/find-job") : navigate("/login"))}
                variant="outline"
                className="px-8 py-4 rounded-full border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] transition"
              >
                Find a job
              </Button>
            </motion.div>

            <motion.div variants={cardVariants} custom={4} className="mt-14 pt-8 border-t border-[#2A2E3D] flex flex-wrap justify-center gap-x-10 gap-y-4">
              {heroStats.map((s) => (
                <div key={s.l}>
                  <p className="text-xl font-bold" style={mono}>{s.n}</p>
                  <p className="text-xs text-[#9CA1B5] mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={cardVariants} custom={5} className="mt-16 hidden sm:flex items-center justify-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold border border-[#2A2E3D] bg-[#171A24]" style={fraunces}>You</div>
              <div className="relative flex-1 h-[2px] mx-1" style={{ backgroundImage: "linear-gradient(90deg, #2A2E3D 55%, transparent 45%)", backgroundSize: "9px 2px", backgroundRepeat: "repeat-x" }}>
                <motion.span
                  className="absolute -top-[4px] w-2.5 h-2.5 rounded-full bg-[#7C9CFF]"
                  animate={{ left: ["0%", "92%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA]">
                <Link2 className="w-5 h-5 text-[#0E1016]" />
              </div>
              <div className="relative flex-1 h-[2px] mx-1" style={{ backgroundImage: "linear-gradient(90deg, #2A2E3D 55%, transparent 45%)", backgroundSize: "9px 2px", backgroundRepeat: "repeat-x" }}>
                <motion.span
                  className="absolute -top-[4px] w-2.5 h-2.5 rounded-full bg-[#C08BFA]"
                  animate={{ left: ["0%", "92%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "linear", delay: 1.3 }}
                />
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold border border-[#2A2E3D] bg-[#171A24]" style={fraunces}>Tutor</div>
            </motion.div>
            <motion.p variants={cardVariants} custom={6} className="mt-3 text-center text-[11px] tracking-wider text-[#9CA1B5]" style={mono}>
              MATCHED IN MINUTES, NOT DAYS
            </motion.p>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-3" style={mono}>The process</p>
          <h3 className="text-center text-4xl font-bold mb-20" style={fraunces}>
            How TutorLink Works
          </h3>

          <div className="grid md:grid-cols-3 gap-10">
            {howItWorks.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} custom={i} variants={cardVariants} initial="hidden" whileInView="visible">
                <Card className="hover:-translate-y-2 transition bg-[#171A24] border border-[#2A2E3D] text-[#F3F4F8]">
                  <CardContent className="text-center p-10">
                    <p className="text-xs font-bold mb-3 text-[#7C9CFF]" style={mono}>{step}</p>
                    <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-[#1E2230] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#7C9CFF]" />
                    </div>
                    <h4 className="font-bold text-xl mb-3">{title}</h4>
                    <p className="text-[#9CA1B5]">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SUBJECTS */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2" style={mono}>Explore</p>
          <h3 className="text-3xl font-bold mb-8" style={fraunces}>Popular subjects</h3>
          <div className="flex flex-wrap gap-3">
            {subjects.map((s) => (
              <span
                key={s}
                className="px-5 py-2.5 rounded-full border border-[#2A2E3D] text-sm text-[#9CA1B5] hover:text-[#F3F4F8] hover:border-[#7C9CFF] hover:bg-[#171A24] transition cursor-default"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* WHY TUTORLINK */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2" style={mono}>Why TutorLink</p>
          <h3 className="text-3xl font-bold mb-10" style={fraunces}>Built to make learning stick</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                className="p-6 rounded-2xl bg-[#1E2230]"
              >
                <div className="w-11 h-11 rounded-xl bg-[#171A24] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#7C9CFF]" />
                </div>
                <h4 className="font-semibold mb-1.5">{title}</h4>
                <p className="text-sm text-[#9CA1B5] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2" style={mono}>Community</p>
          <h3 className="text-3xl font-bold mb-10" style={fraunces}>Students and tutors on TutorLink</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                className="p-6 rounded-2xl bg-[#171A24] border border-[#2A2E3D] flex flex-col gap-4"
              >
                <div className="flex gap-1 text-[#7C9CFF]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#0E1016] bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA]">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-[#9CA1B5]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <div className="rounded-[2.5rem] p-12 text-center shadow-2xl bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA]">
            <h3 className="text-4xl font-bold mb-4 text-[#0E1016]" style={fraunces}>
              Ready to get started?
            </h3>
            <p className="text-[#0E1016]/80 max-w-md mx-auto mb-8">
              Join thousands of students and tutors learning — and earning — on their own schedule.
            </p>
            <Button
              onClick={() => !user && navigate("/login")}
              className="bg-[#171A24] text-[#F3F4F8] px-10 py-5 rounded-full font-bold hover:scale-105 transition"
            >
              Get started
            </Button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#2A2E3D] py-14 px-6">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA]">
                  <FaGraduationCap className="w-4 h-4 text-[#0E1016]" />
                </div>
                <span className="text-lg font-extrabold" style={fraunces}>
                  Tutor<span className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] bg-clip-text text-transparent">Link</span>
                </span>
              </div>
              <p className="text-sm text-[#9CA1B5] max-w-[26ch] mb-4">
                Personalized tutoring, matched to your subject, schedule, and goals.
              </p>
              <div className="flex gap-4 text-[#9CA1B5]">
                <FaInstagram className="hover:text-[#F3F4F8] transition cursor-default" />
                <FaFacebook className="hover:text-[#F3F4F8] transition cursor-default" />
                <FaLinkedin className="hover:text-[#F3F4F8] transition cursor-default" />
                <FaYoutube className="hover:text-[#F3F4F8] transition cursor-default" />
              </div>
            </div>

            <div>
              <h5 className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-4" style={mono}>Product</h5>
              <ul className="space-y-2.5 text-sm">
                {["Find a tutor", "Become a tutor", "How it works", "Pricing"].map((l) => (
                  <li key={l}><span className="hover:text-[#7C9CFF] transition cursor-default">{l}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-4" style={mono}>Company</h5>
              <ul className="space-y-2.5 text-sm">
                {["About", "Careers", "Contact", "Blog"].map((l) => (
                  <li key={l}><span className="hover:text-[#7C9CFF] transition cursor-default">{l}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-4" style={mono}>Support</h5>
              <ul className="space-y-2.5 text-sm">
                {["Help center", "Safety", "Terms", "Privacy"].map((l) => (
                  <li key={l}><span className="hover:text-[#7C9CFF] transition cursor-default">{l}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto pt-6 border-t border-[#2A2E3D] flex flex-wrap justify-between gap-2 text-xs text-[#9CA1B5]">
            <span>© 2025 TutorLink Inc.</span>
            <span>All rights reserved.</span>
          </div>
        </footer>
      </div>

      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toaster toastOptions={toastDarkOptions} />
    </div>
  );
};

export default Home;