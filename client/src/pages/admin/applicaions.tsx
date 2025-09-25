import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaFileAlt } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import Header from "../../components/admin/header";
import {toast,Toaster} from "react-hot-toast";
import { ITutorApplication } from "../../types/ITutorApplication";
import { adminService } from "../../services/adminService";


const TutorApplications: React.FC = () => {
  const [selectedTutor, setSelectedTutor] = useState<ITutorApplication | null>(null);
  const [applications, setApplications] = useState<ITutorApplication[]>([]);

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

    // Refresh applications
    const updated = await adminService.getAllTutorApplications();
    setApplications(updated);
  } catch (err: any) {
    console.error("Error approving tutor:", err.response?.data || err.message);
    toast.error("Something went wrong!");
  }
  }

  async function handleReject(userId: string){

  }
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
            {applications.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between bg-black/30 rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition"
              >
                {/* Tutor Info */}
                <div  className="flex items-center gap-4">
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

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedTutor(app)}
                    className="bg-blue-600 hover:bg-blue-700 rounded-full px-4 py-2 text-sm font-bold"
                  >
                    <FaFileAlt /> View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

            {/* Profile */}
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

            {/* General Info */}
            <div className="grid grid-cols-2 gap-4 text-gray-300 mb-6">
              <p><span className="font-bold">Gender:</span> {selectedTutor.gender || "N/A"}</p>
              <p><span className="font-bold">Occupation:</span> {selectedTutor.occupation || "N/A"}</p>
              <p><span className="font-bold">Education:</span> {selectedTutor.education || "N/A"}</p>
              <p><span className="font-bold">Languages:</span> {selectedTutor.languages?.join(", ") || "N/A"}</p>
              <p><span className="font-bold">Skills:</span> {selectedTutor.skills?.join(", ") || "N/A"}</p>
              <p><span className="font-bold">Description:</span> {selectedTutor.description}</p>
            </div>

            {/* Certificates from S3 */}
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

            {/* Action Buttons inside Modal */}
            <div className="flex justify-end gap-4">
              <Button onClick={()=>handleApprove(selectedTutor.tutorId._id)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 font-bold">
                <FaCheckCircle /> Approve
              </Button>
              <Button onClick={()=>handleReject(selectedTutor.tutorId._id)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 rounded-full px-4 py-2 font-bold">
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
