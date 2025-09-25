import {
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { IUserWithTutor } from "../../types/IUser";

interface TableListProps {
  users: IUserWithTutor[];
  handleToggleStatus: (id: string) => void;
}

const TableList: React.FC<TableListProps> = ({ users, handleToggleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<IUserWithTutor | null>(null);

  const openModal = (tutor: IUserWithTutor) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTutor(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-purple-800/40">
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-black/30 rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition"
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-16 h-16 object-cover rounded-full border-4"
                    />
                  ) : (
                    <FaUserCircle className="w-16 h-16 text-purple-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-300 text-sm">{user.email}</p>
                    <p className="text-gray-400 text-xs">
                      Joined: {user.joinedDate}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Verified:{" "}
                      {user.isVerified ? (
                        <span className="text-green-400 font-bold">Yes</span>
                      ) : (
                        <span className="text-red-400 font-bold">No</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      !user.isBlocked
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {!user.isBlocked ? "ACTIVE" : "BLOCKED"}
                  </span>
                  <Button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold ${
                      !user.isBlocked
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {!user.isBlocked ? (
                      <>
                        <FaTimesCircle /> Block
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Unblock
                      </>
                    )}
                  </Button>

                  {/* View Details for tutor */}
                  {user.role === "tutor" && (
                    <Button
                      onClick={() => openModal(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No users found.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTutor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-2xl w-11/12 max-w-lg relative transform transition-all duration-300 scale-100 hover:scale-105 shadow-2xl">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl"
              onClick={closeModal}
            >
              ✖
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              {selectedTutor.profileImage ? (
                <img
                  src={selectedTutor.profileImage}
                  alt={selectedTutor.name}
                  className="w-16 h-16 object-cover rounded-full border-2 border-purple-500"
                />
              ) : (
                <FaUserCircle className="w-16 h-16 text-purple-400" />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedTutor.name}</h2>
                <p className="text-gray-400">{selectedTutor.email}</p>
                <p className="text-sm text-yellow-400 font-semibold">
                  {selectedTutor.role.toUpperCase()}
                </p>
              </div>
            </div>

            <hr className="my-3 border-gray-700" />

            {/* User Info */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p>
                <span className="font-semibold text-gray-300">Verified:</span>{" "}
                {selectedTutor.isVerified ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <span className="font-semibold text-gray-300">Joined:</span>{" "}
                {selectedTutor.joinedDate}
              </p>
            </div>

            {selectedTutor.tutorProfile && (
              <>
                <h3 className="text-lg font-semibold mt-5 mb-2">
                  Tutor Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-gray-300">
                      Description:
                    </span>{" "}
                    {selectedTutor.tutorProfile.description}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Education:
                    </span>{" "}
                    {selectedTutor.tutorProfile.education}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Skills:</span>{" "}
                    {selectedTutor.tutorProfile.skills.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Languages:
                    </span>{" "}
                    {selectedTutor.tutorProfile.languages.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Experience:
                    </span>{" "}
                    {selectedTutor.tutorProfile.experienceLevel}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Occupation:
                    </span>{" "}
                    {selectedTutor.tutorProfile.occupation}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Gender:</span>{" "}
                    {selectedTutor.tutorProfile.gender}
                  </p>

                  {selectedTutor.tutorProfile.certificates?.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-300 mt-2">
                        Certificates:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTutor.tutorProfile.certificates.map(
                          (cert, i) => (
                            <a
                              key={i}
                              href={cert}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-xs text-white transition"
                            >
                              View Certificate {i + 1}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;
