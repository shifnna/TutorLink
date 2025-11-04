import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cancelSession } from "../../services/sessionService";

export interface ISession {
  _id: string;
  tutorId: { _id: string; name: string; email: string };
  userId: { _id: string; name: string; email: string };
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface SessionTableProps {
  sessions: ISession[];
  refreshSessions: () => void;
  role: "tutor" | "client";
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions, refreshSessions, role }) => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  function convertTo24Hour(time12h: string) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
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
          (s.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            s.status.toLowerCase().includes(searchText.toLowerCase()))
      )
      .sort((a, b) => {
        const dateTimeA = new Date(
          `${a.date.split("T")[0]}T${convertTo24Hour(a.startTime)}`
        ).getTime();
        const dateTimeB = new Date(
          `${b.date.split("T")[0]}T${convertTo24Hour(b.startTime)}`
        ).getTime();
        return sortOrder === "asc" ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
      });
  }, [sessions, filterStatus, searchText, sortOrder]);

  const handleCancelSession = async (id: string) => {
    try {
      await cancelSession(id);
      toast.success("Session cancelled successfully!");
      refreshSessions();
    } catch {
      toast.error("Failed to cancel session.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔹 Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          className="flex-1 max-w-2xl px-6 py-3 rounded-xl border border-purple-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
          placeholder={`Search by ${role === "tutor" ? "student" : "tutor"} or status...`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-pink-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black/40 border border-purple-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="All">All Sessions</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="bg-black/40 border border-purple-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="asc">Earliest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-hidden rounded-2xl border border-purple-800/40 bg-gradient-to-b from-black/30 via-purple-950/30 to-black/40 backdrop-blur-md shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-900/40 text-gray-300">
            <tr>
              <th className="py-3 px-4">{role === "tutor" ? "Student" : "Tutor"}</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr
                  key={session._id}
                  className="border-b border-gray-800 hover:bg-purple-900/20 transition"
                >
                  <td className="py-3 px-4">
                    {role === "tutor"
                      ? session.userId?.name
                      : session.tutorId?.name}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(session.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {session.startTime} - {session.endTime}
                  </td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      session.status === "Upcoming"
                        ? "text-yellow-400"
                        : session.status === "Completed"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {session.status}
                  </td>
                  <td className="py-3 px-4 text-right flex gap-2 justify-end">
                    {session.status === "Upcoming" && (
                      <>
                        {role==="tutor" && (<Button className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white px-3 py-1 rounded-full text-sm hover:scale-105">
                          Start
                        </Button>)}
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedSessionId(session._id);
                            setConfirmModal(true);
                          }}
                          className="border-pink-400 text-pink-400 px-3 py-1 rounded-full text-sm hover:bg-pink-900/40"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {session.status === "Cancelled" && (
                      <span className="text-gray-400 text-xs italic pr-3">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400 italic">
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border border-gray-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Cancellation
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this session?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    if (selectedSessionId) handleCancelSession(selectedSessionId);
                    setConfirmModal(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Yes, Cancel
                </Button>
                <Button
                  onClick={() => setConfirmModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  No
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default SessionTable;
