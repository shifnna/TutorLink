import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import { isValidEmail } from "../../utils/validators";
import {toast,Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login: React.FC = () => {
  const navigate = useNavigate()
  const {login} = useAuthStore()

  const [formData,setFormData] = useState({ email : "",password : ""});

  function validate():boolean {
    if(!formData.email || !isValidEmail(formData.email)){
      toast.error("Invalid credential");
      return false;
    } 
    if(!formData.password){
      toast.error("Invalid credential");
      return false;
    } 
    return true;   
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
     const {name,value} = e.target;
     setFormData({...formData, [name]:value });
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!validate()) return;
    try {
      const response = await login(
        formData.email,
        formData.password,
      );
      toast.success("Login successful! 🎉");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed ❌");
    }
    
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white items-center justify-center px-6">
      
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-center py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-2xl shadow-md">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-10 h-10 text-amber-400" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-100 via-pink-500 to-indigo-900 bg-clip-text text-transparent shining-text">
            TutorLink
          </h1>
        </div>
      </header>

      {/* Login Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-xl w-full max-w-md mt-24">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Welcome Back
        </h2>
        <p className="text-center text-gray-200 mb-8">
          Log in to continue to your TutorLink account
        </p>

        {/* Login Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            onChange={handleChange}
            value={formData.email}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            className="rounded-full px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
            onChange={handleChange}
            value={formData.password}
          />
          <Button
            type="submit"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
          >
            Log In
          </Button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-yellow-400 hover:underline">
            Sign Up
          </a>
        </p>

        {/* Google Login */}
          <div className="flex items-center gap-4 mt-8 justify-center">
            <Button className="rounded-full bg-white text-gray-900 px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition">
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

export default Login;
