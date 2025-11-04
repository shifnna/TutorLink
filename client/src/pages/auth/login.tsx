import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { isValidEmail } from "../../utils/validators";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "./authLayout";
import { FcGoogle } from "react-icons/fc";
import axiosClient from "../../api/axiosClient";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigateBasedOnRole = () => {
    const role = useAuthStore.getState().user?.role;
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "tutor") {
      navigate("/");
    } else {
      navigate("/explore-tutors");
    }
  };

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

      if (!response.success) {
        if (response.errors) {
          response.errors.forEach(err => toast.error(`${err.field}: ${err.message}`));
        } else {
          toast.error(response.message);
        }
        return;
      }

      toast.success("Login successful 🎉");
      await useAuthStore.getState().fetchUser();
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
      useAuthStore.getState().fetchUser()
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
  }, []);


  function handleGoogle() {
    useAuthStore.setState({ isLoading: true, user: null, isAuthenticated: false });
    window.location.href = import.meta.env.VITE_BASE_URL + "/api/auth/google";
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue your learning journey">
      {/* Login Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
          value={formData.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-xl px-6 py-4 text-gray-800 focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
          value={formData.password}
        />

        <div className="flex justify-between items-center text-sm">
          <a href="/forgot-password" className="text-indigo-300 hover:underline">
            Forgot Password?
          </a>
          <a href="/signup" className="text-yellow-400 hover:underline">
            Create Account
          </a>
        </div>

        <Button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition"
        >
          Log In
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <span className="flex-grow h-px bg-gray-600"></span>
        <span className="text-sm text-gray-400">or</span>
        <span className="flex-grow h-px bg-gray-600"></span>
      </div>

      {/* Google Login */}
      <Button
        onClick={handleGoogle}
        type="button"
        className="w-full rounded-xl bg-white text-gray-900 px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
      >
        <FcGoogle className="w-6 h-6" />
        Continue with Google
      </Button>
    </AuthLayout>
  );
};

export default Login;