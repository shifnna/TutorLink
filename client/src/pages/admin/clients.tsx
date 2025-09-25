import { useState, useEffect } from "react";
import {FaSearch} from "react-icons/fa";
import Header from "../../components/admin/header";
import { IUser } from "../../types/IUser";
import TableList from "../../components/admin/tableList";
import { adminService } from "../../services/adminService";


const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await adminService.getAllClients();
        setUsers(
          data.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            isBlocked: u.isBlocked || false,
            isVerified: u.isVerified,
            joinedDate: new Date(u.createdAt).toLocaleDateString(),
          }))
        );
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchClients();
  }, []);


  const handleToggleStatus = async (id: string) => {
    try {      
      const updatedUser = await adminService.toggleUserStatus(id);
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
      <TableList users={users} handleToggleStatus={handleToggleStatus}/>
      
    </div>
  );
};

export default ClientsPage;
