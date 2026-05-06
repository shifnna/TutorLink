import { useEffect, useState } from "react";
import Header from "../../components/adminCommon/header";
import { toast, Toaster } from "react-hot-toast";
import SearchBar from "../../components/adminCommon/searchBar";
import { Button } from "../../components/ui/button";
import { adminService } from "../../services/adminService";
import { FaVideo, FaCopy, FaChalkboardTeacher, FaUser } from "react-icons/fa";

interface ISession {
  _id: string;
  tutorId?: { tutorId: { _id: string; name: string; email: string } } | null;
  userId?: { _id: string; name: string; email: string } | null;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: string;
  videoRoomUrl?: string;
  paymentStatus: "HOLD" | "RELEASED" | "REFUNDED";
  feedback?: {
    message: string;
    rating: number;
    unsatisfied: boolean;
  };
}

const Sessions = () => {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [search, setSearch] = useState("");

  const [refundModal, setRefundModal] = useState<ISession | null>(null);
  const [confirmRelease, setConfirmRelease] = useState<ISession | null>(null);
  const [refundPercent, setRefundPercent] = useState<number>(0);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await adminService.getAllSessions();
      if (response.success) setSessions(response.data as ISession[]);
    } catch {
      toast.error("Failed to load sessions");
    }
  };

  const handleGenerateLink = async (sessionId: string) => {
    try {
      const res = await adminService.generateVideoLink(sessionId);
      if (res.success) {
        toast.success("Video call link generated!");
        loadSessions();
      }
    } catch {
      toast.error("Error generating link");
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const tutor = s.tutorId?.tutorId.name.toLowerCase() ?? "";
    const user = s.userId?.name.toLowerCase() ?? "";
    const status = s.status.toLowerCase();

    return (
      tutor.includes(search.toLowerCase()) ||
      user.includes(search.toLowerCase()) ||
      status.includes(search.toLowerCase())
    );
  });

  return (
    <div className="px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <Header name="Sessions" />

        <SearchBar
          value={search}
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  setSearch(e.target.value)
}          
placeholder="Search tutor, student or status..."
        />

        {/* SESSION LIST CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-5">

          {filteredSessions.map((session) => (
            <div
              key={session._id}
              className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="space-y-1 w-1/3">
                <p className="font-semibold text-slate-800 flex gap-2 items-center">
                  <FaChalkboardTeacher className="text-indigo-500" />
                  {session.tutorId?.tutorId.name}
                </p>

                <p className="text-sm text-slate-500 flex gap-2 items-center">
                  <FaUser />
                  {session.userId?.name}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(session.date).toLocaleDateString()} — {session.startTime} to {session.endTime}
                </p>

                {session.feedback && (
                  <p className="text-amber-500 text-sm">
                    ⭐ {session.feedback.rating}/5
                  </p>
                )}
              </div>

              {/* CENTER */}
              <div className="text-center w-1/3">
                <span className="px-4 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 font-semibold">
                  {session.status}
                </span>
                <p className="text-emerald-600 font-bold mt-2">
                  ₹{session.amount}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 w-1/3 justify-end">

                {session.status === "Confirmed" && !session.videoRoomUrl && (
                  <Button
                    onClick={() => handleGenerateLink(session._id)}
                    className="bg-indigo-600 text-white"
                  >
                    <FaVideo /> Generate
                  </Button>
                )}

                {session.videoRoomUrl && (
                  <>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(session.videoRoomUrl!);
                        toast.success("Copied!");
                      }}
                      className="bg-emerald-600 text-white"
                    >
                      <FaCopy /> Copy
                    </Button>

                    <a
                      href={session.videoRoomUrl}
                      target="_blank"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
                    >
                      <FaVideo /> Open
                    </a>
                  </>
                )}

                {session.paymentStatus === "HOLD" && (
                  <>
                    {session.feedback && !session.feedback.unsatisfied && (
                      <Button
                        onClick={() => setConfirmRelease(session)}
                        className="bg-green-600 text-white"
                      >
                        Release
                      </Button>
                    )}

                    {session.feedback?.unsatisfied && (
                      <Button
                        onClick={() => setRefundModal(session)}
                        className="bg-red-600 text-white"
                      >
                        Refund
                      </Button>
                    )}
                  </>
                )}

                {session.paymentStatus === "RELEASED" && (
                  <span className="text-green-600 font-semibold">
                    Paid
                  </span>
                )}

                {session.paymentStatus === "REFUNDED" && (
                  <span className="text-red-600 font-semibold">
                    Refunded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REFUND MODAL */}
      {refundModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[400px] shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Refund Amount</h2>

            <input
              type="number"
              value={refundPercent}
              onChange={(e) => setRefundPercent(Number(e.target.value))}
              className="w-full border p-3 rounded-lg"
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => setRefundModal(null)} variant="outline">
                Cancel
              </Button>

              <Button
                onClick={async () => {
                  await adminService.refundAmount(refundModal._id, refundPercent);
                  toast.success("Refund processed");
                  setRefundModal(null);
                  loadSessions();
                }}
                className="bg-red-600 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RELEASE MODAL */}
      {confirmRelease && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[400px] shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              Release Payment
            </h2>

            <p className="text-slate-600 mb-6">
              Release ₹{confirmRelease.amount} to tutor?
            </p>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setConfirmRelease(null)} variant="outline">
                Cancel
              </Button>

              <Button
                onClick={async () => {
                  await adminService.releasePayment(confirmRelease._id);
                  toast.success("Payment released");
                  setConfirmRelease(null);
                  loadSessions();
                }}
                className="bg-green-600 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Sessions;