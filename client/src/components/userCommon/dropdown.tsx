import { useState, useRef, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import ApplicationModal from "../../pages/client/applicationModal";
import { useNotificationStore } from "../../store/notificationStore";
import { motion, AnimatePresence } from "framer-motion";

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

const Dropdown = () => {
  const { unreadCount, markAllSeen } = useNotificationStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminMsg, setShowAdminMsg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    try {
      await authService.logout();
      await logout();
      navigate("/login");
      toast.success("Logged out");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  }

  return (
    <div className="flex items-center gap-5 relative" ref={ref}>

      {/* Notification */}
      <div className="relative">
        <FaBell
  className="w-5 h-5 text-[#9CA1B5] cursor-pointer hover:text-[#F3F4F8] transition"
  onClick={() => {
    const role = user?.role;
    if (role === "tutor") navigate(`/tutor/notifications`);
    if (role === "client") navigate(`/client/notifications`);
    if (user?._id) markAllSeen(user._id);
  }}
/>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] font-semibold bg-[#C08BFA] text-white px-1.5 rounded-full border-2 border-[#0E1016]">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative">
        <FaUserCircle
          className="w-7 h-7 text-[#9CA1B5] cursor-pointer hover:text-[#F3F4F8] transition"
          onClick={() => setMenuOpen((p) => !p)}
        />

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-72 rounded-xl border border-[#2A2E3D] bg-[#171A24] shadow-[0_20px_50px_rgba(0,0,0,0.45)] z-[9999] text-[#F3F4F8]"
            >

              {/* USER */}
              <div className="px-4 py-3 border-b border-[#2A2E3D]">
                <p className="text-sm font-semibold text-[#F3F4F8]">
                  {user?.name}
                </p>
                <p className="text-xs text-[#9CA1B5] capitalize">
                  {user?.role}
                </p>
              </div>

              {/* CLIENT STATUS */}
              {user?.role === "client" && (
                <div className="px-4 py-3 border-b border-[#2A2E3D] space-y-2">

                  {user.tutorApplication?.status === "Pending" && (
                    <p className="text-xs text-amber-400">
                      Application pending review
                    </p>
                  )}

                  {user.tutorApplication?.status === "Rejected" && (
                    <div className="space-y-1">
                      <p className="text-xs text-red-400">
                        Application rejected
                      </p>

                      {user.tutorApplication?.adminMessage && (
                        <>
                          <button
                            className="text-xs underline text-[#9CA1B5] hover:text-[#F3F4F8]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAdminMsg(!showAdminMsg);
                            }}
                          >
                            {showAdminMsg ? "Hide reason" : "View reason"}
                          </button>

                          {showAdminMsg && (
                            <p className="text-xs text-[#9CA1B5]">
                              {user.tutorApplication.adminMessage}
                            </p>
                          )}
                        </>
                      )}

                      <Button
                        size="sm"
                        className="w-full mt-2 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold hover:scale-[1.02] transition"
                        onClick={() => {
                          setMenuOpen(false);
                          setIsModalOpen(true);
                        }}
                      >
                        Reapply
                      </Button>
                    </div>
                  )}

                  {!user.tutorApplication?.status && (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold hover:scale-[1.02] transition"
                      onClick={() => {
                        setMenuOpen(false);
                        setIsModalOpen(true);
                      }}
                    >
                      Become a tutor
                    </Button>
                  )}

                  {user.tutorApplication?.status === "Approved" && (
                    <p className="text-xs text-emerald-400">
                      Tutor approved
                    </p>
                  )}
                </div>
              )}

              {/* MENU */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate("/user-profile");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#1E2230] transition"
                >
                  Profile
                </button>

                {/* <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#1E2230] transition">
                  Messages
                </button>

                <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#1E2230] transition">
                  Settings
                </button> */}

                <div className="border-t border-[#2A2E3D] my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toaster position="top-center" toastOptions={toastDarkOptions} />
    </div>
  );
};

export default Dropdown;