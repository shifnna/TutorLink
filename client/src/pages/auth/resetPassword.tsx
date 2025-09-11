import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email") || "";

  const { resetPassword } = useAuthStore(); 
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(email, formData.password);
      toast.success("Password reset successfully ✅");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Reset failed ❌");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-black text-white">
       {/* Right side (reset password card) */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaGraduationCap className="w-10 h-10 text-amber-400 animate-bounce" />
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              TutorLink
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
          <p className="text-center text-gray-300 mb-6">
            Set a new password for <span className="text-yellow-400">{email}</span>
          </p>

          {/* Reset Password Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              type="password"
              name="password"
              placeholder="New Password"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
            >
              Reset Password
            </Button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Remembered your password?{" "}
            <a href="/login" className="text-yellow-400 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ResetPassword;
