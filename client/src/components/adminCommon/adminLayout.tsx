import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useChatStore } from "../../store/chatStore";
import { chatService } from "../../services/chatService";
import Sidebar from "./sidebar";

const FONT_ID = "tutorlink-midnight-fonts";
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";

const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { setConversations } = useChatStore();

  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    chatService
      .getConversations()
      .then((res) => res.success && res.data && setConversations(res.data))
      .catch(() => {});
  }, [setConversations]);

  return (
    <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8]">
\      <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }}
        />
      </div>

      <Sidebar />

      <main className="relative z-10 ml-64 min-h-screen px-8 py-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>

      <Toaster
        position="top-center"
        toastOptions={{ style: { background: "#171A24", color: "#F3F4F8", border: "1px solid #2A2E3D" } }}
      />
    </div>
  );
};

export default AdminLayout;