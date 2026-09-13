import React from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Phone, Clock } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

// Fields this page actually reads off the logged-in user.
// Ideally this should just be imported from wherever your real
// User/IUser type lives (e.g. authStore.ts or types/IUser.ts) —
// this local version is a stand-in until then.
interface ClientProfileUser {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
}

const ClientProfile: React.FC = () => {
  const { user } = useAuthStore();

  const u = user as ClientProfileUser | null;

  const memberSince = (() => {
    if (!u?.createdAt) return "—";
    try {
      return new Date(u.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  })();

  const details: { label: string; value?: string; icon: typeof Mail | null }[] = [
    { label: "Full name", value: u?.name, icon: null },
    { label: "Email address", value: u?.email, icon: Mail },
    { label: "Phone number", value: u?.phone, icon: Phone },
  ];

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
          className="max-w-5xl"
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <span
                style={mono}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
                Your account
              </span>
              <p className="mt-2 text-[#9CA1B5] max-w-md">
                Manage your personal details and how you appear to others on TutorLink.
              </p>
            </div>

            {/* <button className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] px-5 py-2.5 text-sm font-medium text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] transition">
              <Pencil className="w-4 h-4" />
              Edit profile
            </button> */}
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal details */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-8 shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                  <span style={fraunces} className="text-xl font-bold text-[#0E1016]">
                    {(u?.name?.[0] || "U").toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 style={fraunces} className="text-2xl font-semibold truncate">
                    {u?.name || "Your name"}
                  </h2>
                  <span
                    style={mono}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,156,255,0.25)] bg-[rgba(124,156,255,0.1)] px-3 py-1 text-[11px] uppercase tracking-wide text-[#7C9CFF]"
                  >
                    Learner
                  </span>
                </div>
              </div>

              <div className="border-t border-[#2A2E3D] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {details.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.label}>
                      <dt
                        style={mono}
                        className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {d.label}
                      </dt>
                      <dd className="text-base text-[#F3F4F8]">
                        {d.value || <span className="text-[#9CA1B5]/60 italic">Not added yet</span>}
                      </dd>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#2A2E3D] mt-6 pt-6">
                <dt style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1">
                  Bio
                </dt>
                <dd className="text-base text-[#F3F4F8]/90 leading-relaxed">
                  {u?.bio || (
                    <span className="text-[#9CA1B5]/60 italic">
                      Add a short bio so others know a bit about you.
                    </span>
                  )}
                </dd>
              </div>
            </div>

            {/* Account status, echoes the "Your Tutor" card from the hero section */}
            <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#1E2230] p-6 shadow-xl h-fit">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#0E1016]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F3F4F8]">Account status</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-[#9CA1B5]">Active now</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9CA1B5]">
                    <Clock className="w-4 h-4" />
                    Member since
                  </span>
                  <span style={mono} className="text-[#F3F4F8]">{memberSince}</span>
                </div>
              </div>

              <div className="flex gap-1 mt-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C9CFF]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A78CF5]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C08BFA]" />
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ClientProfile;