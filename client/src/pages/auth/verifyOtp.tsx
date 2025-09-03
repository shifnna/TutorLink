import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const { verifyOtp } = useAuthStore();
  const navigate = useNavigate();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get("email");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await verifyOtp(email!, otp);
      toast.success("Account verified 🎉");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.message || "Verification failed ❌");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button type="submit">Verify</button>
    </form>
  );
};
