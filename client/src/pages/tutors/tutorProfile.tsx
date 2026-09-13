import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Mail,
  BadgeCheck,
  Clock,
  Sparkles,
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { tutorService } from "../../services/tutorService";
import { ITutor } from "../../types/ITutor";
import { IUser } from "../../types/IUser";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | null;

const statusStyles: Record<string, string> = {
  Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  Rejected: "border-rose-400/30 bg-rose-400/10 text-rose-400",
};

const TutorProfile: React.FC = () => {
  const { user } = useAuthStore();
  const u = user as IUser;
  console.log(user)

  const tutorProfileId: string | undefined =
    typeof u?.tutorProfile === "string" ? u.tutorProfile : u?.tutorProfile?._id;

  const applicationStatus: ApplicationStatus = u?.tutorApplication?.status ?? null;
  const adminMessage: string | undefined = u?.tutorApplication?.adminMessage;

  const [application, setApplication] = useState<ITutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tutorProfileId) {
      setLoading(false);
      return;
    }

    const fetchApplication = async () => {
      try {
        const res = await tutorService.getTutorById(tutorProfileId);
        console.log(res)

        if (res.success && res.data) {
          setApplication(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [tutorProfileId]);

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

  const name = application?.tutorId?.name || u?.name;

  // User.profileImage is the fallback — Tutor also has its own profileImage
  // from the application, which takes priority once loaded.
  const profileImage = application?.profileImage || u?.profileImage;

  const details: { label: string; value?: string; icon: typeof Mail | null }[] = [
    { label: "Full name", value: name, icon: null },
    { label: "Email address", value: u?.email, icon: Mail },
  ];

  const applicationDetails: { label: string; value?: string }[] = [
    { label: "Occupation", value: application?.occupation },
    { label: "Experience", value: application?.experienceLevel },
    { label: "Education", value: application?.education },
    { label: "Gender", value: application?.gender },
  ];

  const skills = application?.skills || [];
  const languages = application?.languages || [];

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
                Manage your tutor profile and how you appear to students on TutorLink.
              </p>
            </div>

            {/* <button className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] px-5 py-2.5 text-sm font-medium text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] transition">
              <Pencil className="w-4 h-4" />
              Edit profile
            </button> */}
          </div>

          {/* Application status banner — only when there's a non-approved
              application worth flagging (pending review, or rejected with
              admin feedback). Approved tutors just see the normal profile. */}
          {applicationStatus && applicationStatus !== "Approved" && (
            <div
              className={`flex items-start gap-3 rounded-2xl border px-5 py-4 mb-6 text-sm ${statusStyles[applicationStatus]}`}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">
                  Application {applicationStatus.toLowerCase()}
                </p>
                {adminMessage && (
                  <p className="mt-1 text-[#9CA1B5]">{adminMessage}</p>
                )}
              </div>
            </div>
          )}

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal + application details */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-8 shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

              <div className="flex items-center gap-4 mb-6">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#2A2E3D] shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                    <span style={fraunces} className="text-xl font-bold text-[#0E1016]">
                      {(name?.[0] || "T").toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <h2 style={fraunces} className="text-2xl font-semibold truncate">
                    {name || "Your name"}
                  </h2>
                  <span
                    style={mono}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,156,255,0.25)] bg-[rgba(124,156,255,0.1)] px-3 py-1 text-[11px] uppercase tracking-wide text-[#7C9CFF]"
                  >
                    Tutor
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
                  {application?.description || (
                    <span className="text-[#9CA1B5]/60 italic">
                      {loading
                        ? "Loading..."
                        : tutorProfileId
                        ? "Add a short bio so students know a bit about you."
                        : "No tutor application on file yet."}
                    </span>
                  )}
                </dd>
              </div>

              {/* Application details, from the tutor application */}
              {tutorProfileId && (
                <div className="border-t border-[#2A2E3D] mt-6 pt-6">
                  <dt
                    style={mono}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9CA1B5] mb-4"
                  >
                    Application details
                  </dt>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {applicationDetails.map((d) => (
                      <div key={d.label}>
                        <dt className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1">
                          {d.label}
                        </dt>
                        <dd className="text-base text-[#F3F4F8]">
                          {d.value || <span className="text-[#9CA1B5]/60 italic">Not added yet</span>}
                        </dd>
                      </div>
                    ))}
                  </div>

                  {!!skills.length && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2230] text-[#9CA1B5]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!!languages.length && (
                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <span
                            key={lang}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2230] text-[#9CA1B5]"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account status, echoes the "Your Tutor" card from the hero section */}
            <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#1E2230] p-6 shadow-xl h-fit">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5 text-[#0E1016]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F3F4F8]">Account status</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        applicationStatus === "Approved"
                          ? "bg-emerald-400"
                          : applicationStatus === "Rejected"
                          ? "bg-rose-400"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="text-[10px] text-[#9CA1B5]">
                      {applicationStatus || "Active now"}
                    </span>
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
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9CA1B5]">
                    <Sparkles className="w-4 h-4" />
                    Role
                  </span>
                  <span style={mono} className="text-[#F3F4F8]">Tutor</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9CA1B5]">
                    <Briefcase className="w-4 h-4" />
                    Occupation
                  </span>
                  <span style={mono} className="text-[#F3F4F8] text-right">
                    {application?.occupation || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9CA1B5]">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </span>
                  <span style={mono} className="text-[#F3F4F8] text-right">
                    {application?.education || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9CA1B5]">
                    <LanguagesIcon className="w-4 h-4" />
                    Languages
                  </span>
                  <span style={mono} className="text-[#F3F4F8] text-right">
                    {languages.length ? languages.length : "—"}
                  </span>
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

export default TutorProfile;