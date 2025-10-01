import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap } from "react-icons/fa";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer,setTimer] = useState<number>(60);


  const { verifyOtp, resendOtp } = useAuthStore();
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email") || "";
  const type = new URLSearchParams(search).get("type") || "";


  function handleChange(value: string, index: number) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
      if (type === "signup") {
        toast.success("Account verified 🎉");
        navigate("/login");
      } else if (type === "forgot") {
        toast.success("OTP verified!");
        navigate(`/reset-password?email=${email}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Verification failed ❌");
    }
  }


  async function handleResendOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resendOtp(email, type);
      toast.success("OTP resent! 📩");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "OTP resend failed ❌");
    }
  }


  useEffect(()=>{
    if(timer>0){
      const countDown = setTimeout(()=>setTimer((prev)=>prev-1),1000)
      return ()=> clearTimeout(countDown);
    }
  },[timer]);

  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-black text-white">
      {/* Right side OTP form */}
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
          <h2 className="text-2xl font-bold text-center mb-4">
            {type === "signup" ? "Verify Your Account" : "Reset Your Password"}
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Enter the OTP sent to <span className="text-yellow-300">{email}</span>
          </p>

          {/* OTP Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
            >
              Verify OTP
            </Button>
          </form>

          {/* Resend OTP */}
          <p className="text-center text-gray-200 mt-6">
            {timer>0? (
            <span className="text-gray-400">
              Resend in 00:{timer.toString().padStart(2, "0")}
            </span>
            ):(
            <>
            Didn’t receive an OTP?{" "}
            <button onClick={handleResendOtp} className="text-yellow-400 hover:underline">
              Resend
            </button>
            </>
            )}
          </p>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default VerifyOtp;
