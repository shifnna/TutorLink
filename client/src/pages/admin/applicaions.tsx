import { useEffect, useState } from "react";
import Header from "../../components/adminCommon/header";
import { toast, Toaster } from "react-hot-toast";
import { ITutorApplication } from "../../types/ITutorApplication";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import TableList from "../../components/adminCommon/tableList";

interface IConfirmModal {
  isOpen: boolean;
  type: "approve" | "reject" | null;
  userId: string | null;
}

const TutorApplications: React.FC = () => {
  const [applications, setApplications] = useState<ITutorApplication[]>([]);
  const [search, setSearch] = useState("");
  const [reasonModal, setReasonModal] = useState<{ isOpen: boolean; message: string }>({
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
      try {
        const res = await adminService.getAllTutorApplications();
        if (res.success && res.data) {
          setApplications(res.data);
        } else {
          toast.error(res.message || "Failed to fetch applications");
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching tutor applications", err);
        setApplications([]);
      }
    };
    fetchApplications();
  }, []);

  const refreshList = async () => {
    const updated = await adminService.getAllTutorApplications();
    setApplications(updated.success && updated.data ? updated.data : []);
  };

  const handleApprove = async () => {
    if (!confirmModal.userId) return;
    try {
      const res = await adminService.approveTutor(confirmModal.userId);
      if (res.success) {
        toast.success("Tutor approved successfully!");
        await refreshList();
      } else {
        toast.error("Having some issues to approve");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setConfirmModal({ isOpen: false, type: null, userId: null });
    }
  };

  const handleReject = async () => {
    if (!confirmModal.userId) return;
    if (!rejectReason.trim()) {
      toast.error("Rejection message cannot be empty!");
      return;
    }

    try {
      const res = await adminService.rejectTutor(confirmModal.userId, rejectReason);
      if (res.success) {
        toast.success("Tutor rejected successfully!");
        await refreshList();
      } else {
        toast.error("Having some issues to reject");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setRejectReason("");
      setConfirmModal({ isOpen: false, type: null, userId: null });
    }
  };

  const handleViewReason = (message: string) => {
    setReasonModal({ isOpen: true, message });
  };

  const closeReasonModal = () => {
    setReasonModal({ isOpen: false, message: "" });
  };

  // Filter applications by search AND exclude approved
  const filteredApplications = applications.filter((app) => {
    const status = app.tutorId?.tutorApplication?.status;
    const matchesSearch =
      app.tutorId?.name.toLowerCase().includes(search.toLowerCase()) ||
      app.tutorId?.email.toLowerCase().includes(search.toLowerCase());

    const notApproved = status !== "Approved";
    return matchesSearch && notApproved;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      <Header name={"Tutor Applications"} />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
      />

      <TableList
        users={filteredApplications}
        onViewReason={handleViewReason}
        renderModalContent={(app) => {
          const tutor = app as ITutorApplication;
          const status = tutor.tutorId?.tutorApplication?.status;
          const isPending = status === "Pending" || status === null;

          return (
            <div className="space-y-6 max-h-[85vh] overflow-y-auto px-2 pb-4">
              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <a href={tutor.profileImage} target="_self">
                  <img
                    src={tutor.profileImage}
                    alt={`${tutor.tutorId?.name}'s profile`}
                    className="w-28 h-28 rounded-full border-4 border-purple-500 object-cover shadow-md cursor-pointer hover:opacity-90 transition"
                  />
                </a>
              </div>

              {/* Basic Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">{tutor.tutorId?.name}</h2>
                <p className="text-gray-300">{tutor.tutorId?.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Status:{" "}
                  <span className="font-medium text-purple-400">
                    {status || "Pending"}
                  </span>
                </p>
              </div>

              {/* General Details */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <p><span className="font-semibold text-gray-400">Gender:</span> {tutor.gender}</p>
                <p><span className="font-semibold text-gray-400">Occupation:</span> {tutor.occupation}</p>
                <p><span className="font-semibold text-gray-400">Education:</span> {tutor.education}</p>
                <p><span className="font-semibold text-gray-400">Experience:</span> {tutor.experienceLevel}</p>
                <p><span className="font-semibold text-gray-400">Languages:</span> {Array.isArray(tutor.languages) ? tutor.languages.join(", ") : tutor.languages}</p>
                <p><span className="font-semibold text-gray-400">Skills:</span> {Array.isArray(tutor.skills) ? tutor.skills.join(", ") : tutor.skills}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">Description:</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {tutor.description || "No description provided."}
                </p>
              </div>

              {/* Certificates */}
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">Certificates:</h3>
                {tutor.certificates && tutor.certificates.length > 0 ? (
                  <ul className="list-disc list-inside text-blue-400 space-y-1">
                    {tutor.certificates.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-300"
                        >
                          Certificate {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No certificates uploaded.</p>
                )}
              </div>

              {/* Bank Details */}
              <div className="border-t border-gray-700 pt-3 text-sm text-gray-300">
                <h3 className="font-semibold text-gray-300 mb-1">Bank Details:</h3>
                <p><span className="text-gray-400">Account Holder:</span> {tutor.accountHolder}</p>
                <p><span className="text-gray-400">Account Number:</span> {tutor.accountNumber}</p>
                <p><span className="text-gray-400">Bank Name:</span> {tutor.bankName}</p>
                <p><span className="text-gray-400">IFSC:</span> {tutor.ifsc}</p>
              </div>

              {/* Approve / Reject Buttons */}
              {isPending && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <button
                    onClick={() =>
                      setConfirmModal({
                        isOpen: true,
                        type: "approve",
                        userId: tutor.tutorId?._id || tutor._id,
                      })
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold w-[120px] sm:w-auto"
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
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold w-[120px] sm:w-auto"
                  >
                    Reject
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                Applied on {new Date(tutor.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        }}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-2xl w-11/12 max-w-md relative shadow-2xl">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl"
              onClick={() => setConfirmModal({ isOpen: false, type: null, userId: null })}
            >
              ✖
            </button>

            {confirmModal.type === "approve" ? (
              <>
                <h2 className="text-xl font-bold mb-4">Approve Tutor</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to approve this tutor?</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false, type: null, userId: null })}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Reject Tutor</h2>
                <textarea
                  placeholder="Enter rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full h-24 p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false, type: null, userId: null })}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {reasonModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-2xl w-11/12 max-w-md relative shadow-2xl">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl"
              onClick={closeReasonModal}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Rejection Reason</h2>
            <p className="text-gray-300">{reasonModal.message || "No reason provided."}</p>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default TutorApplications;
