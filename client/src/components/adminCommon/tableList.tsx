import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { IUser } from "../../types/IUser";
import { ITutorApplication } from "../../types/ITutorApplication";
import { FaUserCircle, FaFileAlt } from "react-icons/fa";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

interface Props {
  users: (IUser | ITutorApplication)[];
  handleToggleStatus?: (id: string) => void;
  renderModalContent?: (item: IUser | ITutorApplication) => React.ReactNode;
  onModalClose?: () => void;
}

const TableList: React.FC<Props> = ({
  users,
  handleToggleStatus,
  renderModalContent,
  onModalClose,
}) => {
  const [page, setPage] = useState<number>(1);

  const perPage = 5;
  const totalPages = Math.ceil(users.length / perPage);
  const list = users.slice((page - 1) * perPage, page * perPage);

  /* TYPE GUARD */
  const isApplication = (
    item: IUser | ITutorApplication
  ): item is ITutorApplication => {
    return "_id" in item && "tutorId" in item;
  };

  const [modalItem, setModalItem] = useState<IUser | ITutorApplication | null>(null);

  useEffect(() => {
  setModalItem(null);
}, [users]);

  return (
    <>
      <div className="space-y-4">
        {list.map((item) => {
          const app = isApplication(item);

          const id = app ? item._id : item.id;
          const name = app ? item.tutorId?.name : item.name;
          const email = app ? item.tutorId?.email : item.email;
          const image = app ? item.profileImage : item.profileImage;

          return (
            <div
              key={id}
              className="flex justify-between items-center bg-[#0E1016] border border-[#2A2E3D] rounded-2xl p-6 shadow-sm hover:border-[#7C9CFF] transition"
            >
              {/* LEFT */}
              <div className="flex gap-4 items-center">
                {image ? (
                  <img
                    src={image}
                    className="w-14 h-14 rounded-full object-cover border border-[#2A2E3D]"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-[#6B7185]" />
                )}

                <div>
                  <p className="font-bold text-[#F3F4F8]">{name}</p>
                  <p className="text-sm text-[#9CA1B5]">{email}</p>

                  {!app && (
                    <p className="text-xs text-[#6B7185]">
                      Joined: {item.joinedDate}
                    </p>
                  )}

                  {app && (
                    <p className="text-xs text-[#6B7185]">
                      Applied:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex gap-3 items-center">

                {/* USER ACTIONS */}
                {!app && handleToggleStatus && (
                  <>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.isBlocked
                          ? "bg-red-500/15 text-red-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {item.isBlocked ? "Blocked" : "Active"}
                    </span>

                    <Button
                      onClick={() => handleToggleStatus(item.id)}
                      className={
                        item.isBlocked
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-red-600 hover:bg-red-500 text-white"
                      }
                    >
                      {item.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </>
                )}

                {/* APPLICATION VIEW BUTTON */}
                {app && renderModalContent && (
                  <Button
                    onClick={() => {
                      setModalItem(item); 
                      onModalClose?.();
                    }}
                    className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold flex gap-2"
                  >
                    <FaFileAlt /> View Application
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalItem && renderModalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-[#171A24] border border-[#2A2E3D] rounded-3xl p-8 max-w-lg w-full shadow-xl relative">
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-3 right-4 text-xl text-[#9CA1B5] hover:text-[#F3F4F8] transition"
            >
              ✖
            </button>

            {renderModalContent(modalItem)}
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {users.length > perPage && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]"
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold border-transparent"
                  : "border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]"
              }
              style={page === i + 1 ? fraunces : undefined}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default TableList;