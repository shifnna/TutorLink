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


declare global {
  interface ImportMetaEnv {
    readonly VITE_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const AdminLogin: React.FC =
  () => {

  const navigate =
    useNavigate();

  const { login } =
    useAuthStore();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  /* ================= VALIDATION ================= */

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

  /* ================= HANDLE CHANGE ================= */

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

  /* ================= LOGIN ================= */

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

  return (
    <AuthLayout
      title="Admin Portal"
      subtitle="Secure admin access only"
    >

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
          className="rounded-xl px-6 py-4 text-gray-600 focus:ring-2 focus:ring-red-500"
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
          className="rounded-xl px-6 py-4 text-gray-600 focus:ring-2 focus:ring-red-500"
        />

        {/* BUTTON */}
        <Button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-red-600 to-black text-white py-4 font-bold hover:scale-[1.02] transition"
        >
          Admin Login
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;