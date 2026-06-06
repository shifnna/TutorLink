import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import { ITutorApplication } from "../../types/ITutorApplication";
import { adminService } from "../../services/adminService";

import SearchBar from "../../components/adminCommon/searchBar";
import TableList from "../../components/adminCommon/tableList";

interface IConfirmModal {
  isOpen: boolean;
  type: "approve" | "reject" | null;
  userId: string | null;
}

interface IReasonModal {
  isOpen: boolean;
  message: string;
}

type FilterStatus =
  | "all"
  | "pending"
  | "rejected";

type SortType =
  | "latest"
  | "oldest"
  | "az"
  | "za";

const ITEMS_PER_PAGE = 5;

const TutorApplications: React.FC = () => {

  const [applications, setApplications] =
    useState<ITutorApplication[]>([]);

  const [search, setSearch] =
    useState<string>("");

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>("all");

  const [sortType, setSortType] =
    useState<SortType>("latest");

  const [reasonModal, setReasonModal] =
    useState<IReasonModal>({
      isOpen: false,
      message: "",
    });

  const [confirmModal, setConfirmModal] =
    useState<IConfirmModal>({
      isOpen: false,
      type: null,
      userId: null,
    });

  const [rejectReason, setRejectReason] =
    useState<string>("");

  useEffect(() => {

    const fetchApplications =
      async (): Promise<void> => {

        try {

          const res =
            await adminService.getAllTutorApplications();

          if (
            res.success &&
            res.data
          ) {

            setApplications(
              res.data
            );
          }

        } catch (error) {

          console.error(error);

          toast.error(
            "Failed to fetch applications"
          );
        }
      };

    fetchApplications();

  }, []);

  const refreshList =
    async (): Promise<void> => {

      try {

        const updated =
          await adminService.getAllTutorApplications();

        setApplications(
          updated.success &&
          updated.data
            ? updated.data
            : []
        );

      } catch (error) {

        console.error(error);
      }
    };

  const handleApprove =
    async (): Promise<void> => {

      if (!confirmModal.userId)
        return;

      try {

        const res =
          await adminService.approveTutor(
            confirmModal.userId
          );

        if (res.success) {

          toast.success(
            "Tutor approved successfully!"
          );

          await refreshList();
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to approve tutor"
        );

      } finally {

        setConfirmModal({
          isOpen: false,
          type: null,
          userId: null,
        });
      }
    };

  const handleReject =
    async (): Promise<void> => {

      if (
        !confirmModal.userId ||
        !rejectReason.trim()
      ) {

        toast.error(
          "Enter rejection reason"
        );

        return;
      }

      try {

        const res =
          await adminService.rejectTutor(
            confirmModal.userId,
            rejectReason
          );

        if (res.success) {

          toast.success(
            "Tutor rejected successfully!"
          );

          await refreshList();
        }

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to reject tutor"
        );

      } finally {

        setRejectReason("");

        setConfirmModal({
          isOpen: false,
          type: null,
          userId: null,
        });
      }
    };

  const filteredApplications =
    useMemo(() => {

      const filtered =
        applications.filter((app) => {

          const name =
            app.tutorId?.name?.toLowerCase() ||
            "";

          const email =
            app.tutorId?.email?.toLowerCase() ||
            "";

          const status =
            app.tutorId
              ?.tutorApplication
              ?.status || "Pending";

          const matchesSearch =
            name.includes(
              search.toLowerCase()
            ) ||
            email.includes(
              search.toLowerCase()
            );

          const matchesStatus =
            filterStatus === "all"
              ? true
              : status.toLowerCase() ===
                filterStatus;

          return (
            matchesSearch &&
            matchesStatus
          );
        });

      filtered.sort((a, b) => {

        const dateA =
          new Date(
            a.createdAt || ""
          ).getTime();

        const dateB =
          new Date(
            b.createdAt || ""
          ).getTime();

        if (sortType === "latest") {
          return dateB - dateA;
        }

        if (sortType === "oldest") {
          return dateA - dateB;
        }

        if (sortType === "az") {

          return (
            a.tutorId?.name || ""
          ).localeCompare(
            b.tutorId?.name || ""
          );
        }

        if (sortType === "za") {

          return (
            b.tutorId?.name || ""
          ).localeCompare(
            a.tutorId?.name || ""
          );
        }

        return 0;
      });

      return filtered;

    }, [
      applications,
      search,
      filterStatus,
      sortType,
    ]);

  const totalPages =
    Math.ceil(
      filteredApplications.length /
      ITEMS_PER_PAGE
    );

  const paginatedApplications =
    filteredApplications.slice(
      (currentPage - 1) *
      ITEMS_PER_PAGE,

      currentPage *
      ITEMS_PER_PAGE
    );

  return (
    <div className="px-10 py-10 bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto space-y-8">

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <h1 className="text-4xl font-black text-slate-900">
            Tutor Applications
          </h1>

          <p className="text-slate-500 mt-1">
            Review and manage tutor requests
          </p>

        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
        >

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

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
                placeholder="Search by name or email..."
              />
            </div>

            <div className="flex gap-3 flex-wrap">

              <div className="relative">

                <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />

                <select
                  value={
                    filterStatus
                  }
                  onChange={(
                    e: React.ChangeEvent<HTMLSelectElement>
                  ) =>
                    setFilterStatus(
                      e.target.value as FilterStatus
                    )
                  }
                  className="border rounded-xl pl-9 pr-4 py-2 bg-white text-sm"
                >
                  <option value="all">
                    All
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>
              </div>

              <select
                value={sortType}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>
                ) =>
                  setSortType(
                    e.target.value as SortType
                  )
                }
                className="border rounded-xl px-4 py-2 bg-white text-sm"
              >
                <option value="latest">
                  Latest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="az">
                  A-Z
                </option>

                <option value="za">
                  Z-A
                </option>
              </select>

            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Applications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredApplications.length} applications found
              </p>

            </div>

            <div className="text-sm text-slate-400">
              Page {currentPage} of {totalPages || 1}
            </div>

          </div>

          <TableList
            users={paginatedApplications}

           renderModalContent={(item) => {

  const tutor =
    item as ITutorApplication;

  return (

    <div className="max-h-[85vh] overflow-y-auto pr-2">

      <div className="space-y-6 text-slate-700">

        <h2 className="text-2xl font-bold text-slate-900">
          Tutor Application
        </h2>

        <div className="flex gap-5">

          <a
            href={tutor.profileImage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >

            <img
              src={tutor.profileImage}
              alt="Tutor"
              className="w-28 h-28 rounded-2xl object-cover border border-slate-200 hover:opacity-90 transition"
            />

          </a>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-1">

            <p>
              <b>Name:</b>{" "}
              {tutor.tutorId?.name}
            </p>

            <p>
              <b>Email:</b>{" "}
              {tutor.tutorId?.email}
            </p>

            <p>
              <b>Education:</b>{" "}
              {tutor.education}
            </p>

            <p>
              <b>Experience:</b>{" "}
              {tutor.experienceLevel}
            </p>

            <p>
              <b>Occupation:</b>{" "}
              {tutor.occupation}
            </p>

            <p>
              <b>Gender:</b>{" "}
              {tutor.gender}
            </p>

            <p className="col-span-2">
              <b>Languages:</b>{" "}
              {Array.isArray(tutor.languages)
                ? tutor.languages.join(", ")
                : tutor.languages}
            </p>

            <p className="col-span-2">
              <b>Skills:</b>{" "}
              {Array.isArray(tutor.skills)
                ? tutor.skills.join(", ")
                : tutor.skills}
            </p>

          </div>

        </div>

        <div>

          <p className="font-semibold text-slate-900 mb-2">
            Description
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm leading-relaxed">
            {tutor.description}
          </div>

        </div>

        <div>

          <p className="font-semibold text-slate-900 mb-3">
            Certificates
          </p>

          {!tutor.certificates?.length ? (

            <p className="text-slate-500 text-sm">
              No certificates uploaded
            </p>

          ) : (

            <div className="flex flex-wrap gap-3">

              {tutor.certificates.map(
                (
                  certificate: string,
                  index: number
                ) => (

                  <a
                    key={index}
                    href={certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-medium transition"
                  >
                    Certificate {index + 1}
                  </a>
                )
              )}

            </div>
          )}

        </div>

        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">

          <button
            onClick={() =>
              setConfirmModal({
                isOpen: true,
                type: "approve",
                userId:
                  tutor.tutorId?._id ||
                  tutor._id,
              })
            }
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
          >
            Approve
          </button>

          <button
            onClick={() =>
              setConfirmModal({
                isOpen: true,
                type: "reject",
                userId:
                  tutor.tutorId?._id ||
                  tutor._id,
              })
            }
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}}

            
          />

          {totalPages > 1 && (

            <div className="flex items-center justify-between mt-8">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev - 1
                  )
                }
                className="flex items-center gap-2 px-4 py-2 border rounded-xl disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-2">

                {Array.from({
                  length: totalPages,
                }).map(
                  (_, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        setCurrentPage(
                          index + 1
                        )
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-semibold ${
                        currentPage === index + 1
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}

              </div>

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev + 1
                  )
                }
                className="flex items-center gap-2 px-4 py-2 border rounded-xl disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}
        </motion.div>
      </div>

      {confirmModal.isOpen && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl w-[400px] p-8 shadow-xl">

            {confirmModal.type === "approve" ? (

              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Approve Tutor
                </h2>

                <p className="text-slate-500 mb-6">
                  Are you sure you want to approve this tutor?
                </p>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() =>
                      setConfirmModal({
                        isOpen: false,
                        type: null,
                        userId: null,
                      })
                    }
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl"
                  >
                    Confirm
                  </button>

                </div>
              </>

            ) : (

              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Reject Tutor
                </h2>

                <textarea
                  value={rejectReason}
                  onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement>
                  ) =>
                    setRejectReason(
                      e.target.value
                    )
                  }
                  placeholder="Enter rejection reason..."
                  className="w-full border rounded-xl p-3 min-h-[120px] mb-5"
                />

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() =>
                      setConfirmModal({
                        isOpen: false,
                        type: null,
                        userId: null,
                      })
                    }
                    className="px-4 py-2 border rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl"
                  >
                    Confirm
                  </button>

                </div>
              </>
            )}
          </div>
        </div>
      )}

      {reasonModal.isOpen && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl w-[400px] p-8 shadow-xl">

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Rejection Reason
            </h2>

            <p className="text-slate-600">
              {reasonModal.message}
            </p>

            <button
              onClick={() =>
                setReasonModal({
                  isOpen: false,
                  message: "",
                })
              }
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default TutorApplications;