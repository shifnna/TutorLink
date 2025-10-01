import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { isValidEmail, isValidName, isStrongPassword } from "../../utils/validators";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup,isLoading } = useAuthStore();

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
      useAuthStore.getState().setLoading(true);
      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      toast.success("OTP sent to your email 📩");
      navigate(`/verify-otp?email=${response.email}&type=signup`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Signup failed ❌");
    } finally {
      useAuthStore.getState().setLoading(false); // stop loading
    }
  }


  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("googleSuccess")) {
    toast.success("Logged in with Google! 🎉");
    // Optionally, fetch user data from /me endpoint
    navigate("/");
  }
  }, []);


  function handleGoogle(){
    window.location.href = "http://localhost:5000/api/auth/google";
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-black text-white">

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
          <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
          <p className="text-center text-gray-300 mb-6">
            Sign up to start your learning journey
          </p>

          {/* Signup Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
            >
              Sign Up
            </Button>
          </form>

          {/* Links */}
          <p className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-400 hover:underline">
              Log In
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-grow h-px bg-gray-600"></span>
            <span className="text-sm text-gray-400">or</span>
            <span className="flex-grow h-px bg-gray-600"></span>
          </div>

          {/* Google Signup */}
          <Button
            onClick={()=>handleGoogle()}
            type="button"
            className="w-full rounded-xl bg-white text-gray-900 px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
          >
            <FcGoogle className="w-6 h-6" />
            Sign up with Google
          </Button>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
{isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)}
    </div>
  );
};

export default Signup;
