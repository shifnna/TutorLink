import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Search, MessageSquare, BookOpen } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGraduationCap,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {toast,Toaster} from "react-hot-toast";
import { useState } from "react";
import ApplicationModal from "./tutors/applicationModal";
import { authService } from "../services/authService";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdminMsg, setShowAdminMsg] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  async function handleLogin() {
    navigate("/login");
  }

  const { user,logout } = useAuthStore();

    async function handleLogout() {
    try {
      const response = await authService.logout() //rmv cookies
      logout(); //remv frm state/store
      navigate("/");
      toast.success(response.message)
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-6 sticky top-0 bg-black/40 backdrop-blur-md border-b border-purple-800/40 rounded-b-2xl shadow-lg z-50">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-10 h-10 text-amber-400 animate-bounce" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent shining-text">
            TutorLink
          </h1>
        </div>
        <nav className="flex gap-8 font-medium text-gray-200">
          <a href="#" className="hover:text-yellow-300 transition">
            Home
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            About
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            Contact
          </a>
        </nav>
          {user ? (
    // User dropdown
    <div className="relative">
      <FaUserCircle
        className="w-8 h-8 text-white cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      {menuOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg p-4 z-50">
          <p className="font-bold text-gray-800">{user?.name || ""}</p>
          <p className="text-sm text-yellow-600 mb-3">{user?.role || ""}</p>

          {user?.role === "client" && (
                                <>
                                  {user.tutorApplication?.status === "Pending" && (
                                    <Button
                                      disabled
                                      className="w-full mb-2 bg-green-400 text-white rounded-lg cursor-not-allowed"
                                    >
                                      Application Pending
                                    </Button>
                                  )}
          
                                  {user.tutorApplication?.status === "Rejected" && (
                                    <div className="w-full mb-2">
                                      <Button
                                        disabled
                                        className="w-full bg-red-500 text-white rounded-lg cursor-not-allowed"
                                      >
                                        Application Rejected
                                      </Button>
          
                                      {/* Dropdown Message */}
                                      <p
                                        className="text-sm mt-2 text-blue-950 cursor-pointer hover:underline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowAdminMsg(!showAdminMsg);
                                        }}
                                      >
                                        {showAdminMsg
                                          ? "💬Hide Message From Admin"
                                          : "💬View Message From Admin"}
                                      </p>
          
                                      <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                          showAdminMsg ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                                        }`}
                                      >
                                        <div className=" rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                                        {user.tutorApplication?.adminMessage || "No message provided"}
                                        </div>
                                      </div>
                                    </div>
                                  )}
          
                                  {!user.tutorApplication?.status && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModal();
                                      }}
                                      className="w-full mb-2 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg"
                                    >
                                      Become a Tutor
                                    </Button>
                                  )}
          
                                  {user.tutorApplication?.status === "Approved" && (
                                    <Button
                                      disabled
                                      className="w-full mb-2 bg-green-600 text-white rounded-lg cursor-not-allowed"
                                    >
                                      Application Approved
                                    </Button>
                                  )}
                                </>
                              )}

          <Button
            variant="outline"
            className="w-full mb-2 text-black rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
          >
            Messages
          </Button>
          <Button
            variant="outline"
            className="w-full text-black mb-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
          >
            Settings
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-lg border-red-400 text-red-600 hover:bg-red-100"
            onClick={()=>handleLogout()}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  ) : (
    <Button
      onClick={handleLogin}
      className="rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold px-6 hover:scale-105 transition"
    >
      Log In
    </Button>
  )}
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-6 mt-20 px-6 md:px-10">
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
            Find Your Perfect Tutor
          </span>
        </h2>

        <p className="text-gray-300 text-lg max-w-2xl">
          Connect with skilled tutors for personalized learning experiences that
          match your goals.
        </p>

        <div className="flex gap-4 mt-4">
          <Button onClick={() => {
            if (user) {
              openModal();
            } else {
              navigate("/login");
            }
          }} className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-600 text-white px-8 py-3 hover:scale-105 hover:shadow-lg transition">
            Become a Tutor
          </Button>
          <Button
            onClick={() => {
            if (user) {
              navigate("/explore-tutors")
            } else {
              navigate("/login");
            }
          }}
            variant="outline"
            className="rounded-full border-purple-500/40 text-white px-6 py-3 hover:bg-purple-800/40 hover:text-yellow-300 transition"
          >
            <a>Find Tutor</a>
          </Button>
          <Button
            onClick={() => {
            if (user) {
              navigate("/find-job")
            } else {
              navigate("/login");
            }
          }}
            variant="outline"
            className="rounded-full border-purple-500/40 text-white px-6 py-3 hover:bg-purple-800/40 hover:text-yellow-300 transition"
          >
            <a>Find Job</a>
          </Button>
        </div>

        {/* Search Bar */}
        {/* <div className="flex items-center w-full max-w-lg mt-8 rounded-full overflow-hidden bg-black/50 backdrop-blur-md border border-purple-700/50 shadow-lg">
          <Input
            type="text"
            placeholder="Search tutors by subject..."
            className="border-none focus:ring-0 text-gray-900 px-6 py-4 rounded-l-full bg-white"
          />
          <Button className="rounded-r-full px-6 py-4 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-600 hover:scale-105 transition">
            Search
          </Button>
        </div> */}
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900 rounded-t-3xl mt-16">
        <h3 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-yellow-400 tracking-wide drop-shadow-md">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center shadow-md hover:shadow-2xl transition rounded-2xl border-t-4 border-indigo-500 hover:-translate-y-2 duration-300">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <Search className="w-12 h-12 text-indigo-600" />
              <h4 className="font-bold text-lg">Search</h4>
              <p className="text-gray-600 text-sm">Browse tutors in any subject worldwide.</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md hover:shadow-2xl transition rounded-2xl border-t-4 border-pink-500 hover:-translate-y-2 duration-300">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <MessageSquare className="w-12 h-12 text-pink-600" />
              <h4 className="font-bold text-lg">Connect</h4>
              <p className="text-gray-600 text-sm">Message and choose the best tutor for you.</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md hover:shadow-2xl transition rounded-2xl border-t-4 border-yellow-400 hover:-translate-y-2 duration-300">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <BookOpen className="w-12 h-12 text-yellow-500" />
              <h4 className="font-bold text-lg">Learn</h4>
              <p className="text-gray-600 text-sm">Start learning, track progress, and achieve goals.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-purple-800/40 text-gray-300 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-10 py-12 text-sm">
          <div>
            <h5 className="font-semibold mb-2 text-white">About Us</h5>
            <p className="hover:underline cursor-pointer">Feedback</p>
            <p className="hover:underline cursor-pointer">Referral Program</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-white">Support</h5>
            <p className="hover:underline cursor-pointer">Help Center</p>
            <p className="hover:underline cursor-pointer">Trust & Safety</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-white">Community</h5>
            <p className="hover:underline cursor-pointer">Blog</p>
            <p className="hover:underline cursor-pointer">Events</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-white">More</h5>
            <p className="hover:underline cursor-pointer">Accessibility</p>
            <p className="hover:underline cursor-pointer">Careers</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 pb-6">
          <p className="text-sm">Follow us on</p>
          <div className="flex gap-6">
            <FaInstagram className="w-5 h-5 cursor-pointer hover:text-yellow-300 transition" />
            <FaFacebook className="w-5 h-5 cursor-pointer hover:text-yellow-300 transition" />
            <FaLinkedin className="w-5 h-5 cursor-pointer hover:text-yellow-300 transition" />
            <FaYoutube className="w-5 h-5 cursor-pointer hover:text-yellow-300 transition" />
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2025 TutorLink. All rights reserved.
          </p>
        </div>
      </footer>
      <Toaster position="top-center" reverseOrder={false} />  
      <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Home;
