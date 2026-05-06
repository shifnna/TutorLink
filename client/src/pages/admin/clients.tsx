import { useState, useEffect } from "react";
import { IUser } from "../../types/IUser";
import TableList from "../../components/adminCommon/tableList";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await adminService.getAllClients();
      if (res.success && res.data) {
        setUsers(
          res.data.map((u) => ({
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
      }
    };
    fetchClients();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!selectedUserId) return;
    const res = await adminService.toggleUserStatus(selectedUserId);
    if (res.data) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserId ? { ...u, isBlocked: res.data.isBlocked } : u
        )
      );
    }
    setConfirmModal(false);
  };

  return (
    <div className="px-10 py-10">

      {/* CENTER CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-slate-900">
            Clients
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and monitor all registered clients
          </p>
        </motion.div>

        {/* SEARCH */}
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

        {/* TABLE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
          <TableList
            users={filteredUsers}
            handleToggleStatus={(id) => {
              setSelectedUserId(id);
              setConfirmModal(true);
            }}
          />
        </motion.div>

      </div>

      {/* CONFIRM MODAL */}
      <Dialog open={confirmModal} onClose={() => setConfirmModal(false)}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center border border-slate-100">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Change user status?
            </h2>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </Button>

              <Button
                variant="outline"
                onClick={() => setConfirmModal(false)}
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