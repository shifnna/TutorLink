import { motion } from "framer-motion";
import Dropdown from './dropdown';
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";



function Header() {
  const easeOutExpo = [0.22, 1, 0.36, 1] as const;
  const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

const navigate = useNavigate();
const {user} = useAuthStore();

  return (
    <div>
       {/* NAVBAR (FIXED PREMIUM) */}
      <motion.header
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 md:px-12 py-4
        bg-[#171A24]/70 backdrop-blur-xl border-b border-[#2A2E3D]
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="p-2 rounded-xl shadow-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA]">
            <FaGraduationCap className="w-6 h-6 text-[#0E1016]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={fraunces}>
            Tutor<span className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] bg-clip-text text-transparent">Link</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-[#9CA1B5]">
  {[
    { label: "Home", href: "#", onClick: () => navigate("/") },
    { label: "Explore Tutors", href: "#", onClick: () => (user ? navigate("/explore-tutors") : navigate("/login")) },
    { label: "About", href: "#", onClick: (e) => e.preventDefault() },
    { label: "Contact", href: "#", onClick: (e) => e.preventDefault() },
  ].map((item, i) => (
    <motion.a
      key={item.label}
      href={item.href}
      onClick={item.onClick}
      className="relative py-1 hover:text-[#F3F4F8] transition"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * i }}
    >
      {item.label}
    </motion.a>
  ))}
</nav>

        <div>
          {user ? (
            <Dropdown />
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-6 py-2.5 shadow-md hover:scale-105 transition"
            >
              Log in
            </Button>
          )}
        </div>
      </motion.header>
    </div>
  )
}

export default Header
