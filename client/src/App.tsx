import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageSquare, BookOpen } from "lucide-react";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fffef6]">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-6 shadow-sm bg-white">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="TutorLink Logo"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold text-blue-900">TutorLink</h1>
        </div>
        <nav className="flex gap-8 text-gray-700 font-medium">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
        <Button className="rounded-full bg-blue-900 px-6">Log In</Button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 max-w-6xl mx-auto gap-12">
        <div className="flex flex-col gap-6 max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            Find Your <br /> Perfect Tutor
          </h2>
          <p className="text-gray-600">
            Connect with Experted tutors for personalized learning
          </p>
          <div className="flex gap-4">
            <Button className="rounded-full bg-blue-900 px-6">Become a Tutor</Button>
            <Button className="rounded-full bg-blue-900 px-6">Find Tutor</Button>
          </div>
        </div>
        <img
          src="/tutor-illustration.png"
          alt="Tutor Illustration"
          className="max-w-sm"
        />
      </section>

      {/* How it Works */}
      <section className="px-10 py-16 bg-white shadow-sm">
        <h3 className="text-2xl font-semibold text-center mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardContent className="flex flex-col items-center gap-3 py-6">
              <Search className="w-10 h-10 text-blue-900" />
              <h4 className="font-bold">Search</h4>
              <p className="text-gray-600 text-sm">
                Find a tutor in any subject
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="flex flex-col items-center gap-3 py-6">
              <MessageSquare className="w-10 h-10 text-blue-900" />
              <h4 className="font-bold">Connect</h4>
              <p className="text-gray-600 text-sm">
                Message and choose a tutor
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="flex flex-col items-center gap-3 py-6">
              <BookOpen className="w-10 h-10 text-blue-900" />
              <h4 className="font-bold">Learn</h4>
              <p className="text-gray-600 text-sm">
                Start learning and track progress
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-10 py-12 text-sm">
          <div>
            <h5 className="font-semibold mb-2">About us</h5>
            <p>Feedback</p>
            <p>Referral program</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Trust, safety & security</h5>
            <p>Help & Support</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Trust, safety & security</h5>
            <p>Help & Support</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Trust, safety & security</h5>
            <p>Accessibility</p>
          </div>
        </div>
        <div className="flex justify-center gap-6 pb-6">
          <p className="text-sm">Follow us on</p>
          <div className="flex gap-4">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
