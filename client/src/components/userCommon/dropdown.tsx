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
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex items-center gap-5 relative" ref={ref}>
      
      {/* 🔔 Notification */}
      <div className="relative">
        <FaBell
          className="w-5 h-5 text-slate-600 cursor-pointer hover:text-slate-900 transition"
          onClick={() => {
            const role = user?.role;
            if (role === "tutor") navigate(`/tutor/notifications`);
            if (role === "client") navigate(`/client/notifications`);
            markAllSeen();
          }}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* 👤 Avatar */}
      <div className="relative">
        <FaUserCircle
          className="w-7 h-7 text-slate-700 cursor-pointer hover:text-black transition"
          onClick={() => setMenuOpen((p) => !p)}
        />

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-72 rounded-xl border border-slate-200 bg-white shadow-lg z-[9999]"
            >
              
              {/* USER */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </p>
              </div>

              {/* CLIENT STATUS */}
              {user?.role === "client" && (
                <div className="px-4 py-3 border-b border-slate-100 space-y-2">

                  {user.tutorApplication?.status === "Pending" && (
                    <p className="text-xs text-yellow-600">
                      Application pending review
                    </p>
                  )}

                  {user.tutorApplication?.status === "Rejected" && (
                    <div className="space-y-1">
                      <p className="text-xs text-red-600">
                        Application rejected
                      </p>

                      {user.tutorApplication?.adminMessage && (
                        <>
                          <button
                            className="text-xs underline text-slate-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAdminMsg(!showAdminMsg);
                            }}
                          >
                            {showAdminMsg ? "Hide reason" : "View reason"}
                          </button>

                          {showAdminMsg && (
                            <p className="text-xs text-slate-600">
                              {user.tutorApplication.adminMessage}
                            </p>
                          )}
                        </>
                      )}

                      <Button
                        size="sm"
                        className="w-full mt-2"
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
                      className="w-full"
                      onClick={() => {
                        setMenuOpen(false);
                        setIsModalOpen(true);
                      }}
                    >
                      Become a Tutor
                    </Button>
                  )}

                  {user.tutorApplication?.status === "Approved" && (
                    <p className="text-xs text-green-600">
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
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Profile
                </button>

                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                  Messages
                </button>

                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                  Settings
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toaster position="top-center" />
    </div>
  );
};

export default Dropdown;