import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type React from "react";
import { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import { isValidEmail, isValidName, isStrongPassword } from "../../utils/validators";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function validate(): boolean {
    if (!formData.name || !isValidName(formData.name)) {
      toast.error("Please enter a valid name (letters only).");
      return false;
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error("Enter a valid email.");
      return false;
    }
    if (!formData.password || !isStrongPassword(formData.password)) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      toast.success("OTP sent to your email 📩");
      navigate(`/verify-otp?email=${response.email}`);
      
    } catch (error: any) {
      toast.error(error?.message || "Signup failed ❌");
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

      {/* Signup Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-xl w-full max-w-md mt-24">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Create Account
        </h2>
        <p className="text-center text-gray-200 mb-8">
          Sign up to start your learning journey with TutorLink
        </p>

        {/* Signup Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            type="email"
            placeholder="Email"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Log In
          </a>
        </p>

        {/* Google Login */}
        <div className="flex items-center gap-4 mt-8 justify-center">
          <Button
            disabled={isLoading}
            className="rounded-full bg-white text-gray-900 px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <FcGoogle className="w-6 h-6" />
            Sign up with Google
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-6 text-gray-200 text-sm">
        © 2025 TutorLink. All rights reserved.
      </footer>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Signup;
