import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaFileAlt } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Header from "../../components/admin/header";
import { toast, Toaster } from "react-hot-toast";
import { ITutorApplication } from "../../types/ITutorApplication";
import { adminService } from "../../services/adminService";

const TutorApplications: React.FC = () => {
  const [selectedTutor, setSelectedTutor] = useState<ITutorApplication | null>(null);
  const [applications, setApplications] = useState<ITutorApplication[]>([]);
  const [expandedTutorId, setExpandedTutorId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 5;
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await adminService.getAllTutorApplications();
        setApplications(data || []);
      } catch (err) {
        console.error("Error fetching tutor applications", err);
        setApplications([]);
      }
    };

    fetchApplications();
  }, []);

  async function handleApprove(userId: string) {
    try {
      await adminService.approveTutor(userId);
      toast.success("Tutor approved successfully!");
      setSelectedTutor(null);

      const updated = await adminService.getAllTutorApplications();
      setApplications(updated);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Something went wrong!";
      toast.error(errorMessage);
    }
  }

  async function handleReject(userId: string) {
    const message = prompt("Enter rejection message for this tutor:");
    if (!message) {
      toast.error("Rejection message cannot be empty!");
      return;
    }

    try {
      await adminService.rejectTutor(userId, message);
      toast.success("Tutor rejected successfully!");
      const updated = await adminService.getAllTutorApplications();
      setApplications(updated);
      setSelectedTutor(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong!";
      toast.error(errorMessage);
    }
  }

  // Slice applications for current page
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApp, indexOfLastApp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      {/* Header */}
      <Header name={"Tutor Applications"} />

      {/* Applications List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-purple-800/40">
        <h2 className="text-2xl font-bold mb-6">Pending Applications</h2>

        {applications.length === 0 ? (
          <p className="text-gray-400">No tutor applications found.</p>
        ) : (
          <div className="space-y-4">
            {currentApplications.map((app) => (
              <div
                key={app._id}
                className="bg-black/30 rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  {/* Tutor Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={app.profileImage}
                      alt={app.tutorId?.name}
                      className="w-16 h-16 object-cover rounded-full border-4 border-purple-500 shadow-md"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{app.tutorId?.name}</h3>
                        <p className="text-gray-300 text-sm">💼 {app.experienceLevel}</p>
                      </div>

                      <p className="text-gray-300 text-sm">{app.description}</p>
                      <p className="text-gray-400 text-xs">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.tutorId?.tutorApplication?.status === "Pending"
                            ? "bg-green-600 text-white"
                            : app.tutorId?.tutorApplication?.status === "Rejected"
                            ? "bg-red-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {app.tutorId?.tutorApplication?.status || "Pending"}
                      </span>

                      <Button
                        onClick={() => setSelectedTutor(app)}
                        className="bg-blue-600 hover:bg-blue-700 rounded-full px-4 py-2 text-sm font-bold"
                      >
                        <FaFileAlt /> View Details
                      </Button>
                    </div>

                    {/* Rejection message toggle */}
                    {app.tutorId?.tutorApplication?.status === "Rejected" && (
                      <>
                        <p
                          className="text-sm text-blue-400 cursor-pointer hover:underline"
                          onClick={() =>
                            setExpandedTutorId(
                              expandedTutorId === app._id ? null : app._id
                            )
                          }
                        >
                          {expandedTutorId === app._id
                            ? "💬 Hide Message"
                            : "💬 View Message"}
                        </p>
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            expandedTutorId === app._id
                              ? "max-h-40 opacity-100 mt-2"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="rounded-lg p-3 text-sm text-gray-800 shadow-sm bg-red-100">
                            {app.tutorId?.tutorApplication?.adminMessage ||
                              "No message provided"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {applications.length > applicationsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-yellow-400 text-black font-bold"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Tutor Details */}
      {selectedTutor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 overflow-y-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-purple-700 rounded-2xl p-8 shadow-xl max-w-2xl w-full my-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedTutor.tutorId?.name} - Full Profile
              </h2>
              <button
                onClick={() => setSelectedTutor(null)}
                className="text-gray-300 hover:text-white text-2xl"
              >
                ✖
              </button>
            </div>

            {/* Profile & Info */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={selectedTutor.profileImage}
                alt={selectedTutor.tutorId?.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-purple-500 shadow-md"
              />
              <p className="text-gray-300 mt-3">💼 {selectedTutor.experienceLevel}</p>
              <p className="text-gray-400 text-sm">
                Applied on {new Date(selectedTutor.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-400 text-sm">📧 {selectedTutor.tutorId?.email}</p>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 text-gray-300 mb-6">
              <p><span className="font-bold">Gender:</span> {selectedTutor.gender || "N/A"}</p>
              <p><span className="font-bold">Occupation:</span> {selectedTutor.occupation || "N/A"}</p>
              <p><span className="font-bold">Education:</span> {selectedTutor.education || "N/A"}</p>
              <p><span className="font-bold">Languages:</span> {selectedTutor.languages?.join(", ") || "N/A"}</p>
              <p><span className="font-bold">Skills:</span> {selectedTutor.skills?.join(", ") || "N/A"}</p>
              <p><span className="font-bold">Description:</span> {selectedTutor.description}</p>
            </div>

            {/* Certificates */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">📜 Certificates</h3>
              {selectedTutor.certificates.length === 0 ? (
                <p className="text-gray-400 text-sm">No certificates uploaded.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-300">
                  {selectedTutor.certificates.map((cert, idx) => (
                    <li key={idx}>
                      <a
                        href={cert}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Certificate {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bank Details */}
            <div className="mb-6 text-gray-300">
              <h3 className="font-semibold mb-2">🏦 Bank Details</h3>
              <p><span className="font-bold">Account Holder:</span> {selectedTutor.accountHolder || "N/A"}</p>
              <p><span className="font-bold">Account Number:</span> {selectedTutor.accountNumber || "N/A"}</p>
              <p><span className="font-bold">Bank Name:</span> {selectedTutor.bankName || "N/A"}</p>
              <p><span className="font-bold">IFSC:</span> {selectedTutor.ifsc || "N/A"}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => handleApprove(selectedTutor.tutorId._id)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 font-bold"
              >
                <FaCheckCircle /> Approve
              </Button>
              <Button
                onClick={() => handleReject(selectedTutor.tutorId._id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 rounded-full px-4 py-2 font-bold"
              >
                <FaTimesCircle /> Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default TutorApplications;
