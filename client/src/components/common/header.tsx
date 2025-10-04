import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FaBell, FaGraduationCap, FaUserCircle } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "../../pages/tutors/applicationModal";
import { authService } from "../../services/authService";

const Header: React.FC = () => {
  const { search, setSearch, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdminMsg, setShowAdminMsg] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  async function handleLogout() {
    try {
      const response = await authService.logout(); // remove cookies
      logout(); // remove from store
      navigate("/");
      toast.success(response.message);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900" onClick={closeModal}>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-purple-950 to-black shadow-md rounded-b-2xl">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-indigo-600">
              TutorLink
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="w-full max-w-3xl relative">
              <Input
                placeholder="Search tutors by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full px-6 py-3 text-white bg-white/10 focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
              <HiOutlineAdjustments className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white cursor-pointer hover:text-gray-200 transition" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 relative">
            <FaBell className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition" />

            {/* User Dropdown */}
            <div className="relative">
              <FaUserCircle
                className="w-8 h-8 text-white cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg p-4 z-50">
                  <p className="font-bold text-gray-800">{user?.name || ""}</p>
                  <p className="text-sm text-yellow-600 mb-3">{user?.role || ""}</p>

                  {/* Tutor Application Section */}
                  {user?.role === "client" && (
                    <div className="space-y-3">
                      {/* Pending */}
                      {user.tutorApplication?.status === "Pending" && (
                        <div className="p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-500 text-yellow-800 font-medium">
                          Your tutor application is pending review.
                        </div>
                      )}

                      {/* Rejected */}
                      {user.tutorApplication?.status === "Rejected" && (
                        <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-500 text-red-800 font-medium space-y-2">
                          <p>
                            Your tutor application was rejected by the admin.
                          </p>

                          {/* Admin Message */}
                          {user.tutorApplication?.adminMessage && (
                            <div>
                              <button
                                className="text-sm text-red-700 underline hover:text-red-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAdminMsg(!showAdminMsg);
                                }}
                              >
                                {showAdminMsg ? "Hide Reason" : "View Reason"}
                              </button>

                              {showAdminMsg && (
                                <div className="mt-2 p-2 bg-red-200 rounded text-sm text-red-900 shadow-inner">
                                  {user.tutorApplication.adminMessage}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Resubmit Button */}
                          <Button
                            onClick={openModal}
                            className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                          >
                            Resubmit Application
                          </Button>
                        </div>
                      )}

                      {/* No Application */}
                      {!user.tutorApplication?.status && (
                        <Button
                          onClick={openModal}
                          className="w-full bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg font-medium"
                        >
                          Become a Tutor
                        </Button>
                      )}

                      {/* Approved */}
                      {user.tutorApplication?.status === "Approved" && (
                        <div className="p-3 bg-green-100 rounded-lg border-l-4 border-green-500 text-green-800 font-medium">
                          Your tutor application is approved! 🎉
                        </div>
                      )}
                    </div>
                  )}

                  {/* Other Options */}
                  <Button
                    variant="outline"
                    className="w-full mb-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  >
                    Messages
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mb-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-red-400 text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Toaster position="top-center" reverseOrder={false} />
      <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Header;
