import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";
import { isValidEmail } from "../../utils/validators";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuthStore(); 
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      const type = "forgot"
      await requestPasswordReset(email,type);
      toast.success("OTP sent to your email 📩");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=forgot`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Request failed ❌");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white items-center justify-center px-6">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-center py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-2xl shadow-md">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-10 h-10 text-amber-400" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-100 via-pink-500 to-indigo-900 bg-clip-text text-transparent">
            TutorLink
          </h1>
        </div>
      </header>

      {/* Forgot Password Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-xl w-full max-w-md mt-24">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-200 mb-8">
          Enter your registered email. We’ll send you an OTP to reset your
          password.
        </p>

        {/* Forgot Password Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
          >
            Send OTP
          </Button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Log In
          </a>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-6 text-gray-200 text-sm">
        © 2025 TutorLink. All rights reserved.
      </footer>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ForgotPassword;
