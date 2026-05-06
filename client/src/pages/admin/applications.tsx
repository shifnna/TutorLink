import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ITutorApplication } from "../../types/ITutorApplication";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import TableList from "../../components/adminCommon/tableList";
import { motion } from "framer-motion";

interface IConfirmModal {
  isOpen: boolean;
  type: "approve" | "reject" | null;
  userId: string | null;
}

const TutorApplications: React.FC = () => {
  const [applications, setApplications] = useState<ITutorApplication[]>([]);
  const [search, setSearch] = useState("");

  const [viewModal, setViewModal] = useState<ITutorApplication | null>(null);

  const [reasonModal, setReasonModal] = useState({
    isOpen: false,
    message: "",
  });

  const [confirmModal, setConfirmModal] = useState<IConfirmModal>({
    isOpen: false,
    type: null,
    userId: null,
  });

  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await adminService.getAllTutorApplications();
      if (res.success && res.data) setApplications(res.data);
    };
    fetchApplications();
  }, []);

  const refreshList = async () => {
    const updated = await adminService.getAllTutorApplications();
    setApplications(updated.success && updated.data ? updated.data : []);
  };

  const handleApprove = async () => {
    if (!confirmModal.userId) return;
    const res = await adminService.approveTutor(confirmModal.userId);
    if (res.success) {
      toast.success("Tutor approved successfully!");
      await refreshList();
    }
    setConfirmModal({ isOpen: false, type: null, userId: null });
  };

  const handleReject = async () => {
    if (!confirmModal.userId || !rejectReason.trim()) return;

    const res = await adminService.rejectTutor(
      confirmModal.userId,
      rejectReason
    );

    if (res.success) {
      toast.success("Tutor rejected successfully!");
      await refreshList();
    }

    setRejectReason("");
    setConfirmModal({ isOpen: false, type: null, userId: null });
  };

  const filteredApplications = applications.filter((app) => {
    const status = app.tutorId?.tutorApplication?.status;

    const matchesSearch =
      app.tutorId?.name.toLowerCase().includes(search.toLowerCase()) ||
      app.tutorId?.email.toLowerCase().includes(search.toLowerCase());

    return matchesSearch && status !== "Approved";
  });

  return (
    <div className="px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-slate-900">
            Tutor Applications
          </h1>
          <p className="text-slate-500 mt-1">
            Review and manage tutor approval requests
          </p>
        </motion.div>

        {/* SEARCH */}
        <SearchBar
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          placeholder="Search by name or email..."
        />

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
          <TableList
            users={filteredApplications}

            /* VIEW FULL APPLICATION */
            renderModalContent={(item) => {
              const tutor = item as ITutorApplication;

              return (
                <div className="space-y-5 text-slate-700">
                  <h2 className="text-xl font-bold text-slate-900">
                    Tutor Application
                  </h2>

                  <p><b>Name:</b> {tutor.tutorId?.name}</p>
                  <p><b>Email:</b> {tutor.tutorId?.email}</p>
                  <p><b>Education:</b> {tutor.education}</p>
                  <p><b>Experience:</b> {tutor.experienceLevel}</p>
                  <p><b>Skills:</b> {tutor.skills}</p>
                  <p><b>Languages:</b> {tutor.languages}</p>
                  <p><b>Description:</b> {tutor.description}</p>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          type: "approve",
                          userId: tutor.tutorId?._id || tutor._id,
                        })
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          type: "reject",
                          userId: tutor.tutorId?._id || tutor._id,
                        })
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            }}

            /* VIEW REJECTION MESSAGE */
            onViewReason={(msg: string) =>
              setReasonModal({ isOpen: true, message: msg })
            }
          />
        </motion.div>

      </div>

      {/* CONFIRM MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-3xl w-[400px] shadow-xl border border-slate-100">

            {confirmModal.type === "approve" ? (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Approve Tutor
                </h2>

                <p className="text-slate-500 mb-6">
                  Are you sure you want to approve this tutor?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setConfirmModal({ isOpen: false, type: null, userId: null })
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Reject Tutor
                </h2>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  className="w-full border rounded-lg p-3 mb-4"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setConfirmModal({ isOpen: false, type: null, userId: null })
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* REASON MODAL */}
      {reasonModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-3xl w-[400px] shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Rejection Reason
            </h2>

            <p className="text-slate-600">{reasonModal.message}</p>

            <button
              onClick={() => setReasonModal({ isOpen: false, message: "" })}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default TutorApplications;