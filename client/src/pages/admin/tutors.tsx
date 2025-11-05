import { useEffect, useState } from "react";
import Header from "../../components/adminCommon/header";
import TableList from "../../components/adminCommon/tableList";
import { IUser } from "../../types/IUser";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/ui/button";

const TutorsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [tutors, setTutors] = useState<IUser[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    id: "",
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
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
        } else {
          console.error(res.message || "Failed to load tutors");
          setTutors([]);
        }
      } catch (error) {
        console.error("Failed to load tutors:", error);
        setTutors([]);
      }
    };

    fetchTutors();
  }, []);

  const handleConfirm = (id: string) => {
    setConfirmModal({ open: true, id });
  };

  const handleToggleStatus = async () => {
    try {
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
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setConfirmModal({ open: false, id: "" });
    }
  };

  const filteredUsers = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      <Header name={"Tutors"} />
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
      />
      <TableList users={filteredUsers} handleToggleStatus={handleConfirm} />

      <Dialog
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: "" })}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change this tutor’s status?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleToggleStatus}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </Button>
              <Button
                onClick={() => setConfirmModal({ open: false, id: "" })}
                variant="outline"
                className="px-4 py-2 rounded-lg border-gray-300"
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
