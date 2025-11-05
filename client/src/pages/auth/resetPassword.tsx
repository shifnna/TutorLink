import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "./authLayout";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email") || "";

  const { resetPassword } = useAuthStore(); 
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(email, formData.password, formData.confirmPassword);
      toast.success("Password reset successfully");
      navigate("/login");
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
      <AuthLayout title="Reset Password" subtitle="Set a new password" >

          {/* Reset Password Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              type="password"
              name="password"
              placeholder="New Password"
              className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
            >
              Reset Password
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

export default ResetPassword;
