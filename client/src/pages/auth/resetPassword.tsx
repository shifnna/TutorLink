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

      {/* Reset Password Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-xl w-full max-w-md mt-24">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Reset Password
        </h2>
        <p className="text-center text-gray-200 mb-8">
          Set your new password for <span className="text-yellow-300">{email}</span>
        </p>

        {/* Reset Password Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            type="password"
            name="password"
            placeholder="New Password"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
          >
            Reset Password
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

export default ResetPassword;
