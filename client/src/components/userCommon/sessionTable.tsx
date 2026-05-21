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

const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  refreshSessions,
  role,
}) => {
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
            s.tutorId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            s.status.toLowerCase().includes(searchText.toLowerCase()))
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
  }, [sessions, filterStatus, searchText, sortOrder]);

  const handleCancelSession = async (id: string) => {

  try {

    const res =
      await cancelSession(id);

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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* 🔹 Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder={`Search by ${
            role === "tutor" ? "student" : "tutor"
          } or status...`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-slate-400 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-400 bg-white text-sm rounded-lg px-3 py-2"
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
          className="border border-slate-400 bg-white text-sm rounded-lg px-3 py-2"
        >
          <option value="asc">Earliest</option>
          <option value="desc">Latest</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">
                {role === "tutor" ? "Student" : "Tutor"}
              </th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((s) => (
                <tr
                  key={s._id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3">
                    {role === "tutor"
                      ? s.userId?.name
                      : s.tutorId?.name}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {s.startTime} - {s.endTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        s.status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : s.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    {(s.status === "Confirmed" ||
  s.status === "Upcoming") && (
  <>
    {role === "tutor" && (
      <Button size="sm">
        Start
      </Button>
    )}

    {role === "client" && (
      <Button
        size="sm"
        variant="outline"
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
                  className="text-center py-10 text-slate-400"
                >
                  No sessions available yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <h3 className="font-semibold mb-3">
                Cancel session?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone.
              </p>
              <p className="text-sm text-red-500 mb-6">
                Sorry, Refund will not process for this action.
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmModal(false)}
                >
                  No
                </Button>
                <Button
                  onClick={() => {
                    if (selectedSessionId)
                      handleCancelSession(selectedSessionId);
                    setConfirmModal(false);
                  }}
                >
                  Yes, Cancel
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