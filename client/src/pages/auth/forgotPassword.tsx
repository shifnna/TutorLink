import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { isValidEmail } from "../../utils/validators";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "./authLayout";

const inputClass =
  "rounded-xl px-5 py-3.5 bg-[#0E1016] border border-[#2A2E3D] text-[#F3F4F8] placeholder:text-[#6B7185] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition";

const buttonClass =
  "rounded-xl bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] py-3.5 font-semibold hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7C9CFF]/20 transition";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuthStore();
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      const type = "forgot";
      await requestPasswordReset(email, type);
      toast.success("OTP sent to your email 📩");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=forgot`);
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

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your registered email and we'll send you an OTP to reset it."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className={buttonClass}>
          Send OTP
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#9CA1B5]">
        Remembered your password?{" "}
        <Link to="/login" className="font-medium text-[#7C9CFF] transition hover:text-[#C08BFA]">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;