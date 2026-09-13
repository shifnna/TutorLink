import React, {
  useEffect,
  useState,
} from "react";

import {
  Button,
} from "../../components/ui/button";

import {
  Input,
} from "../../components/ui/input";

import {
  isValidEmail,
} from "../../utils/validators";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuthStore,
} from "../../store/authStore";
import AuthLayout from "../auth/authLayout";
import { ShieldCheck } from "lucide-react";


declare global {
  interface ImportMetaEnv {
    readonly VITE_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Midnight theme type treatment — matches Home / ExploreTutors
const mono = { fontFamily: "'Space Mono', monospace" };

const AdminLogin: React.FC =
  () => {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  const validate =
    (): boolean => {

      if (
        !formData.email ||
        !isValidEmail(
          formData.email
        )
      ) {

        toast.error(
          "Invalid email"
        );

        return false;
      }

      if (
        !formData.password
      ) {

        toast.error(
          "Password required"
        );

        return false;
      }

      return true;
    };


  const handleChange =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ): void => {

      const {
        name,
        value,
      } = e.target;

      setFormData({
        ...formData,
        [name]: value,
      });
    };


  const handleSubmit = async (
  e: React.FormEvent
): Promise<void> => {

  e.preventDefault();

  if (!validate()) return;

  try {

    const response = await useAuthStore
      .getState()
      .adminLogin(
        formData.email,
        formData.password
      );

    if (!response.success) {

      toast.error(
        response.message || "Login failed"
      );

      return;
    }

    toast.success(
      "Admin login successful"
    );

    navigate("/admin-dashboard");

  } catch (error) {

    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );

  } finally {

    useAuthStore.setState({
      isLoading: false,
    });
  }
};


  useEffect(() => {

    useAuthStore.setState({
      isLoading: false,
    });

  }, []);

  // Load the display + mono typefaces used by the midnight theme
  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <AuthLayout
      title="Admin Portal"
      subtitle="Secure admin access only"
    >

      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-6"
        style={mono}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#7C9CFF]" />
        Restricted · Admins only
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="flex flex-col gap-5"
      >

        <Input
          name="email"
          type="email"
          placeholder="Admin Email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          className="rounded-xl px-6 py-4 bg-[#171A24] border border-[#2A2E3D] text-[#F3F4F8] placeholder:text-[#6B7185] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition"
        />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={
            formData.password
          }
          onChange={
            handleChange
          }
          className="rounded-xl px-6 py-4 bg-[#171A24] border border-[#2A2E3D] text-[#F3F4F8] placeholder:text-[#6B7185] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition"
        />

        <Button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] py-4 font-bold hover:scale-[1.02] transition"
        >
          Admin Login
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;