import { useState, useEffect } from "react";
import Header from "../../components/adminCommon/header";
import { IUser } from "../../types/IUser";
import TableList from "../../components/adminCommon/tableList";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/ui/button";

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  const openConfirmModal = (id: string) => {
    setSelectedUserId(id);
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedUserId) return;
    try {
      const response = await adminService.toggleUserStatus(selectedUserId);
      const updatedUser = response.data;
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserId ? { ...u, isBlocked: updatedUser.isBlocked } : u
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setConfirmModal(false);
      setSelectedUserId(null);
    }
  };

  const handleCancel = () => {
    setConfirmModal(false);
    setSelectedUserId(null);
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
      <TableList users={filteredUsers} handleToggleStatus={openConfirmModal} />

      <Dialog open={confirmModal} onClose={handleCancel} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to change this user's status?
            </h2>
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                onClick={handleConfirm}
                className="bg-red-600 text-white hover:bg-red-700 px-5 py-2 rounded-lg"
              >
                Confirm
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="px-5 py-2 rounded-lg border-gray-400 text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
