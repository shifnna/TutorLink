import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import Header from "../../components/adminCommon/header";
import SearchBar from "../../components/adminCommon/searchBar";
import { adminService } from "../../services/adminService";
import SessionDetailsModal from "../../pages/common/sessionDetailsModal";

import {
  FaUser,
} from "react-icons/fa";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

interface IUserInfo {
  _id: string;
  name: string;
  email: string;
}

interface ITutorInfo {
  tutorId: IUserInfo;
}

interface IFeedback {
  message: string;
  rating: number;
  unsatisfied: boolean;
}

type PaymentStatus =
  | "HOLD"
  | "RELEASED"
  | "REFUNDED";

interface ISession {
  _id: string;

  tutorId?: ITutorInfo | null;

  userId?: IUserInfo | null;

  date: string;

  startTime: string;

  endTime: string;

  amount: number;

  status: string;

  videoRoomUrl?: string;

  paymentStatus: PaymentStatus;

  feedback?: IFeedback;
}

type SortType =
  | "latest"
  | "oldest"
  | "amountHigh"
  | "amountLow";

type StatusFilter =
  | "all"
  | "upcoming"
  | "confirmed"
  | "completed"
  | "cancelled";

type PaymentFilter =
  | "all"
  | "hold"
  | "released"
  | "refunded";

const ITEMS_PER_PAGE = 5;

