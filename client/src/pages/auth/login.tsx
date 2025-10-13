import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import { isValidEmail } from "../../utils/validators";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login,isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  function validate(): boolean {
    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error("Invalid email");
      return false;
    }
    if (!formData.password) {
      toast.error("Password required");
      return false;
    }
    return true;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      useAuthStore.setState({isLoading:true})
      await login(formData.email, formData.password);
      toast.success("Login successful! 🎉");

    const role = useAuthStore.getState().user?.role;

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/explore-tutors");
    }

    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed ❌");
    } finally {
    useAuthStore.setState({isLoading:false})
    }

  }

  
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("accessToken");

  if (params.get("googleSuccess") && accessToken) {
    useAuthStore.setState({ accessToken: accessToken, isAuthenticated: true });
    toast.success("Logged in with Google! 🎉");
    navigate("/");
  }
  }, []);


  function handleGoogle(){
    window.location.href = "http://localhost:5000/api/auth/google";
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-black text-white">
      {/* Right side (login form) */}
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
          <h2 className="text-2xl font-bold text-center mb-4">Welcome Back </h2>
          <p className="text-center text-gray-300 mb-6">
            Log in to continue your learning journey
          </p>

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              value={formData.email}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              value={formData.password}
            />

            <div className="flex justify-between items-center text-sm">
              <a href="/forgot-password" className="text-indigo-300 hover:underline">
                Forgot Password?
              </a>
              <a href="/signup" className="text-yellow-400 hover:underline">
                Create Account
              </a>
            </div>

            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
            >
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-grow h-px bg-gray-600"></span>
            <span className="text-sm text-gray-400">or</span>
            <span className="flex-grow h-px bg-gray-600"></span>
          </div>

          {/* Google Login */}
          <Button
          onClick={()=>handleGoogle()}
            type="button"
            className="w-full rounded-xl bg-white text-gray-900 px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
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

export default Login;
