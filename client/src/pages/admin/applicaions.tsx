import { useState } from "react";
import {
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";

interface TutorApplication {
  id: number;
  name: string;
  subject: string;
  experience: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
  profileImage: string;
  certificates: string[];
  documents: string[];
}

const tutorApplications: TutorApplication[] = [
  {
    id: 1,
    name: "Alice Johnson",
    subject: "Mathematics",
    experience: "5 years",
    appliedDate: "2025-09-01",
    status: "pending",
    profileImage: "/profile1.jpg",
    certificates: ["/cert1.pdf", "/cert2.pdf"],
    documents: ["/resume.pdf"],
  },
  {
    id: 2,
    name: "Bob Brown",
    subject: "Physics",
    experience: "3 years",
    appliedDate: "2025-09-03",
    status: "pending",
    profileImage: "/profile2.jpg",
    certificates: ["/cert3.pdf"],
    documents: ["/resume2.pdf"],
  },
];

const TutorApplications: React.FC = () => {
  const [selectedTutor, setSelectedTutor] = useState<TutorApplication | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Tutor Applications
          </h1>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl font-bold hover:scale-105 transition">
          <FaArrowLeft /><a href="/admin-dashboard"> Back to Dashboard</a>
        </Button>
      </div>

      {/* Applications List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-purple-800/40">
        <h2 className="text-2xl font-bold mb-6">Pending Applications</h2>
        <div className="space-y-4">
          {tutorApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between bg-black/30 rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition"
            >
              {/* Tutor Info */}
              <div>
                <h3 className="text-xl font-semibold">{app.name}</h3>
                <p className="text-gray-300 text-sm">
                  📘 {app.subject} | 💼 {app.experience}
                </p>
                <p className="text-gray-400 text-xs">Applied on {app.appliedDate}</p>
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
      </div>

      {/* Modal for Tutor Details */}
      {selectedTutor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-purple-700 rounded-2xl p-8 shadow-xl max-w-lg w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedTutor.name} - Details
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
                alt={selectedTutor.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-purple-500 shadow-md"
              />
              <p className="text-gray-300 mt-3">
                📘 {selectedTutor.subject} | 💼 {selectedTutor.experience}
              </p>
              <p className="text-gray-400 text-sm">
                Applied on {selectedTutor.appliedDate}
              </p>
            </div>

            {/* Certificates */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">📜 Certificates</h3>
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
            </div>

            {/* Documents */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">📂 Documents</h3>
              <ul className="list-disc list-inside text-gray-300">
                {selectedTutor.documents.map((doc, idx) => (
                  <li key={idx}>
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Document {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons inside Modal */}
            <div className="flex justify-end gap-4">
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 font-bold">
                <FaCheckCircle /> Approve
              </Button>
              <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 rounded-full px-4 py-2 font-bold">
                <FaTimesCircle /> Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorApplications;
