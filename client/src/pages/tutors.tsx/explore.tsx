import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap, FaUserCircle, FaBell } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";
import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { toast, Toaster } from "react-hot-toast";
import { authRepository } from "../../repositories/authRepository";
import ApplicationModal from "./applicationModal";
import { useNavigate } from "react-router-dom";

const ExploreTutors: React.FC = () => {
  const {logout,user} = useAuthStore()
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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
  
function handleTemp(){
  toast.loading("Application Coming Soon..")
}



  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900">
      {/* Navbar */}
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
                    <Button onClick={() => handleTemp()} className="w-full mb-2 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg">
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

      {/* Caption */}
      <div className="w-full text-center mt-4 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-700 to-pink-600 drop-shadow-md">
          Explore Verified Tutors
        </h2>
        <p className="text-gray-700 mt-1 text-sm md:text-base">
          Connect with skilled and verified tutors to achieve your learning goals.
        </p>
      </div>

      {/* Sidebar + Tutors Grid */}
      <div className="flex w-full mt-6 px-4 md:px-8 gap-6">
        {/* Sidebar */}
        {/* <aside className="w-64 bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-md flex flex-col gap-6 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Filter by Subject</h3>
          <div className="flex flex-col gap-2">
            {subjects.map(subject => (
              <Button
                key={subject}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedFilters.includes(subject)
                    ? "bg-purple-950 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => toggleFilter(subject)}
              >
                • {subject}
              </Button>
            ))}
          </div>
        </aside> */}

        {/* Tutors Grid */}
        {/* <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="flex flex-col justify-between bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 h-44"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-24 h-24 object-cover rounded-xl shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-bold">{tutor.name}</h3>
                  <p className="text-gray-500 text-sm">{tutor.subject}</p>
                  <p className="text-yellow-500 font-semibold mt-1 text-sm">⭐ {tutor.rating}</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button className="bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-full px-4 py-1 text-sm hover:scale-105 transition">
                  Connect
                </Button>
                <Button 
                  variant="outline"
                  className="rounded-full border-purple-500/40 bg-gray-100 text-gray-800 px-6 py-3 hover:bg-gray-200 hover:border-gray-500 transition"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </section> */}
      </div>
      <Toaster position="top-center" reverseOrder={false} />  
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ExploreTutors;
