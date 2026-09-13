import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { isValidEmail } from "../../utils/validators";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigateBasedOnRole = useCallback(() => {
    const role = useAuthStore.getState().user?.role;
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "tutor") {
      navigate("/");
    } else {
      navigate("/explore-tutors");
    }
  }, [navigate]);

  function validate(): boolean {
    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error("Invalid email");
      return false;
    }
    if (!formData.password) {
      toast.error("Password required");
      return false;
    }
    return true;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await login(formData.email, formData.password);

      await useAuthStore.getState().fetchUser();

      if (!response.success) {
        if (response.errors) {
          response.errors.forEach((err) => toast.error(`${err.field}: ${err.message}`));
        } else {
          toast.error(response.message);
        }
        return;
      }

      toast.success("Login successful 🎉");
      navigateBasedOnRole();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("googleSuccess")) {
      useAuthStore
        .getState()
        .fetchUser()
        .then(() => {
          toast.success("Logged in with Google! 🎉");
          navigateBasedOnRole();
        })
        .catch((err) => {
          console.error("Google login fetch error:", err);
          toast.error("Google login failed. Please try again.");
        })
        .finally(() => {
          useAuthStore.setState({ isLoading: false });
        });
    } else {
      useAuthStore.setState({ isLoading: false });
    }
  }, [navigateBasedOnRole]);

  function handleGoogle() {
    useAuthStore.setState({ isLoading: true, user: null, isAuthenticated: false });
    window.location.href = import.meta.env.VITE_BASE_URL + "/api/auth/google";
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your learning journey">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className={inputClass}
          onChange={handleChange}
          value={formData.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className={inputClass}
          onChange={handleChange}
          value={formData.password}
        />

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-[#9CA1B5] transition hover:text-[#7C9CFF]">
            Forgot password?
          </Link>
          <Link to="/signup" className="font-medium text-[#7C9CFF] transition hover:text-[#C08BFA]">
            Create account
          </Link>
        </div>

        <Button type="submit" className={buttonClass}>
          Log in
        </Button>
      </form>

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

export default Login;