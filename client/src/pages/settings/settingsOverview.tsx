import React from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ChevronRight, KeyRound, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, value, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-5">
    <div className="flex items-center gap-4 min-w-0">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#F3F4F8]">{label}</p>
        <p style={mono} className="text-xs text-[#9CA1B5] truncate mt-0.5">
          {value}
        </p>
      </div>
    </div>
    <button
      type="button"
      onClick={onChange}
      className="inline-flex items-center gap-1 shrink-0 rounded-full border border-[#2A2E3D] bg-transparent px-4 py-2 text-sm text-[#F3F4F8] transition hover:bg-[#1E2230] hover:border-[#7C9CFF]"
    >
      Change
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

interface SettingsOverviewProps {
  // Optional overrides in case you'd rather handle navigation yourself
  // (opening a drawer, a different route, etc.) instead of the react-router
  // defaults below.
  onChangeEmail?: () => void;
  onChangePassword?: () => void;
}

const SettingsOverview: React.FC<SettingsOverviewProps> = ({
  onChangeEmail,
  onChangePassword,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const goToEmail = onChangeEmail ?? (() => navigate("/settings/email"));
  const goToPassword = onChangePassword ?? (() => navigate("/settings/password"));

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
          {/* Header */}
          <div className="mb-8">
            <span
              style={mono}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Settings
            </span>
            <h1 style={fraunces} className="mt-4 text-3xl font-bold tracking-tight">
              Account settings
            </h1>
            <p className="mt-2 text-[#9CA1B5] max-w-md">
              Manage your security preferences and keep your account protected.
            </p>
          </div>

          {/* Settings list */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] px-8 py-3 shadow-xl divide-y divide-[#2A2E3D]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            <SettingsRow
              icon={<Mail className="w-5 h-5 text-[#0E1016]" />}
              label="Email address"
              value={user?.email || "No email on file"}
              onChange={goToEmail}
            />
            <SettingsRow
              icon={<KeyRound className="w-5 h-5 text-[#0E1016]" />}
              label="Password"
              value="••••••••"
              onChange={goToPassword}
            />
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default SettingsOverview;