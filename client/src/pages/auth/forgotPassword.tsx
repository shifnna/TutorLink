import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { isValidEmail } from "../../utils/validators";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "./authLayout";

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
      //// Narrow the error type safely
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
    <>
      <AuthLayout title="Forgot Password?" subtitle="Enter your registered email. We’ll send you an OTP to reset it." >

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
            >
              Send OTP
            </Button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Remembered your password?{" "}
            <a href="/login" className="text-yellow-400 hover:underline">
              Log In
            </a>
          </p>
          
      <Toaster position="top-center" reverseOrder={false} />
    </AuthLayout>
    </>
  );
};

export default ForgotPassword;
