import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video } from "lucide-react";
import { Button } from "../../components/ui/button";
import type { ISession } from "../../components/userCommon/sessionTable";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const statusStyles: Record<string, string> = {
  Confirmed: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  Upcoming: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  Cancelled: "bg-rose-500/15 text-rose-300 border-rose-400/20",
};

const paymentStatusStyles: Record<string, string> = {
  HOLD: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  PAID: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  REFUNDED: "bg-sky-500/15 text-sky-300 border-sky-400/20",
  FAILED: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  CANCELLED: "bg-rose-500/15 text-rose-300 border-rose-400/20",
};

interface SessionFeedback {
  message: string;
  rating: number;
  unsatisfied: boolean;
}

interface SessionDetailsModalProps {
  session: ISession | null;
  onClose: () => void;
}

function parseTimeToMinutes(time: string) {
  const [clock, modifier] = time.trim().split(" ");
  const [rawHours, rawMinutes] = clock.split(":").map(Number);
  let hours = rawHours;
  if (modifier?.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + (rawMinutes || 0);
}

function convertTo24Hour(time: string) {
  const [clock, modifier] = time.trim().split(" ");
  const [rawHours, minutes] = clock.split(":").map(Number);
  let hours = rawHours;
  if (modifier?.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${(minutes || 0)
    .toString()
    .padStart(2, "0")}:00`;
}

function getSessionStart(dateStr: string, startTime: string) {
  return new Date(`${dateStr.split("T")[0]}T${convertTo24Hour(startTime)}`);
}

function getDurationLabel(startTime: string, endTime: string) {
  const start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);
  if (end <= start) end += 24 * 60;

  const totalMinutes = end - start;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
}

function getRelativeLabel(dateStr: string, startTime: string) {
  const sessionStart = getSessionStart(dateStr, startTime);
  const diffMs = sessionStart.getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (Math.abs(diffHours) < 1) {
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    if (diffMinutes === 0) return "Right now";
    return diffMinutes > 0
      ? `In ${diffMinutes} min`
      : `${Math.abs(diffMinutes)} min ago`;
  }

  if (Math.abs(diffHours) < 24) {
    const roundedHours = Math.round(diffHours);
    return roundedHours > 0
      ? `In ${roundedHours} hr${roundedHours > 1 ? "s" : ""}`
      : `${Math.abs(roundedHours)} hr${Math.abs(roundedHours) > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return diffDays > 0 ? `In ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  onClose,
}) => {
  const showJoin = !!session?.videoRoomUrl;
  const status = session?.status;
  const feedback = session?.feedback as SessionFeedback | undefined;
  const hasFeedback = !!feedback && (feedback.message || feedback.rating);

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          className="fixed inset-0 bg-[#0E1016]/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative overflow-hidden bg-[#171A24] border border-[#2A2E3D] p-6 rounded-2xl shadow-xl w-full max-w-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-[#9CA1B5] hover:text-[#F3F4F8] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3
              style={{ ...fraunces, fontWeight: 550 }}
              className="text-xl pr-8"
            >
              Session details
            </h3>
            <p style={mono} className="text-xs text-[#9CA1B5] mt-1 mb-6">
              #{session._id}
            </p>

            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span
                  style={mono}
                  className="text-xs uppercase tracking-wide text-[#9CA1B5]"
                >
                  Status
                </span>
                <span
                  style={mono}
                  className={`text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                    statusStyles[session.status] ??
                    "bg-[#1E2230] text-[#9CA1B5] border-[#2A2E3D]"
                  }`}
                >
                  {session.status}
                </span>
              </div>

              <div>
                <p
                  style={mono}
                  className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                >
                  Date
                </p>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-[#F3F4F8]">
                    {new Date(session.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p style={mono} className="text-xs text-[#7C9CFF] shrink-0">
                    {getRelativeLabel(session.date, session.startTime)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    style={mono}
                    className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                  >
                    Time
                  </p>
                  <p style={mono} className="text-sm text-[#F3F4F8]">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>
                <div>
                  <p
                    style={mono}
                    className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                  >
                    Duration
                  </p>
                  <p style={mono} className="text-sm text-[#F3F4F8]">
                    {getDurationLabel(session.startTime, session.endTime)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    style={mono}
                    className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                  >
                    Amount
                  </p>
                  <p style={mono} className="text-sm text-[#F3F4F8]">
                    ${session.amount}
                  </p>
                </div>
                <div>
                  <p
                    style={mono}
                    className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                  >
                    Payment
                  </p>
                  <span
                    style={mono}
                    className={`inline-block text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                      paymentStatusStyles[session.paymentStatus] ??
                      "bg-[#1E2230] text-[#9CA1B5] border-[#2A2E3D]"
                    }`}
                  >
                    {session.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="h-px bg-[#2A2E3D]" />

              {/* Tutor + Client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    style={mono}
                    className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                  >
                    Tutor
                  </p>
                  <p className="text-sm text-[#F3F4F8]">
                    {session.tutorId?.name || "—"}
                  </p>
                  <p className="text-xs text-[#9CA1B5] break-all">
                    {session.tutorId?.email}
                  </p>
                </div>
                <div>
                  <p
                    style={mono}
                    className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"
                  >
                    Client
                  </p>
                  <p className="text-sm text-[#F3F4F8]">
                    {session.userId?.name || "—"}
                  </p>
                  <p className="text-xs text-[#9CA1B5] break-all">
                    {session.userId?.email}
                  </p>
                </div>
              </div>

              {/* Review — only shown once feedback has actually been left */}
              {hasFeedback && (
                <>
                  <div className="h-px bg-[#2A2E3D]" />
                  <div
                    className={`rounded-xl border p-4 ${
                      feedback?.unsatisfied
                        ? "bg-rose-500/10 border-rose-400/25"
                        : "bg-[#1E2230] border-[#2A2E3D]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        style={mono}
                        className="text-xs uppercase tracking-wide text-[#9CA1B5]"
                      >
                        Review of the student
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className={`text-sm leading-none ${
                                i <= (feedback?.rating ?? 0)
                                  ? "text-amber-400"
                                  : "text-[#2A2E3D]"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {feedback?.unsatisfied && (
                          <span
                            style={mono}
                            className="text-[10px] uppercase tracking-wide text-rose-300 bg-rose-500/15 border border-rose-400/25 px-2 py-0.5 rounded-full"
                          >
                            Unsatisfied
                          </span>
                        )}
                      </div>
                    </div>
                    {feedback?.message && (
                      <p className="text-sm text-[#F3F4F8] leading-relaxed italic">
                        "{feedback.message}"
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Booked on */}
              {session.createdAt && (
                <>
                  <div className="h-px bg-[#2A2E3D]" />
                  <div className="flex items-center justify-between">
                    <span
                      style={mono}
                      className="text-xs uppercase tracking-wide text-[#9CA1B5]"
                    >
                      Booked on
                    </span>
                    <span style={mono} className="text-xs text-[#9CA1B5]">
                      {new Date(session.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div
              className={`mt-6 flex items-center ${
                showJoin ? "justify-between" : "justify-end"
              }`}
            >
              {showJoin && status == "Upcoming" && (
                <a
                  href={session.videoRoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] text-sm font-semibold rounded-full px-4 py-2 hover:scale-105 transition"
                >
                  <Video className="w-4 h-4" />
                  Join video session
                </a>
              )}
              <Button
                variant="outline"
                className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionDetailsModal;