import React, { useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";

export const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // 6 boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOtp,resendOtp } = useAuthStore();
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email") || "";
  const type = new URLSearchParams(search).get("type") || "";

  function handleChange(value: string, index: number) {
    if (!/^\d*$/.test(value)) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // keep last digit only
    setOtp(newOtp);

    // move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      await verifyOtp(email, enteredOtp, type);
      if(type === "signup"){
        toast.success("Account verified 🎉");
        navigate("/login");
      }else if(type=="forgot"){
        toast.success("OTP verified!");
        navigate(`/reset-password?email=${email}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Verification failed ❌");
    }
  }

  async function handleResendOtp(e: React.FormEvent){
    e.preventDefault();
    try {
      const response = await resendOtp(email,type);
      if(response){
        toast.success("OTP resended!");
      }
    } catch (err:any) {
      toast.error(err?.message || "OTP resend failed ❌");
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

      {/* Verify OTP Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-xl w-full max-w-md mt-24">

        {type==="signup" ?(
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Verify Your Account
          </h2>
        ):(
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Reset Your Password
          </h2>
        )}
        
        <p className="text-center text-gray-200 mb-8">
          Enter the OTP sent to <span className="text-yellow-300">{email}</span>
        </p>

        {/* OTP Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {inputRefs.current[index] = el}}
                className="w-12 h-12 text-center text-xl rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          <Button
            type="submit"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
          >
            Verify OTP
          </Button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Didn’t receive an OTP?{" "}
          <button onClick={handleResendOtp} className="text-yellow-400 hover:underline">
            Resend
          </button>
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
