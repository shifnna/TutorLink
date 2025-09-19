import { useState, useEffect } from "react";
import { adminRepository } from "../../repositories/adminRepository";
import {
  FaUserCircle,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Header from "../../components/admin/header";

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  joinedDate: string;
}

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminRepository.getAllUsers();
        setUsers(
          data.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            isBlocked: u.isBlocked || false, // important
            joinedDate: new Date(u.createdAt).toLocaleDateString(),
          }))
        );
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (id: string) => {
    try {
      // Call backend to toggle isBlocked
      const updatedUser = await adminRepository.toggleUserStatus(id);

      // Update local state with backend value
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: updatedUser.isBlocked } : u))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      {/* Header */}
      <Header name={"Clients"} />

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
                      !user.isBlocked ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
                  >
                    {!user.isBlocked ? "ACTIVE" : "BLOCKED"}
                  </span>
                  <Button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold ${
                      !user.isBlocked ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
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
    </div>
  );
};

export default ClientsPage;
