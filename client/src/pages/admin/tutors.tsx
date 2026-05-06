import { useEffect, useState } from "react";
import TableList from "../../components/adminCommon/tableList";
import { IUser } from "../../types/IUser";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const TutorsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [tutors, setTutors] = useState<IUser[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    id: "",
  });

  useEffect(() => {
    const fetchTutors = async () => {
      const res = await adminService.getAllTutors();
      if (res.success && res.data) {
        setTutors(
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

    fetchTutors();
  }, []);

  const handleConfirm = (id: string) => {
    setConfirmModal({ open: true, id });
  };

  const handleToggleStatus = async () => {
    const id = confirmModal.id;
    if (!id) return;

    const updatedUser = await adminService.toggleUserStatus(id);
    if (updatedUser.success && updatedUser.data) {
      setTutors((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, isBlocked: updatedUser.data!.isBlocked } : u
        )
      );
    }

    setConfirmModal({ open: false, id: "" });
  };

  const filteredUsers = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-10 py-10">

      {/* CENTERED CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-slate-900">
            Tutors
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and monitor all registered tutors
          </p>
        </motion.div>

        {/* SEARCH */}
        <SearchBar
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  setSearch(e.target.value)
} 
          placeholder="Search tutors by name or email..."
        />

        {/* TABLE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
          <TableList users={filteredUsers} handleToggleStatus={handleConfirm} />
        </motion.div>

      </div>

      {/* CONFIRM MODAL */}
      <Dialog
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: "" })}
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center border border-slate-100">

            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Confirm Action
            </h2>

            <p className="text-slate-500 mb-6">
              Are you sure you want to change this tutor’s status?
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleToggleStatus}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </Button>

              <Button
                variant="outline"
                onClick={() => setConfirmModal({ open: false, id: "" })}
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

export default TutorsPage;