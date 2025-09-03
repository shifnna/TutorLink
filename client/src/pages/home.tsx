import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Search, MessageSquare, BookOpen } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  async function handleLogin(){
    navigate("/login")
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white">
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-6 shadow-md sticky top-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-2xl z-50">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-10 h-10 text-amber-400 " />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-100 via-pink-500 to-indigo-900 bg-clip-text text-transparent shining-text">
            TutorLink
          </h1>
        </div>
        <nav className="flex gap-8 font-medium text-shadow-md">
          <a href="#" className="hover:text-yellow-200 transition">Home</a>
          <a href="#" className="hover:text-yellow-200 transition">About</a>
          <a href="#" className="hover:text-yellow-200 transition">Contact</a>
        </nav>
        <Button onClick={handleLogin} className="rounded-full bg-yellow-400 text-gray-900 font-bold px-6 hover:bg-yellow-300 transition cursor-pointer">
          Log In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-6 mt-24 px-6 md:px-10">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg bg-gradient-to-r from-white/80 via-white/60 to-white/80 text-transparent bg-clip-text">
          Find Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-white/70 to-white/90">Perfect Tutor</span>
        </h2>


        <p className="text-gray-200 text-lg max-w-2xl">
          Connect with skilled tutors for personalized learning experiences that fit your goals.
        </p>

        <div className="flex gap-4 mt-4">
          <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-3 hover:scale-105 hover:shadow-lg transition">
            Become a Tutor
          </Button>
          <Button variant="outline" className="rounded-full border-white text-white px-6 py-3 hover:bg-white hover:text-purple-800 transition cursor-pointer">
            Find Tutor
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-lg mt-8 rounded-full overflow-hidden border border-white shadow-lg">
          <Input
            type="text"
            placeholder="Search tutors by subject..."
            className="border-none focus:ring-0 text-gray-800 px-6 py-4 rounded-l-full bg-white"
          />
          <Button className="rounded-r-full px-6 py-4 text-white font-medium hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500 transition cursor-pointer">
            Search
          </Button>
        </div>
      </section >

      {/* How It Works */}
      <section className="px-6 md:px-10 py-16 bg-white text-gray-900 rounded-t-3xl mt-16">
        <h3 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-indigo-700 tracking-wide drop-shadow-md">
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
      <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-10 py-12 text-sm">
          <div>
            <h5 className="font-semibold mb-2">About Us</h5>
            <p className="hover:underline cursor-pointer">Feedback</p>
            <p className="hover:underline cursor-pointer">Referral Program</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Support</h5>
            <p className="hover:underline cursor-pointer">Help Center</p>
            <p className="hover:underline cursor-pointer">Trust & Safety</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Community</h5>
            <p className="hover:underline cursor-pointer">Blog</p>
            <p className="hover:underline cursor-pointer">Events</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">More</h5>
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
          <p className="text-xs text-gray-200 mt-4">© 2025 TutorLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;