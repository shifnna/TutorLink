import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import AuthLayout from "./authLayout";

const mono = { fontFamily: "'Space Mono', monospace" };

const buttonClass =
  "rounded-xl bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] py-3.5 font-semibold hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7C9CFF]/20 transition";

const otpInputClass =
  "w-12 h-12 text-center text-xl rounded-lg bg-[#0E1016] border border-[#2A2E3D] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState<number>(60);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message || "Something went wrong!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  }

  async function handleResendOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resendOtp(email, type);
      toast.success("OTP resent! 📩");
      setTimer(60);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message || "Something went wrong!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const countDown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countDown);
    }
  }, [timer]);

  return (
    <AuthLayout
      title={type === "signup" ? "Verify your account" : "Reset your password"}
      subtitle={`Enter the code sent to <span style="color:#7C9CFF;font-weight:600">${email}</span>`}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={otpInputClass}
            />
          ))}
        </div>

        <Button type="submit" className={buttonClass}>
          Verify code
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#9CA1B5]">
        {timer > 0 ? (
          <span>
            Resend in <span style={mono}>00:{timer.toString().padStart(2, "0")}</span>
          </span>
        ) : (
          <>
            Didn't receive a code?{" "}
            <button
              onClick={handleResendOtp}
              className="font-medium text-[#7C9CFF] transition hover:text-[#C08BFA]"
            >
              Resend
            </button>
          </>
        )}
      </p>
    </AuthLayout>
  );
};

export default VerifyOtp;