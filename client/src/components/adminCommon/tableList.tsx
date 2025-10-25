import { useState } from "react";
import {
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaEye,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { IUser } from "../../types/IUser";
import { ITutorApplication } from "../../types/ITutorApplication";
import { JSX } from "react";

// Type guards
const isIUser = (item: IUser | ITutorApplication): item is IUser =>
  "id" in item && "isBlocked" in item && "isVerified" in item;
const isITutorApplication = (
  item: IUser | ITutorApplication
): item is ITutorApplication => "description" in item && "_id" in item;

interface TableListProps {
  users: (IUser | ITutorApplication)[];
  handleToggleStatus?: (id: string) => void;
  onViewReason?: (message: string) => void;
  renderModalContent?: (item: IUser | ITutorApplication) => JSX.Element;
}

const TableList: React.FC<TableListProps> = ({
  users,
  handleToggleStatus,
  onViewReason,
  renderModalContent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IUser | ITutorApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const openModal = (item: IUser | ITutorApplication) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const getId = (item: IUser | ITutorApplication): string => {
    if (isIUser(item)) return item.id;
    if (isITutorApplication(item)) return item._id;
    throw new Error("Invalid item type");
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <div className="bg-gradient-to-b from-black/40 via-purple-950/30 to-black/50 rounded-2xl p-6 shadow-2xl border border-purple-800/30 backdrop-blur-lg">
        {currentUsers.length > 0 ? (
          currentUsers.map((item) => {
            const id = getId(item);
            const isUser = isIUser(item);
            const isApplication = isITutorApplication(item);
            const name = isUser ? item.name : item.tutorId?.name;
            const email = isUser ? item.email : item.tutorId?.email;
            const joined = isUser
              ? item.joinedDate
              : item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Unknown";
            const status = isApplication
              ? item.tutorId?.tutorApplication?.status
              : null;
            const isRejected = status === "Rejected";
            return (
              <div
                key={id}
                className="flex items-center justify-between bg-black/30 rounded-xl px-6 py-5 mb-4 shadow-lg hover:shadow-2xl transition"
              >
                {/* Info Section */}
                <div className="flex items-center gap-5">
                  {typeof item === "object" && "profileImage" in item && item.profileImage ? (
                    <img
                      src={item.profileImage}
                      alt={name}
                      className="w-14 h-14 object-cover rounded-full border-4 border-purple-500"
                    />
                  ) : (
                    <FaUserCircle className="w-14 h-14 text-purple-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{name || "Unknown"}</h3>
                    <p className="text-gray-300 text-sm">{email}</p>
                    <p className="text-gray-400 text-xs mb-1">
                      {isUser ? "Joined" : "Applied"}: {joined}
                    </p>
                    {isApplication && (
                      <p className={`text-xs font-bold ${
                        isRejected
                          ? "text-red-400"
                          : status === "Approved"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}>
                        Status: {status || "Pending"}
                      </p>
                    )}
                    {isUser && (
                      <p className="text-gray-400 text-xs">
                        Verified:{" "}
                        {item.isVerified ? (
                          <span className="text-green-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-400 font-bold">No</span>
                        )}
                      </p>
                    )}
                    {isApplication && !isRejected && (
                      <p className="text-gray-400 text-xs">
                        Experience: {item.experienceLevel}
                      </p>
                    )}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {isUser && handleToggleStatus && (
                    <>
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-extrabold tracking-widest ${
                          item.isBlocked
                            ? "bg-red-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {item.isBlocked ? "BLOCKED" : "ACTIVE"}
                      </span>
                      <Button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold shadow ${
                          item.isBlocked
                            ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600"
                            : "bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-500 hover:to-pink-600"
                        }`}
                      >
                        {item.isBlocked ? (
                          <>
                            <FaCheckCircle /> Unblock
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Block
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  {/* View Reason for rejected tutor applications */}
                  {isApplication && isRejected && onViewReason && (
                    <Button
                      onClick={() =>
                        onViewReason(
                          item.tutorId?.tutorApplication?.adminMessage ||
                            "No reason provided."
                        )
                      }
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-full px-5 py-2 text-sm font-bold shadow"
                    >
                      <FaEye /> View Reason
                    </Button>
                  )}
                  {/* Always show View Details */}
                  <Button
                    onClick={() => openModal(item)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full px-5 py-2 text-sm font-bold flex items-center gap-2 shadow"
                  >
                    <FaFileAlt /> View Details
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center">No records found.</p>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gradient-to-r from-[#211e29] to-[#19192f] text-white p-7 rounded-2xl w-11/12 max-w-lg relative shadow-2x max-h-[92vh] border border-purple-800/60">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={closeModal}
            >
              ✖
            </button>
            {renderModalContent ? (
              renderModalContent(selectedItem)
            ) : isIUser(selectedItem) ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Client Details</h2>
                <p><strong>Name:</strong> {selectedItem.name}</p>
                <p><strong>Email:</strong> {selectedItem.email}</p>
                <p><strong>Role:</strong> {selectedItem.role}</p>
                <p><strong>Joined:</strong> {selectedItem.joinedDate}</p>
                <p><strong>Verified:</strong> {selectedItem.isVerified ? "Yes" : "No"}</p>
                <p><strong>Blocked:</strong> {selectedItem.isBlocked ? "Yes" : "No"}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Tutor Application Details</h2>
                <p><strong>Name:</strong> {selectedItem.tutorId?.name}</p>
                <p><strong>Email:</strong> {selectedItem.tutorId?.email}</p>
                <p><strong>Description:</strong> {selectedItem.description}</p>
                <p><strong>Languages:</strong> {selectedItem.languages.join(", ")}</p>
                <p><strong>Education:</strong> {selectedItem.education}</p>
                <p><strong>Skills:</strong> {selectedItem.skills.join(", ")}</p>
                <p><strong>Experience Level:</strong> {selectedItem.experienceLevel}</p>
                <p><strong>Gender:</strong> {selectedItem.gender}</p>
                <p><strong>Occupation:</strong> {selectedItem.occupation}</p>
                <p><strong>Created At:</strong> {new Date(selectedItem.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Pagination */}
      {users.length > usersPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              currentPage === 1
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-purple-700 text-white hover:bg-purple-800"
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                currentPage === i + 1
                  ? "bg-yellow-400 text-black shadow-md"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              currentPage === totalPages
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-purple-700 text-white hover:bg-purple-800"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TableList;