const Sessions = () => {

  const [sessions, setSessions] =
    useState<ISession[]>([]);

  const [search, setSearch] = useState<string>("");
const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const [sortType, setSortType] =
    useState<SortType>("latest");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("all");

  const [refundModal, setRefundModal] =
    useState<ISession | null>(null);

  const [confirmRelease, setConfirmRelease] =
    useState<ISession | null>(null);

  const [refundPercent, setRefundPercent] =
    useState<number>(0);

  // ADDED: View Details modal state
  const [detailsSession, setDetailsSession] =
    useState<ISession | null>(null);


    useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);

    useEffect(() => {
    const id = "tutorlink-midnight-fonts";

    if (!document.getElementById(id)) {
      const link = document.createElement("link");

      link.id = id;
      link.rel = "stylesheet";

      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";

      document.head.appendChild(link);
    }
  }, []);

  /* ================= LOAD ================= */

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions =
    async (): Promise<void> => {

      try {

        const response =
          await adminService.getAllSessions();

        if (
          response.success &&
          response.data
        ) {

          setSessions(
            response.data as ISession[]
          );
        }

      } catch (error: unknown) {

        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }

        toast.error(
          "Failed to load sessions"
        );
      }
    };


  const filteredSessions =
    useMemo(() => {

      const filtered =
        sessions.filter((session) => {

          const tutorName =
            session.tutorId
              ?.tutorId?.name
              ?.toLowerCase() || "";

          const userName =
            session.userId
              ?.name
              ?.toLowerCase() || "";

          const sessionStatus =
            session.status.toLowerCase();

          const paymentStatus =
            session.paymentStatus.toLowerCase();

          const query =
            debouncedSearch.toLowerCase();

          const matchesSearch =
            tutorName.includes(query) ||
            userName.includes(query) ||
            sessionStatus.includes(query);

          const matchesStatus =
            statusFilter === "all"
              ? true
              : sessionStatus ===
                statusFilter;

          const matchesPayment =
            paymentFilter === "all"
              ? true
              : paymentStatus ===
                paymentFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPayment
          );
        });

      filtered.sort((a, b) => {

        if (sortType === "latest") {

          return (
            new Date(
              b.date
            ).getTime() -
            new Date(
              a.date
            ).getTime()
          );
        }

        if (sortType === "oldest") {

          return (
            new Date(
              a.date
            ).getTime() -
            new Date(
              b.date
            ).getTime()
          );
        }

        if (
          sortType ===
          "amountHigh"
        ) {

          return (
            b.amount - a.amount
          );
        }

        return (
          a.amount - b.amount
        );
      });

      return filtered;

    }, [
      sessions,
      debouncedSearch,
      sortType,
      statusFilter,
      paymentFilter,
    ]);

  /* ================= PAGINATION ================= */

  const totalPages =
    Math.ceil(
      filteredSessions.length /
        ITEMS_PER_PAGE
    );

  const paginatedSessions =
    filteredSessions.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage *
        ITEMS_PER_PAGE
    );

  return (
    <div className="relative px-10 py-10 bg-[#0E1016] text-[#F3F4F8] min-h-screen overflow-hidden">

      {/* background glow — matches Home / ExploreTutors */}

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">

        <div
          className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)",
          }}
        />

      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        <Header name="Sessions" />

        {/* SEARCH + FILTERS */}

        <div className="bg-[#171A24] rounded-3xl p-6 border border-[#2A2E3D] shadow-sm">

          <div className="flex flex-col xl:flex-row gap-4">

            {/* SEARCH */}

            <div className="flex-1">

              <SearchBar
                value={search}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setStatusFilter(
                  e.target
                    .value as StatusFilter
                )
              }
              className="border border-[#2A2E3D] rounded-xl px-4 py-2 bg-[#0E1016] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
            >

              <option value="all">
                All Status
              </option>

              <option value="upcoming">
                Upcoming
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

            {/* PAYMENT */}

            <select
              value={paymentFilter}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setPaymentFilter(
                  e.target
                    .value as PaymentFilter
                )
              }
              className="border border-[#2A2E3D] rounded-xl px-4 py-2 bg-[#0E1016] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
            >

              <option value="all">
                All Payments
              </option>

              <option value="hold">
                HOLD
              </option>

              <option value="released">
                RELEASED
              </option>

              <option value="refunded">
                REFUNDED
              </option>

            </select>

            {/* SORT */}

            <select
              value={sortType}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setSortType(
                  e.target
                    .value as SortType
                )
              }
              className="border border-[#2A2E3D] rounded-xl px-4 py-2 bg-[#0E1016] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
            >

              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="amountHigh">
                Amount High
              </option>

              <option value="amountLow">
                Amount Low
              </option>

            </select>

          </div>

        </div>

        {/* SESSION CARD */}

        <div className="bg-[#171A24] rounded-3xl p-8 shadow-sm border border-[#2A2E3D] space-y-5">

          <div className="flex items-center justify-between">

            <div>

              <h2
                className="text-2xl font-bold"
                style={fraunces}
              >
                Session List
              </h2>

              <p className="text-sm text-[#9CA1B5] mt-1">

                {
                  filteredSessions.length
                } sessions found

              </p>

            </div>

            <div
              className="text-sm text-[#6B7185]"
              style={mono}
            >
              Page {currentPage} of{" "}
              {totalPages || 1}
            </div>

          </div>

          {/* LIST */}

          {paginatedSessions.map(
            (session) => (

              <div
                key={session._id}
                className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between bg-[#0E1016] p-6 rounded-2xl border border-[#2A2E3D]"
              >

                {/* LEFT */}

                <div className="space-y-2 xl:w-1/3">

                  <p className="font-semibold text-[#F3F4F8] flex items-center gap-2">

                    {
                      session.tutorId
                        ?.tutorId
                        ?.name
                    }

                  </p>

                  <p className="text-sm text-[#9CA1B5] flex items-center gap-2">

                    <FaUser />

                    {
                      session.userId
                        ?.name
                    }

                  </p>

                  <p className="text-xs text-[#6B7185]">

                    {
                      new Date(
                        session.date
                      ).toLocaleDateString()
                    }{" "}

                    —{" "}

                    {
                      session.startTime
                    }{" "}

                    to{" "}

                    {
                      session.endTime
                    }

                  </p>

                  {session?.feedback?.rating && (

                    <p className="text-amber-400 text-sm">

                      ⭐{" "}

                      {
                        session.feedback
                          .rating
                      }

                      /5

                    </p>

                  )}

                </div>

                {/* CENTER */}

                <div className="xl:w-1/4 text-center">

                  <span className="px-4 py-1 rounded-full text-xs bg-[#7C9CFF]/15 text-[#A9BCFF] font-semibold">

                    {
                      session.status
                    }

                  </span>

                  <p className="text-emerald-400 font-bold mt-3 text-lg">

                    ₹
                    {
                      session.amount
                    }

                  </p>

                  <p className="text-xs text-[#6B7185] mt-1">

                    {
                      session.paymentStatus
                    }

                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3 xl:w-1/3 xl:justify-end">

                  {/* VIEW DETAILS */}

                  <Button
                    size="sm"
                    variant="outline"
                    className="inline-flex items-center gap-1.5 border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
                    onClick={() =>
                      setDetailsSession(session)
                    }
                  >
                    View Details
                  </Button>

                  {/* {session.videoRoomUrl && (

                    <>

                      <a
                        href={
                          session.videoRoomUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#7C9CFF] hover:bg-[#8FACFF] text-[#0E1016] font-semibold px-4 py-2 rounded-lg flex gap-2 items-center transition"
                      >

                        <FaVideo />

                        Open

                      </a>

                    </>

                  )} */}

                  {/* RELEASE */}

                  {session.paymentStatus ===
                    "HOLD" &&
                    session.feedback &&
                    !session.feedback
                      .unsatisfied && (

                      <Button
                        onClick={() =>
                          setConfirmRelease(
                            session
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Release
                      </Button>

                    )}

                  {/* REFUND */}

                  {session.paymentStatus ===
                    "HOLD" &&
                    session.feedback
                      ?.unsatisfied && (

                      <Button
                        onClick={() =>
                          setRefundModal(
                            session
                          )
                        }
                        className="bg-red-600 hover:bg-red-500 text-white"
                      >
                        Refund
                      </Button>

                    )}

                  {/* PAID */}

                  {session.paymentStatus ===
                    "RELEASED" && (

                    <span className="text-emerald-400 font-semibold">
                      Paid
                    </span>

                  )}

                  {/* REFUNDED */}

                  {session.paymentStatus ===
                    "REFUNDED" && (

                    <span className="text-red-400 font-semibold">
                      Refunded
                    </span>

                  )}

                </div>

              </div>

            )
          )}

          {/* PAGINATION */}

          {totalPages > 1 && (

            <div className="flex items-center justify-between pt-4">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      prev - 1
                  )
                }
                className="flex items-center gap-2 border border-[#2A2E3D] rounded-xl px-4 py-2 text-[#F3F4F8] hover:border-[#7C9CFF] transition disabled:opacity-50"
              >

                <ChevronLeft className="w-4 h-4" />

                Previous

              </button>

              <div className="flex gap-2">

                {Array.from({
                  length:
                    totalPages,
                }).map(
                  (
                    _,
                    index
                  ) => (

                    <button
                      key={
                        index
                      }
                      onClick={() =>
                        setCurrentPage(
                          index + 1
                        )
                      }
                      className={`w-10 h-10 rounded-xl font-semibold transition ${
                        currentPage ===
                        index + 1
                          ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016]"
                          : "bg-[#1E2230] text-[#9CA1B5] hover:text-[#F3F4F8]"
                      }`}
                    >

                      {
                        index + 1
                      }

                    </button>

                  )
                )}

              </div>

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      prev + 1
                  )
                }
                className="flex items-center gap-2 border border-[#2A2E3D] rounded-xl px-4 py-2 text-[#F3F4F8] hover:border-[#7C9CFF] transition disabled:opacity-50"
              >

                Next

                <ChevronRight className="w-4 h-4" />

              </button>

            </div>

          )}

        </div>

      </div>

      {/* REFUND MODAL */}

      {refundModal && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#171A24] border border-[#2A2E3D] p-8 rounded-3xl w-[400px] shadow-xl">

            <h2
              className="text-xl font-bold text-[#F3F4F8] mb-4"
              style={fraunces}
            >
              Refund Amount
            </h2>

            <input
              type="number"
              value={refundPercent}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>
                setRefundPercent(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full border border-[#2A2E3D] p-3 rounded-xl bg-[#0E1016] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
            />

            <div className="flex justify-end gap-3 mt-6">

              <Button
                variant="outline"
                onClick={() =>
                  setRefundModal(
                    null
                  )
                }
                className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]"
              >
                Cancel
              </Button>

              <Button
                onClick={async () => {

                  try {

                    await adminService.refundAmount(
                      refundModal._id,
                      refundPercent
                    );

                    toast.success(
                      "Refund processed"
                    );

                    setRefundModal(
                      null
                    );

                    await loadSessions();

                  } catch (error: unknown) {

                    if (error instanceof Error) {
                      console.error(
                        error.message
                      );
                    } else {
                      console.error(
                        error
                      );
                    }

                    toast.error(
                      "Refund failed"
                    );
                  }

                }}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Confirm
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* RELEASE MODAL */}

      {confirmRelease && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#171A24] border border-[#2A2E3D] p-8 rounded-3xl w-[400px] shadow-xl">

            <h2
              className="text-xl font-bold text-[#F3F4F8] mb-4"
              style={fraunces}
            >
              Release Payment
            </h2>

            <p className="text-[#9CA1B5] mb-6">

              Release ₹
              {
                confirmRelease.amount
              }{" "}
              to tutor?

            </p>

            <div className="flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  setConfirmRelease(
                    null
                  )
                }
                className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]"
              >
                Cancel
              </Button>

              <Button
                onClick={async () => {

                  try {

                    await adminService.releasePayment(
                      confirmRelease._id
                    );

                    toast.success(
                      "Payment released"
                    );

                    setConfirmRelease(
                      null
                    );

                    await loadSessions();

                  } catch (error: unknown) {

                    if (error instanceof Error) {
                      console.error(
                        error.message
                      );
                    } else {
                      console.error(
                        error
                      );
                    }

                    toast.error(
                      "Release failed"
                    );
                  }

                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Confirm
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* SESSION DETAILS MODAL */}

      <SessionDetailsModal
        session={detailsSession}
        onClose={() =>
          setDetailsSession(null)
        }
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#171A24",
            color: "#F3F4F8",
            border: "1px solid #2A2E3D",
          },
        }}
      />

    </div>
  );
};

export default Sessions;