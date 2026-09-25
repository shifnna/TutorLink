import React, { useCallback, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ForgotPasswordModal } from "./resetModal";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "#2A2E3D" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const clamped = Math.min(score, 3);
  const labels = ["Weak", "Weak", "Fair", "Strong"];
  const colors = ["#F43F5E", "#F43F5E", "#F59E0B", "#22C55E"];
  return { score: clamped, label: labels[clamped], color: colors[clamped] };
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}) => (
  <div>
    <label style={mono} className="block text-xs uppercase tracking-wide text-[#9CA1B5] mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#2A2E3D] bg-[#0E1016] px-4 py-3 pr-11 text-sm text-[#F3F4F8] placeholder:text-[#9CA1B5]/50 outline-none transition focus:border-[#7C9CFF] focus:ring-1 focus:ring-[#7C9CFF]"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA1B5] hover:text-[#F3F4F8] transition"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);


const Settings: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const meetsMinLength = newPassword.length >= 6;
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === newPassword;

  const closeForgotPassword = useCallback(() => setForgotOpen(false), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from the current password.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPassword) {
      throw new Error("Password reset isn't wired up yet — contact support.");
    }
    await forgotPassword(user?.email ?? "");
  };

  return (
    <div className="relative flex min-h-screen bg-[#0E1016] text-[#F3F4F8]">
      {/* Ambient background, same treatment as the homepage */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)", animationDelay: "-4s" }}
        />
        <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
      </div>

      <Toaster position="top-center" toastOptions={toastDarkOptions} />

      <main className="relative flex-1 px-6 sm:px-10 py-10 overflow-y-auto">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-[#9CA1B5] hover:text-[#F3F4F8] transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to settings
          </button>

          {/* Header */}
          <div className="mb-8">
            <span
              style={mono}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Security
            </span>
            <h1 style={fraunces} className="mt-4 text-3xl font-bold tracking-tight">
              Change password
            </h1>
            <p className="mt-2 text-[#9CA1B5] max-w-md">
              Keep your account safe with a password you don't use anywhere else.
            </p>
          </div>

          {/* Change password card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-8 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-[#0E1016]" />
              </div>
              <div>
                <h2 style={fraunces} className="text-xl font-semibold">
                  Update password
                </h2>
                <p className="text-sm text-[#9CA1B5]">
                  You'll need your current password to confirm this change.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 border-t border-[#2A2E3D] pt-6">
              <div>
                <PasswordField
                  label="Current password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showCurrent}
                  onToggle={() => setShowCurrent((v) => !v)}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="mt-2 text-xs font-medium text-[#7C9CFF] hover:text-[#A78CF5] transition"
                >
                  Forgot your current password?
                </button>
              </div>

              <div>
                <PasswordField
                  label="New password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  placeholder="At least 6 characters"
                />

                {newPassword && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-colors duration-300"
                          style={{ backgroundColor: i < strength.score ? strength.color : "#2A2E3D" }}
                        />
                      ))}
                    </div>
                    <span
                      style={{ ...mono, color: strength.color }}
                      className="text-[11px] uppercase tracking-wide shrink-0"
                    >
                      {strength.label}
                    </span>
                  </div>
                )}

                <p
                  className={`mt-2.5 flex items-center gap-1.5 text-xs ${
                    meetsMinLength ? "text-emerald-300" : "text-[#9CA1B5]"
                  }`}
                >
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      meetsMinLength ? "border-emerald-300 bg-emerald-300/20" : "border-[#9CA1B5]/40"
                    }`}
                  >
                    {meetsMinLength && <Check className="h-2.5 w-2.5" />}
                  </span>
                  At least 6 characters
                </p>
              </div>

              <div>
                <PasswordField
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  placeholder="Re-enter your new password"
                />

                {confirmPassword && (
                  <p
                    className={`mt-2.5 flex items-center gap-1.5 text-xs ${
                      passwordsMatch ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                        passwordsMatch
                          ? "border-emerald-300 bg-emerald-300/20"
                          : "border-rose-300 bg-rose-300/10"
                      }`}
                    >
                      {passwordsMatch ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                    </span>
                    {passwordsMatch ? "Passwords match" : "Passwords don't match yet"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] px-6 py-2.5 text-sm font-medium text-[#0E1016] transition hover:opacity-90 hover:shadow-lg hover:shadow-[#7C9CFF]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Update password
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.section>
      </main>

      <ForgotPasswordModal
        open={forgotOpen}
        email={user?.email}
        onClose={closeForgotPassword}
        onSend={handleForgotPassword}
      />
    </div>
  );
};

export default Settings;