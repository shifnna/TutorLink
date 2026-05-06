import { useState } from "react";
import { Button } from "../../components/ui/button";
import { IUser } from "../../types/IUser";
import { ITutorApplication } from "../../types/ITutorApplication";
import { FaUserCircle, FaFileAlt } from "react-icons/fa";

interface Props {
  users: (IUser | ITutorApplication)[];
  handleToggleStatus?: (id: string) => void;
  renderModalContent?: (item: IUser | ITutorApplication) => React.ReactNode;
}

const TableList: React.FC<Props> = ({
  users,
  handleToggleStatus,
  renderModalContent,
}) => {
  const [page, setPage] = useState<number>(1);
  const [modalItem, setModalItem] = useState<IUser | ITutorApplication | null>(null);

  const perPage = 5;
  const totalPages = Math.ceil(users.length / perPage);
  const list = users.slice((page - 1) * perPage, page * perPage);

  /* TYPE GUARD */
  const isApplication = (
    item: IUser | ITutorApplication
  ): item is ITutorApplication => {
    return "_id" in item && "tutorId" in item;
  };

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
              className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="flex gap-4 items-center">
                {image ? (
                  <img
                    src={image}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-slate-300" />
                )}

                <div>
                  <p className="font-bold text-slate-800">{name}</p>
                  <p className="text-sm text-slate-500">{email}</p>

                  {!app && (
                    <p className="text-xs text-slate-400">
                      Joined: {item.joinedDate}
                    </p>
                  )}

                  {app && (
                    <p className="text-xs text-slate-400">
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
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.isBlocked ? "Blocked" : "Active"}
                    </span>

                    <Button
                      onClick={() => handleToggleStatus(item.id)}
                      className={
                        item.isBlocked
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {item.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </>
                )}

                {/* APPLICATION VIEW BUTTON */}
                {app && renderModalContent && (
                  <Button
                    onClick={() => setModalItem(item)}
                    className="bg-indigo-600 text-white flex gap-2"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl relative">
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-3 right-4 text-xl"
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
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default TableList;