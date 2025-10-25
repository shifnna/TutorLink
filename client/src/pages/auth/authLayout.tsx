import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}


const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    const { isLoading } = useAuthStore();

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
          <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
          {subtitle  && (
            <p className="text-center text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: subtitle }} />
          )}

          {/* Content (login, signup, otp etc.) */}
          {children}
                    
{isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)}
        <Toaster position="top-center" reverseOrder={false} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
