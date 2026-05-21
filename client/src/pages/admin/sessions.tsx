import { useEffect, useMemo, useState } from "react";

import { toast, Toaster } from "react-hot-toast";

import Header from "../../components/adminCommon/header";

import SearchBar from "../../components/adminCommon/searchBar";

import { Button } from "../../components/ui/button";

import { adminService } from "../../services/adminService";

import {
  FaVideo,
  FaCopy,
  FaChalkboardTeacher,
  FaUser,
} from "react-icons/fa";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

  const [search, setSearch] =
    useState<string>("");

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

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load sessions"
        );
      }
    };

  /* ================= GENERATE LINK ================= */

  const handleGenerateLink =
    async (
      sessionId: string
    ): Promise<void> => {

      try {

        const res =
          await adminService.generateVideoLink(
            sessionId
          );

        if (res.success) {

          toast.success(
            "Video link generated"
          );

          await loadSessions();
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to generate link"
        );
      }
    };

  /* ================= FILTER + SORT ================= */

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
            search.toLowerCase();

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
      search,
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
    <div className="px-10 py-10 bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto space-y-8">

        <Header name="Sessions" />

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">

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
                placeholder="Search tutor, student or status..."
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
              className="border rounded-xl px-4 py-2"
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
              className="border rounded-xl px-4 py-2"
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
              className="border rounded-xl px-4 py-2"
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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Session List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {
                  filteredSessions.length
                } sessions found
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Page {currentPage} of{" "}
              {totalPages || 1}
            </div>

          </div>

          {/* LIST */}
          {paginatedSessions.map(
            (session) => (

              <div
                key={session._id}
                className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100"
              >

                {/* LEFT */}
                <div className="space-y-2 xl:w-1/3">

                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <FaChalkboardTeacher className="text-indigo-500" />

                    {
                      session.tutorId
                        ?.tutorId
                        ?.name
                    }
                  </p>

                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FaUser />

                    {
                      session.userId
                        ?.name
                    }
                  </p>

                  <p className="text-xs text-slate-400">
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

                  {session.feedback && (

                    <p className="text-amber-500 text-sm">
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

                  <span className="px-4 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 font-semibold">
                    {
                      session.status
                    }
                  </span>

                  <p className="text-emerald-600 font-bold mt-3 text-lg">
                    ₹
                    {
                      session.amount
                    }
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {
                      session.paymentStatus
                    }
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3 xl:w-1/3 xl:justify-end">

                  {/* GENERATE */}
                  {(session.status ===
                    "Upcoming" ||
                    session.status ===
                      "Confirmed") &&
                    !session.videoRoomUrl && (

                      <Button
                        onClick={() =>
                          handleGenerateLink(
                            session._id
                          )
                        }
                        className="bg-indigo-600 text-white"
                      >
                        <FaVideo />
                        Generate
                      </Button>
                    )}

                  {/* VIDEO */}
                  {session.videoRoomUrl && (
                    <>
                      <Button
                        onClick={() => {

                          navigator.clipboard.writeText(
                            session.videoRoomUrl ||
                              ""
                          );

                          toast.success(
                            "Copied!"
                          );
                        }}
                        className="bg-emerald-600 text-white"
                      >
                        <FaCopy />
                        Copy
                      </Button>

                      <a
                        href={
                          session.videoRoomUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
                      >
                        <FaVideo />
                        Open
                      </a>
                    </>
                  )}

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
                        className="bg-green-600 text-white"
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
                        className="bg-red-600 text-white"
                      >
                        Refund
                      </Button>
                    )}

                  {/* PAID */}
                  {session.paymentStatus ===
                    "RELEASED" && (

                      <span className="text-green-600 font-semibold">
                        Paid
                      </span>
                    )}

                  {/* REFUNDED */}
                  {session.paymentStatus ===
                    "REFUNDED" && (

                      <span className="text-red-600 font-semibold">
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
                className="flex items-center gap-2 border rounded-xl px-4 py-2 disabled:opacity-50"
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
                      className={`w-10 h-10 rounded-xl font-semibold ${
                        currentPage ===
                        index + 1
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      {index + 1}
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
                className="flex items-center gap-2 border rounded-xl px-4 py-2 disabled:opacity-50"
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

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-[400px] shadow-xl">

            <h2 className="text-xl font-bold mb-4">
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
              className="w-full border p-3 rounded-xl"
            />

            <div className="flex justify-end gap-3 mt-6">

              <Button
                variant="outline"
                onClick={() =>
                  setRefundModal(
                    null
                  )
                }
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

                  } catch (error) {

                    console.error(
                      error
                    );

                    toast.error(
                      "Refund failed"
                    );
                  }
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

          <div className="bg-white p-8 rounded-3xl w-[400px] shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              Release Payment
            </h2>

            <p className="text-slate-600 mb-6">
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

                  } catch (error) {

                    console.error(
                      error
                    );

                    toast.error(
                      "Release failed"
                    );
                  }
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