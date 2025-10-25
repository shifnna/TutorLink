import { useState, useEffect } from "react";
import Header from "../../components/adminCommon/header";
import { IUser } from "../../types/IUser";
import TableList from "../../components/adminCommon/tableList";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllClients();
        if (response.success && response.data) {
          setUsers(
            response.data.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              isBlocked: u.isBlocked || false,
              isVerified: u.isVerified,
              joinedDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "Unknown",
              profileImage: u.profileImage || null,
              tutorProfile: u.tutorProfile || null,
            }))
          );
        } else {
          setUsers([]);
          console.error(response.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchClients();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      if (window.confirm("Are you sure?")) {
        const response = await adminService.toggleUserStatus(id);
        const updatedUser = response.data;
        if (!updatedUser) {
          console.error("No user returned from backend");
          return;
        }
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isBlocked: updatedUser.isBlocked } : u))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white px-4 py-8 md:px-12 md:py-10">
      <Header name={"Clients"} />
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
      />
      <TableList users={filteredUsers} handleToggleStatus={handleToggleStatus} />
    </div>
  );
};

export default ClientsPage;
