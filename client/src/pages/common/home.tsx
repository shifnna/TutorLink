import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Search, MessageSquare, BookOpen } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import  toast, {Toaster } from "react-hot-toast";
import { useState } from "react";
import ApplicationModal from "../client/applicationModal";
import Dropdown from "../../components/userCommon/dropdown";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { user } = useAuthStore();

  async function handleLogin() {
    navigate("/login");
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
          <Dropdown/>
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
          <Button
            onClick={() => {
              if (user) openModal();
              else navigate("/login");
            }}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-600 text-white px-8 py-3 hover:scale-105 hover:shadow-lg transition"
          >
            Become a Tutor
          </Button>
          <Button
            onClick={() => (user ? navigate("/explore-tutors") : navigate("/login"))}
            variant="outline"
            className="rounded-full border-purple-500/40 text-white px-6 py-3 hover:bg-purple-800/40 hover:text-yellow-300 transition"
          >
            Find Tutor
          </Button>
          <Button
            onClick={() => (user ? navigate("/find-job") : navigate("/login"))}
            variant="outline"
            className="rounded-full border-purple-500/40 text-white px-6 py-3 hover:bg-purple-800/40 hover:text-yellow-300 transition"
          >
            Find Job
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
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
