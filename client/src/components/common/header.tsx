import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { FaBell, FaGraduationCap, FaUserCircle } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";
import { authRepository } from "../../repositories/authRepository";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "../../pages/tutors/applicationModal";


const Header : React.FC = () => {    
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {logout,user} = useAuthStore()
    const navigate = useNavigate();

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);
  async function handleLogout() {
  try {
    const response = await authRepository.logout() //rmv cookies
    logout(); //remv frm state/store
    navigate("/");
    toast.success(response.message)
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
  

  return (
        <div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900"
      onClick={closeModal} // 👈 clicking anywhere closes modal
    >
    <div>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-purple-950 to-black shadow-md rounded-b-2xl">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-3">
            <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-indigo-600 shining-text">
              TutorLink
            </h1>
          </div>

          {/* Search Bar */}
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

          {/* Icons: Notifications + User */}
          <div className="flex items-center gap-4 relative">
            <FaBell className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition" />

            {/* User Icon with dropdown */}
            <div className="relative">
              <FaUserCircle
                className="w-8 h-8 text-white cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg p-4 z-50">
                  <p className="font-bold text-gray-800">{user?.name || ""}</p>
                  <p className="text-sm text-yellow-600 mb-3">{user?.role || ""}</p>

                  {/* {user.role === "client" && ( */}
                    {/* <Button onClick={() => setIsModalOpen(true)} className="w-full mb-2 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg">
                      Become a Tutor
                    </Button> */}
                    <Button onClick={(e) => {e.stopPropagation(); openModal()}} className="w-full mb-2 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg">
                      Become a Tutor
                    </Button>
                  {/* )} */}

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
    </div>
  )
}

export default Header
