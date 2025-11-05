import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { isValidEmail, isValidName, isStrongPassword } from "../../utils/validators";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./authLayout";
import { FcGoogle } from "react-icons/fc";

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
          response.errors.forEach(err => toast.error(`${err.field}: ${err.message}`));
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
      useAuthStore.setState({isLoading:false})
    }
  }

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const googleSuccess = params.get("googleSuccess");
  
  if (googleSuccess && window.location.pathname === "/signup") {
    toast.success("Logged in with Google! 🎉");
    navigate('/');
  }
}, []);

function handleGoogle(){
  window.location.href = "http://localhost:5000/api/auth/google";
}

  return (
    <>
      <AuthLayout title="Create Your Account" subtitle="Sign up to start your learning journey" >

          {/* Signup Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input name="name" type="text" placeholder="Full Name" className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.name} onChange={handleChange}
            />
            <Input name="email" type="email" placeholder="Email" className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.email} onChange={handleChange}
            />
            <Input name="password" type="password" placeholder="Password" className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.password} onChange={handleChange}
            />
            <Input name="confirmPassword" type="password" placeholder="Confirm Password" className="rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.confirmPassword} onChange={handleChange}
            />

            <Button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 font-bold hover:scale-105 hover:shadow-lg transition" >
              Sign Up
            </Button>
          </form>

          {/* Links */}
          <p className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-400 hover:underline">
              Log In
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-grow h-px bg-gray-600"></span>
            <span className="text-sm text-gray-400">or</span>
            <span className="flex-grow h-px bg-gray-600"></span>
          </div>
          
          {/* Google Login */}
          <Button
          onClick={()=>handleGoogle()}
            type="button"
            className="w-full rounded-xl bg-white text-black px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </Button>

      <Toaster position="top-center" reverseOrder={false} />
    </AuthLayout>
    </>
  );
};
export default Signup;
