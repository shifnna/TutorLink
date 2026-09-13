import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { isValidEmail, isValidName, isStrongPassword } from "../../utils/validators";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./authLayout";
import { FcGoogle } from "react-icons/fc";

declare global {
  interface ImportMetaEnv {
    readonly VITE_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const mono = { fontFamily: "'Space Mono', monospace" };

const inputClass =
  "rounded-xl px-5 py-3.5 bg-[#0E1016] border border-[#2A2E3D] text-[#F3F4F8] placeholder:text-[#6B7185] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition";

const buttonClass =
  "rounded-xl bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] py-3.5 font-semibold hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7C9CFF]/20 transition";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function validate(): boolean {
    if (!formData.name || !isValidName(formData.name)) {
      toast.error("Please enter a valid name (letters only).");
      return false;
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error("Enter a valid email.");
      return false;
    }
    if (!formData.password || !isStrongPassword(formData.password)) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      if (!response.success) {
        if (response.errors) {
          response.errors.forEach((err) => toast.error(`${err.field}: ${err.message}`));
        } else {
          toast.error(response.message);
        }
        return;
      }

      toast.success("OTP sent to your email 📩");
      navigate(`/verify-otp?email=${response.data?.email}&type=signup`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleSuccess = params.get("googleSuccess");

    if (googleSuccess && window.location.pathname === "/signup") {
      toast.success("Logged in with Google! 🎉");
      navigate("/");
    }
  }, [navigate]);

  function handleGoogle() {
    window.location.href = import.meta.env.VITE_BASE_URL + "/api/auth/google";
  }

  return (
    <AuthLayout title="Create your account" subtitle="Sign up to start your learning journey">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          name="name"
          type="text"
          placeholder="Full name"
          className={inputClass}
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className={inputClass}
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className={inputClass}
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          className={inputClass}
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button type="submit" className={buttonClass}>
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#9CA1B5]">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[#7C9CFF] transition hover:text-[#C08BFA]">
          Log in
        </Link>
      </p>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-grow bg-[#2A2E3D]" />
        <span style={mono} className="text-[11px] tracking-wider text-[#6B7185]">
          OR
        </span>
        <span className="h-px flex-grow bg-[#2A2E3D]" />
      </div>

      <Button
        onClick={handleGoogle}
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#2A2E3D] bg-white px-4 py-3 text-gray-900 transition hover:bg-gray-100"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </Button>
    </AuthLayout>
  );
};

export default Signup;