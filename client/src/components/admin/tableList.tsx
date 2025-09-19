
import { FaUserCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { useState } from "react";


interface User {
  id: number;
  name: string;
  email: string;
  isBlocked: "active" | "blocked";
  joinedDate: string;
}

const usersData: User[] = [
  {
    id: 1,
    name: "Sarah Williams",
    email: "sarah@example.com",
    isBlocked: "active",
    joinedDate: "2025-08-12",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    isBlocked: "blocked",
    joinedDate: "2025-07-22",
  },
  {
    id: 3,
    name: "Alice Brown",
    email: "alice@example.com",
    isBlocked: "active",
    joinedDate: "2025-06-15",
  },
];

const TableList = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);
  
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
        u.id === id ? { ...u, status: u.isBlocked === "active" ? "blocked" : "active" } : u
      )
    );
  };
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-purple-800/40">
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
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
                    !user.isBlocked ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {!user.isBlocked ? "ACTIVE" : "BLOCKED"}
                </span>
                <Button
                  onClick={() => toggleStatus(user.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold ${
                    !user.isBlocked
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {!user.isBlocked ? (
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
  )
}

export default TableList
