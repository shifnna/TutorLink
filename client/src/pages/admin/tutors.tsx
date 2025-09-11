import { useState } from "react";
import {
  FaGraduationCap,
  FaArrowLeft,
  FaUserCircle,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked";
  joinedDate: string;
}

const usersData: User[] = [
  {
    id: 1,
    name: "Sarah Williams",
    email: "sarah@example.com",
    status: "active",
    joinedDate: "2025-08-12",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    status: "blocked",
    joinedDate: "2025-07-22",
  },
  {
    id: 3,
    name: "Alice Brown",
    email: "alice@example.com",
    status: "active",
    joinedDate: "2025-06-15",
  },
];

const TutorsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(usersData);
  const [search, setSearch] = useState("");

  // Filter users by search input
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle block/unblock
  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Clients
          </h1>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl font-bold hover:scale-105 transition">
          <FaArrowLeft /> <a href="/admin-dashboard"> Back to Dashboard</a>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-purple-800/40 mb-6">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-white flex-1 placeholder-gray-400"
        />
      </div>

      {/* Users List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-purple-800/40">
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-black/30 rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition"
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <FaUserCircle className="w-12 h-12 text-purple-400" />
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-300 text-sm">{user.email}</p>
                    <p className="text-gray-400 text-xs">Joined: {user.joinedDate}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {user.status.toUpperCase()}
                  </span>
                  <Button
                    onClick={() => toggleStatus(user.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold ${
                      user.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {user.status === "active" ? (
                      <>
                        <FaTimesCircle /> Block
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Unblock
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorsPage;
