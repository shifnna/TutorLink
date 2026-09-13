import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Filter, Eye, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cancelSession } from "../../services/sessionService";
import SessionDetailsModal from "../../pages/common/sessionDetailsModal";
import { useAuthStore } from "../../store/authStore";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const mono = { fontFamily: "'Space Mono', monospace" };

export interface ISession {
  _id: string;
  tutorId: { _id: string; name: string; email: string };
  userId: { _id: string; name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  paymentStatus: string;
  videoRoomId?: string;
  videoRoomUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // Shapes not confirmed yet — kept loose so nothing breaks if/when you read from these.
  payment?: Record<string, unknown>;
  feedback?: Record<string, unknown>;
}

interface SessionTableProps {
  sessions: ISession[];
  refreshSessions: () => void;
  role: "tutor" | "client";
}

const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  refreshSessions,
  role,
}) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [detailsSession, setDetailsSession] = useState<ISession | null>(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchText(searchText);
  }, 300);

  return () => clearTimeout(timer);
}, [searchText]);

  function convertTo24Hour(time12h: string) {
    const [time, modifier] = time12h.split(" ");
    let [hours] = time.split(":").map(Number);
    const minutes = Number(time.split(":")[1]);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  }

  const filteredSessions = useMemo(() => {
    return sessions
      .filter(
        (s) =>
          (filterStatus === "All" || s.status === filterStatus) &&
          (s.userId?.name?.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            s.tutorId?.name?.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
            s.status.toLowerCase().includes(debouncedSearchText.toLowerCase()))
      )
      .sort((a, b) => {
        const dateTimeA = new Date(
          `${a.date.split("T")[0]}T${convertTo24Hour(a.startTime)}`
        ).getTime();
        const dateTimeB = new Date(
          `${b.date.split("T")[0]}T${convertTo24Hour(b.startTime)}`
        ).getTime();
        return sortOrder === "asc"
          ? dateTimeA - dateTimeB
          : dateTimeB - dateTimeA;
      });
  }, [sessions, filterStatus, debouncedSearchText, sortOrder]);

  const handleCancelSession = async (id: string) => {

  try {

    const res = await cancelSession(id);

    if (!res.success) {
      toast.error(
        "Failed to cancel"
      );

      return;
    }

    toast.success(
      "Session cancelled"
    );

    await refreshSessions();

  } catch {

    toast.error(
      "Failed to cancel"
    );
  }
};

  const statusStyles: Record<string, string> = {
    Upcoming: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    Cancelled: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  };
  const {user} = useAuthStore();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder={`Search by ${
            role === "tutor" ? "student" : "tutor"
          } or status...`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-[#2A2E3D] bg-[#1E2230] text-sm text-[#F3F4F8] placeholder-[#9CA1B5] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF]/40 transition"
        />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#9CA1B5]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[#2A2E3D] bg-[#1E2230] text-[#F3F4F8] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 [color-scheme:dark]"
          >
            <option value="All">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "asc" | "desc")
          }
          className="border border-[#2A2E3D] bg-[#1E2230] text-[#F3F4F8] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 [color-scheme:dark]"
        >
          <option value="asc">Earliest</option>
          <option value="desc">Latest</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#2A2E3D] bg-[#171A24]">
        <table className="w-full text-sm">
          <thead className="bg-[#1E2230] text-[#9CA1B5]">
            <tr>
              <th style={mono} className="px-4 py-3 text-left text-xs uppercase tracking-wide">
                {role === "tutor" ? "Student" : "Tutor"}
              </th>
              <th style={mono} className="px-4 py-3 text-left text-xs uppercase tracking-wide">Date</th>
              <th style={mono} className="px-4 py-3 text-left text-xs uppercase tracking-wide">Time</th>
              <th style={mono} className="px-4 py-3 text-left text-xs uppercase tracking-wide">Status</th>
              <th style={mono} className="px-4 py-3 text-right text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((s) => (
                <tr
                  key={s._id}
                  className="border-t border-[#2A2E3D] hover:bg-[#1E2230] transition"
                >
                  <td className="px-4 py-3 text-[#F3F4F8]">
                    {role === "tutor"
                      ? s.userId?.name
                      : s.tutorId?.name}
                  </td>
                  <td style={mono} className="px-4 py-3 text-[#9CA1B5]">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td style={mono} className="px-4 py-3 text-[#9CA1B5]">
                    {s.startTime} - {s.endTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={mono}
                      className={`text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                        statusStyles[s.status] ??
                        "bg-[#1E2230] text-[#9CA1B5] border-[#2A2E3D]"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="inline-flex items-center gap-1.5 border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
                      onClick={() => setDetailsSession(s)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Button>

                    {s.videoRoomUrl && s.status == "Upcoming" && (
  <a
    href={s.videoRoomUrl}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button
      size="sm"
        variant="outline"
        className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
    >
      <Video className="w-4 h-4" />
      Join Session
    </Button>
  </a>
)}

                    {(s.status === "Confirmed" ||
  s.status === "Upcoming") && (
  <>

    {s.tutorId._id !== user?._id && (
      <Button
        size="sm"
        variant="outline"
        className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
        onClick={() => {
          setSelectedSessionId(s._id);
          setConfirmModal(true);
        }}
      >
        Cancel
      </Button>
    )}
  </>
)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-[#9CA1B5]/70 italic"
                >
                  No sessions available yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            className="fixed inset-0 bg-[#0E1016]/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative overflow-hidden bg-[#171A24] border border-[#2A2E3D] p-6 rounded-2xl shadow-xl w-full max-w-sm text-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

              <h3 className="font-semibold text-[#F3F4F8] text-lg mb-3">
                Cancel session?
              </h3>
              <p className="text-sm text-[#9CA1B5] mb-6">
                This action cannot be undone.
              </p>
              <p className="text-sm text-rose-400 mb-6">
                Sorry, Refund will not process for this action.
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
                  onClick={() => setConfirmModal(false)}
                >
                  No
                </Button>
                <Button
                  className="bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-full hover:scale-105 transition"
                  onClick={() => {
                    if (selectedSessionId) {
                      handleCancelSession(selectedSessionId);
                    }
                    setConfirmModal(false);
                    setSelectedSessionId(null);
                  }}
                >
                  Yes, Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session details modal — shared component, reused by tutor & client sides */}
      <SessionDetailsModal
        session={detailsSession}
        onClose={() => setDetailsSession(null)}
      />
    </motion.section>
  );
};

export default SessionTable;