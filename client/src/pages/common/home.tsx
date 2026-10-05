
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
  ArrowRight,
  BriefcaseBusiness,
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
import { getSubjects } from "../../services/clientService";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

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
    transition: {
      delay: 0.2 + i * 0.12,
      duration: 0.5,
      ease: easeOutExpo,
    },
  }),
};

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
    border: "1px solid #343B53",
  },
};

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
        <Sparkles className="w-4 h-4 text-[#9BB2FF]" />
      </motion.div>

      <motion.div
        className="absolute right-[19%] top-[22px]"
        animate={{ y: [5, -5, 5], rotate: [0, -12, 0], opacity: [0.35, 1, 0.35] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#D0AEFF]" />
      </motion.div>

      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="relative w-[190px] h-[112px] rounded-[24px] border border-[#38415C] bg-[#171A24] shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

          <div className="absolute left-5 top-5">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] flex items-center justify-center shadow-lg"
            >
              <UserRound className="w-7 h-7 text-[#101321]" />
            </motion.div>
          </div>

          <div className="absolute left-[82px] top-[19px] text-left">
            <p className="text-[13px] font-semibold text-[#F8F9FF]">
              Your Tutor
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-[#C0C7DE]">
                Available now
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 fill-current text-[#F5B942]" />
              <span className="text-[9px] text-[#C0C7DE]">
                4.9 rating
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#8EA9FF]" />
              <span className="w-1 h-1 rounded-full bg-[#A78CF5]" />
              <span className="w-1 h-1 rounded-full bg-[#D0AEFF]" />
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#C0C7DE]">
              <Video className="w-3 h-3" />
              Live
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [3, -5, 3], rotate: [0, 4, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute right-[21%] bottom-[12px] z-20 w-9 h-9 rounded-full bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] flex items-center justify-center border-4 border-[#0E1016] shadow-lg"
      >
        <Link2 className="w-4 h-4 text-[#101321]" />
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

  
  const defaultSubjects = [
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

const [subjects, setSubjects] = useState<string[]>(defaultSubjects); 

  useEffect(() => {
  const fetchSubjects = async () => {
    const response = await getSubjects();
    if (response.success && response.data?.length) {
      setSubjects(response.data);
    }
  };
  fetchSubjects();
}, []);

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

  const handleFindTutor = () => {
    user ? navigate("/explore-tutors") : navigate("/login");
  };

  const handleFindJob = () => {
    user ? navigate("/find-job") : navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0E1016] text-[#F3F4F8] font-sans selection:bg-[#7C9CFF]/25 selection:text-[#F3F4F8]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        <div
          className="absolute top-[30%] left-[40%] w-[40vmax] h-[40vmax] rounded-full opacity-20 animate-blob mix-blend-screen blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,156,255,0.35) 0%, transparent 70%)",
            animationDelay: "-8s",
          }}
        />
        <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
      </div>

      <div className="pt-5">
        {/* Hero */}
        <section className="relative text-center px-4 sm:px-6 py-20 md:py-24 max-w-7xl mx-auto">
          <motion.div variants={container} initial="hidden" animate="visible">
            <TutorAnimation />

            <motion.div
              variants={cardVariants}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#38415C] bg-[#171A24]/80 text-[11px] uppercase tracking-wider text-[#D0D5E8] mb-6"
              style={mono}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#8EA9FF] to-[#D0AEFF]" />
              Matched with a real tutor, not a search result
            </motion.div>

            <motion.h2
              variants={cardVariants}
              custom={1}
              className="text-4xl sm:text-5xl md:text-7xl leading-tight text-[#F8F9FF]"
              style={{ ...fraunces, fontWeight: 550 }}
            >
              Master Any Subject
              <span className="block bg-gradient-to-r from-[#8EA9FF] via-[#B39CFF] to-[#D0AEFF] bg-clip-text text-transparent">
                with Expert Tutors
              </span>
            </motion.h2>

            <motion.p
              variants={cardVariants}
              custom={2}
              className="mt-6 text-[#D0D5E8] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Tell us what you're learning, get matched with a vetted tutor
              within 24 hours, and book sessions that fit your schedule — not
              the other way around.
            </motion.p>

            {/* Main action buttons */}
            <motion.div
              variants={cardVariants}
              custom={3}
              className="mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center"
            >
              <Button
                onClick={() =>
                  user ? setIsModalOpen(true) : navigate("/login")
                }
                className="group h-12 px-7 rounded-full bg-gradient-to-r from-[#8EA9FF] to-[#B99BFA] text-[#101321] font-bold shadow-lg shadow-[#7C9CFF]/15 hover:shadow-xl hover:shadow-[#7C9CFF]/25 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
              >
                <FaGraduationCap className="w-4 h-4" />
                Become a tutor
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={handleFindTutor}
                className="group h-12 px-7 rounded-full border border-[#657CB7] bg-[#20283D] text-[#E4EAFF] font-semibold hover:bg-[#293653] hover:border-[#9BB2FF] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Search className="w-4 h-4 text-[#AFC2FF]" />
                Find a tutor
                <ArrowRight className="w-4 h-4 ml-2 text-[#AFC2FF] transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={handleFindJob}
                className="group h-12 px-7 rounded-full border border-[#765D9A] bg-[#2A2338] text-[#F0E5FF] font-semibold hover:bg-[#382B4B] hover:border-[#C49BFA] hover:-translate-y-0.5 transition-all duration-300"
              >
                <BriefcaseBusiness className="w-4 h-4 text-[#D0AEFF]" />
                Find a job
                <ArrowRight className="w-4 h-4 ml-2 text-[#D0AEFF] transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={cardVariants}
              custom={4}
              className="mt-14 pt-8 border-t border-[#343B53] flex flex-wrap justify-center gap-x-10 gap-y-6"
            >
              {heroStats.map((s, i) => (
                <div key={s.l} className="min-w-[110px]">
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      i % 2 === 0 ? "text-[#B6C8FF]" : "text-[#D6B9FA]"
                    }`}
                    style={mono}
                  >
                    {s.n}
                  </p>
                  <p className="text-xs text-[#C0C7DE] mt-2">{s.l}</p>
                </div>
              ))}
            </motion.div>

            {/* Connection illustration */}
            <motion.div
              variants={cardVariants}
              custom={5}
              className="mt-16 hidden sm:flex items-center justify-center max-w-md mx-auto"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold border border-[#46516F] bg-[#171A24] text-[#F3F4F8]"
                style={fraunces}
              >
                You
              </div>

              <div
                className="relative flex-1 h-[2px] mx-1"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #46516F 55%, transparent 45%)",
                  backgroundSize: "9px 2px",
                  backgroundRepeat: "repeat-x",
                }}
              >
                <motion.span
                  className="absolute -top-[4px] w-2.5 h-2.5 rounded-full bg-[#8EA9FF]"
                  animate={{ left: ["0%", "92%"], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] shadow-lg shadow-[#7C9CFF]/10">
                <Link2 className="w-5 h-5 text-[#101321]" />
              </div>

              <div
                className="relative flex-1 h-[2px] mx-1"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #46516F 55%, transparent 45%)",
                  backgroundSize: "9px 2px",
                  backgroundRepeat: "repeat-x",
                }}
              >
                <motion.span
                  className="absolute -top-[4px] w-2.5 h-2.5 rounded-full bg-[#D0AEFF]"
                  animate={{ left: ["0%", "92%"], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1.3,
                  }}
                />
              </div>

              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold border border-[#46516F] bg-[#171A24] text-[#F3F4F8]"
                style={fraunces}
              >
                Tutor
              </div>
            </motion.div>

            <motion.p
              variants={cardVariants}
              custom={6}
              className="mt-3 text-center text-[11px] tracking-wider text-[#B8C2DD]"
              style={mono}
            >
              MATCHED IN MINUTES, NOT DAYS
            </motion.p>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-6 py-20 md:py-24 max-w-7xl mx-auto">
          <p
            className="text-center text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-3"
            style={mono}
          >
            The process
          </p>

          <h3
            className="text-center text-3xl sm:text-4xl font-bold mb-14 text-[#F8F9FF]"
            style={fraunces}
          >
            How TutorLink Works
          </h3>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
            {howItWorks.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div
                key={step}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="h-full group hover:-translate-y-1.5 transition-all duration-300 bg-[#171A24] border border-[#343B53] hover:border-[#7C9CFF]/60 text-[#F3F4F8] rounded-2xl overflow-hidden">
                  <CardContent className="text-center p-7 sm:p-9">
                    <p
                      className={`text-xs font-bold mb-4 ${
                        i % 2 === 0 ? "text-[#AFC2FF]" : "text-[#D6B9FA]"
                      }`}
                      style={mono}
                    >
                      {step}
                    </p>

                    <div
                      className={`mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center border ${
                        i % 2 === 0
                          ? "bg-[#242E48] border-[#465A89]"
                          : "bg-[#30263E] border-[#58416F]"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          i % 2 === 0 ? "text-[#AFC2FF]" : "text-[#D6B9FA]"
                        }`}
                      />
                    </div>

                    <h4 className="font-bold text-lg sm:text-xl mb-3 text-[#F8F9FF]">
                      {title}
                    </h4>

                    <p className="text-[#D0D5E8] text-sm leading-relaxed">
                      {desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular subjects */}
        <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full">
          <p
            className="text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-2"
            style={mono}
          >
            Explore
          </p>

          <h3
            className="text-3xl sm:text-4xl font-bold mb-8 text-[#F8F9FF]"
            style={fraunces}
          >
            Popular subjects
          </h3>

          <div className="flex flex-wrap gap-3">
            {subjects.map((s, i) => (
              <span
                key={s}
                className={`px-4 sm:px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 cursor-default hover:-translate-y-0.5 ${
                  i % 3 === 0
                    ? "bg-[#242E48] border-[#465A89] text-[#DCE5FF] hover:bg-[#2D3A5A] hover:border-[#8EA9FF]"
                    : i % 3 === 1
                    ? "bg-[#30263E] border-[#58416F] text-[#F0DCFF] hover:bg-[#3A2D4C] hover:border-[#C49BFA]"
                    : "bg-[#1D3034] border-[#36545A] text-[#C8F0E9] hover:bg-[#254047] hover:border-[#7ACFC0]"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Why TutorLink */}
        <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full">
          <p
            className="text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-2"
            style={mono}
          >
            Why TutorLink
          </p>

          <h3
            className="text-3xl sm:text-4xl font-bold mb-10 text-[#F8F9FF]"
            style={fraunces}
          >
            Built to make learning stick
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="group p-6 rounded-2xl bg-[#171A24] border border-[#343B53] hover:border-[#7C9CFF]/60 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${
                    i % 2 === 0
                      ? "bg-[#242E48] border-[#465A89]"
                      : "bg-[#30263E] border-[#58416F]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      i % 2 === 0 ? "text-[#AFC2FF]" : "text-[#D6B9FA]"
                    }`}
                  />
                </div>

                <h4 className="font-semibold text-[#F8F9FF] mb-2">
                  {title}
                </h4>

                <p className="text-sm text-[#D0D5E8] leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full">
          <p
            className="text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-2"
            style={mono}
          >
            Community
          </p>

          <h3
            className="text-3xl sm:text-4xl font-bold mb-10 text-[#F8F9FF]"
            style={fraunces}
          >
            Students and tutors on TutorLink
          </h3>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="p-6 sm:p-7 rounded-2xl bg-[#171A24] border border-[#343B53] hover:border-[#7C9CFF]/50 flex flex-col gap-4 transition-all duration-300"
              >
                <div className="flex gap-1 text-[#F5B942]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-[#E0E4F2] leading-relaxed flex-1">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-[#343B53]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-[#101321] bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA]">
                    {t.initials}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#F8F9FF]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#C0C7DE] mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center border border-[#46516F] bg-gradient-to-br from-[#202B49] via-[#28253F] to-[#342742] shadow-2xl">
            <div className="absolute -top-24 -right-16 w-64 h-64 rounded-full bg-[#7C9CFF]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#C08BFA]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mx-auto mb-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#101321]" />
              </div>

              <h3
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#F8F9FF]"
                style={fraunces}
              >
                Ready to get started?
              </h3>

              <p className="text-[#D0D5E8] max-w-md mx-auto mb-8 leading-relaxed">
                Join thousands of students and tutors learning — and earning —
                on their own schedule.
              </p>

              <Button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    navigate("/explore-tutors");
                  }
                }}
                className="group h-12 bg-gradient-to-r from-[#8EA9FF] to-[#C49BFA] text-[#101321] px-9 rounded-full font-bold shadow-lg shadow-[#7C9CFF]/15 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#343B53] py-14 px-4 sm:px-6 bg-[#11131B]/70">
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] shadow-md">
                  <FaGraduationCap className="w-5 h-5 text-[#101321]" />
                </div>

                <span
                  className="text-xl font-extrabold text-[#F8F9FF]"
                  style={fraunces}
                >
                  Tutor
                  <span className="bg-gradient-to-r from-[#8EA9FF] to-[#D0AEFF] bg-clip-text text-transparent">
                    Link
                  </span>
                </span>
              </div>

              <p className="text-sm text-[#C0C7DE] max-w-[26ch] mb-5 leading-relaxed">
                Personalized tutoring, matched to your subject, schedule, and
                goals.
              </p>

              <div className="flex gap-4 text-[#B8C2DD]">
                <FaInstagram className="w-4 h-4 hover:text-[#D0AEFF] transition cursor-pointer" />
                <FaFacebook className="w-4 h-4 hover:text-[#AFC2FF] transition cursor-pointer" />
                <FaLinkedin className="w-4 h-4 hover:text-[#AFC2FF] transition cursor-pointer" />
                <FaYoutube className="w-4 h-4 hover:text-[#D0AEFF] transition cursor-pointer" />
              </div>
            </div>

            <div>
              <h5
                className="text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-4"
                style={mono}
              >
                Product
              </h5>

              <ul className="space-y-3 text-sm text-[#D0D5E8]">
                {["Find a tutor", "Become a tutor", "How it works", "Pricing"].map(
                  (label) => (
                    <li key={label}>
                      <span className="hover:text-[#AFC2FF] transition cursor-pointer">
                        {label}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h5
                className="text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-4"
                style={mono}
              >
                Company
              </h5>

              <ul className="space-y-3 text-sm text-[#D0D5E8]">
                {["About", "Careers", "Contact", "Blog"].map((label) => (
                  <li key={label}>
                    <span className="hover:text-[#D0AEFF] transition cursor-pointer">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5
                className="text-[11px] uppercase tracking-wider text-[#B8C2DD] mb-4"
                style={mono}
              >
                Support
              </h5>

              <ul className="space-y-3 text-sm text-[#D0D5E8]">
                {["Help center", "Safety", "Terms", "Privacy"].map((label) => (
                  <li key={label}>
                    <span className="hover:text-[#AFC2FF] transition cursor-pointer">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-6 border-t border-[#343B53] flex flex-wrap justify-between gap-2 text-xs text-[#B8C2DD]">
            <span>© 2025 TutorLink Inc.</span>
            <span>All rights reserved.</span>
          </div>
        </footer>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Toaster toastOptions={toastDarkOptions} />
    </div>
  );
};

export default Home;