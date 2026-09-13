import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "./authLayout";

const inputClass =
  "rounded-xl px-5 py-3.5 bg-[#0E1016] border border-[#2A2E3D] text-[#F3F4F8] placeholder:text-[#6B7185] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition";

const buttonClass =
  "rounded-xl bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] py-3.5 font-semibold hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7C9CFF]/20 transition";

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
    <AuthLayout title="Reset password" subtitle="Set a new password for your account">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          className={inputClass}
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className={inputClass}
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button type="submit" className={buttonClass}>
          Reset password
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

export default ResetPassword;