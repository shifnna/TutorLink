import React, { useEffect, useState } from "react";
import SessionTable, { ISession } from "../../components/userCommon/sessionTable";
import { useAuthStore } from "../../store/authStore";
import UserSidebar from "../../components/userCommon/sidebar";
import { getAllSessions } from "../../services/sessionService";

const ClientSessionManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<ISession[]>([]);

  const fetchSessions = async () => {
    const res = await getAllSessions(user?._id)
    setSessions(res.data?.data || []);
  };

  useEffect(() => {
    if (user) fetchSessions();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#160733] to-[#1a002e] text-white">
      <UserSidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          My Booked Sessions
        </h1>
        <SessionTable sessions={sessions} refreshSessions={fetchSessions} role="client" />
      </main>
    </div>
  );
};

export default ClientSessionManagement;
