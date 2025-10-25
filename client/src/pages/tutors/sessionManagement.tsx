import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import TutorSidebar from "../../components/tutorCommon/sidebar";

const SessionManagement: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const slotRules = [
    "Slots cannot overlap.",
    "Each slot must be within working hours.",
    "Slot duration must be between 15 and 120 minutes.",
  ];

  const sessions = [
    {
      id: 1,
      student: "Aisha",
      subject: "Mathematics",
      date: "2025-10-25",
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      student: "Ravi",
      subject: "Science",
      date: "2025-10-22",
      time: "3:00 PM",
      status: "Completed",
    },
  ];

  const filteredSessions = sessions.filter(
    (s) =>
      s.student.toLowerCase().includes(searchText.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      s.status.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#160733] to-[#1a002e] text-white">
      <TutorSidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Session Management
          </h1>

          {/* Search bar */}
          <div className="flex items-center gap-4 mb-8">
            <input
              type="text"
              className="flex-1 max-w-2xl px-6 py-3 rounded-xl border border-purple-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition-all duration-300"
              placeholder="Search by student, subject, or status..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-transform">
              <PlusCircle className="w-5 h-5 mr-2" /> Generate Slots
            </Button>
          </div>

          {/* Slot Rules */}
          <div className="mb-6 p-5 rounded-xl bg-white/10 border border-purple-900 text-sm text-gray-300 shadow-lg backdrop-blur-lg">
            <div className="font-semibold text-pink-400 mb-2">Slot Rules:</div>
            <ul className="list-disc pl-5 space-y-1">
              {slotRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Session Table */}
          <div className="overflow-hidden rounded-2xl border border-purple-800/40 bg-gradient-to-b from-black/30 via-purple-950/30 to-black/40 backdrop-blur-md shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-purple-900/40 text-gray-300">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-gray-800 hover:bg-purple-900/20 transition"
                  >
                    <td className="py-3 px-4">{session.student}</td>
                    <td className="py-3 px-4">{session.subject}</td>
                    <td className="py-3 px-4">{session.date}</td>
                    <td className="py-3 px-4">{session.time}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        session.status === "Upcoming"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {session.status}
                    </td>
                    <td className="py-3 px-4 text-right flex gap-2 justify-end">
                      {session.status === "Upcoming" && (
                        <>
                          <Button className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white px-3 py-1 rounded-full text-sm hover:scale-105">
                            Start
                          </Button>
                          <Button
                            variant="outline"
                            className="border-pink-400 text-pink-400 px-3 py-1 rounded-full text-sm hover:bg-pink-900/40"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {session.status === "Completed" && (
                        <Button
                          variant="outline"
                          className="border-gray-500 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-800"
                        >
                          View Summary
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default SessionManagement;
