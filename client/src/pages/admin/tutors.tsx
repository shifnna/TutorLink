import { useEffect, useMemo, useState } from "react";

import TableList from "../../components/adminCommon/tableList";

import { IUser } from "../../types/IUser";

import { adminService } from "../../services/adminService";

import SearchBar from "../../components/adminCommon/searchBar";

import { Dialog } from "@headlessui/react";

import { Button } from "../../components/ui/button";

import { motion } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SortOption =
  | "latest"
  | "oldest"
  | "nameAsc"
  | "nameDesc";

type FilterOption =
  | "all"
  | "blocked"
  | "active";

interface IConfirmModal {
  open: boolean;
  id: string;
}

const ITEMS_PER_PAGE = 5;

const TutorsPage: React.FC = () => {

  const [search, setSearch] =
    useState<string>("");

  const [tutors, setTutors] =
    useState<IUser[]>([]);

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const [sortBy, setSortBy] =
    useState<SortOption>("latest");

  const [filterBy, setFilterBy] =
    useState<FilterOption>("all");

  const [confirmModal, setConfirmModal] =
    useState<IConfirmModal>({
      open: false,
      id: "",
    });

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchTutors =
      async (): Promise<void> => {

        try {

          const res =
            await adminService.getAllTutors();

          if (
            res.success &&
            res.data
          ) {

            const mappedTutors =
              res.data.map(
                (
                  tutor
                ): IUser => ({
                  id:
                    tutor.id,

                  name:
                    tutor.name,

                  email:
                    tutor.email,

                  role:
                    tutor.role,

                  isBlocked:
                    tutor.isBlocked ||
                    false,

                  isVerified:
                    tutor.isVerified,

                  joinedDate:
                    tutor.createdAt
                      ? new Date(
                          tutor.createdAt
                        ).toLocaleDateString()
                      : "Unknown",

                  createdAt:
                    tutor.createdAt,

                  profileImage:
                    tutor.profileImage ||
                    null,

                  tutorProfile:
                    tutor.tutorProfile ||
                    null,
                })
              );

            setTutors(
              mappedTutors
            );
          }

        } catch (error) {

          console.error(
            "Failed to fetch tutors:",
            error
          );
        }
      };

    fetchTutors();

  }, []);

  /* ================= BLOCK / UNBLOCK ================= */

  const handleConfirm =
    (
      id: string
    ): void => {

      setConfirmModal({
        open: true,
        id,
      });
    };

  const handleToggleStatus =
    async (): Promise<void> => {

      const id =
        confirmModal.id;

      if (!id)
        return;

      try {

        const updatedUser =
          await adminService.toggleUserStatus(
            id
          );

        if (
          updatedUser.success &&
          updatedUser.data
        ) {

          setTutors(
            (
              prev
            ): IUser[] =>
              prev.map(
                (
                  tutor
                ): IUser =>
                  tutor.id ===
                  id
                    ? {
                        ...tutor,

                        isBlocked:
                          updatedUser
                            .data
                            ?.isBlocked ??
                          false,
                      }
                    : tutor
              )
          );
        }

      } catch (error) {

        console.error(
          "Failed to update tutor:",
          error
        );

      } finally {

        setConfirmModal({
          open: false,
          id: "",
        });
      }
    };

  /* ================= FILTER + SORT ================= */

  const filteredTutors =
    useMemo(() => {

      const filtered =
        tutors.filter(
          (
            tutor
          ): boolean => {

            const query =
              search.toLowerCase();

            const matchesSearch =
              tutor.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              tutor.email
                .toLowerCase()
                .includes(
                  query
                );

            const matchesFilter =
              filterBy ===
              "all"
                ? true
                : filterBy ===
                  "blocked"
                ? tutor.isBlocked
                : !tutor.isBlocked;

            return (
              matchesSearch &&
              matchesFilter
            );
          }
        );

      filtered.sort(
        (
          a,
          b
        ): number => {

          if (
            sortBy ===
            "latest"
          ) {

            return (
              new Date(
                b.createdAt ||
                  ""
              ).getTime() -
              new Date(
                a.createdAt ||
                  ""
              ).getTime()
            );
          }

          if (
            sortBy ===
            "oldest"
          ) {

            return (
              new Date(
                a.createdAt ||
                  ""
              ).getTime() -
              new Date(
                b.createdAt ||
                  ""
              ).getTime()
            );
          }

          if (
            sortBy ===
            "nameAsc"
          ) {

            return a.name.localeCompare(
              b.name
            );
          }

          return b.name.localeCompare(
            a.name
          );
        }
      );

      return filtered;

    }, [
      tutors,
      search,
      filterBy,
      sortBy,
    ]);

  /* ================= PAGINATION ================= */

  const totalPages =
    Math.ceil(
      filteredTutors.length /
        ITEMS_PER_PAGE
    );

  const paginatedTutors =
    filteredTutors.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage *
        ITEMS_PER_PAGE
    );

  /* ================= PAGE CHANGE ================= */

  const goToPage =
    (
      page: number
    ): void => {

      setCurrentPage(
        page
      );
    };

  return (
    <div className="px-10 py-10 bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
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
          <h1 className="text-4xl font-extrabold text-slate-900">
            Tutors
          </h1>

          <p className="text-slate-500 mt-1">
            Manage and monitor all registered tutors
          </p>
        </motion.div>

        {/* FILTER CARD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
        >

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
                placeholder="Search tutors by name or email..."
              />
            </div>

            {/* FILTER */}
            <select
              value={filterBy}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setFilterBy(
                  e.target
                    .value as FilterOption
                )
              }
              className="border border-slate-200 rounded-xl px-4 py-3 bg-white"
            >
              <option value="all">
                All Tutors
              </option>

              <option value="active">
                Active
              </option>

              <option value="blocked">
                Blocked
              </option>
            </select>

            {/* SORT */}
            <select
              value={sortBy}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setSortBy(
                  e.target
                    .value as SortOption
                )
              }
              className="border border-slate-200 rounded-xl px-4 py-3 bg-white"
            >
              <option value="latest">
                Latest Joined
              </option>

              <option value="oldest">
                Oldest Joined
              </option>

              <option value="nameAsc">
                Name A-Z
              </option>

              <option value="nameDesc">
                Name Z-A
              </option>
            </select>
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >

          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Tutor List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {
                  filteredTutors.length
                } tutors found
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Page{" "}
              {currentPage} of{" "}
              {totalPages || 1}
            </div>
          </div>

          {/* TABLE COMPONENT */}
          <TableList
            users={
              paginatedTutors
            }
            handleToggleStatus={
              handleConfirm
            }
          />

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div className="flex items-center justify-between mt-8">

              {/* PREVIOUS */}
              <button
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                className="flex items-center gap-2 px-4 py-2 border rounded-xl disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* PAGE NUMBERS */}
              <div className="flex gap-2">

                {Array.from({
                  length:
                    totalPages,
                }).map(
                  (
                    _,
                    index
                  ) => {

                    const page =
                      index + 1;

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          goToPage(
                            page
                          )
                        }
                        className={`w-10 h-10 rounded-xl font-semibold transition ${
                          currentPage ===
                          page
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 hover:bg-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              {/* NEXT */}
              <button
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
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

      {/* CONFIRM MODAL */}
      <Dialog
        open={
          confirmModal.open
        }
        onClose={() =>
          setConfirmModal({
            open: false,
            id: "",
          })
        }
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center">

          <div className="bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center border border-slate-100">

            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Confirm Action
            </h2>

            <p className="text-slate-500 mb-6">
              Are you sure you want to change this tutor’s status?
            </p>

            <div className="flex justify-center gap-4">

              <Button
                onClick={
                  handleToggleStatus
                }
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setConfirmModal({
                    open: false,
                    id: "",
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TutorsPage;