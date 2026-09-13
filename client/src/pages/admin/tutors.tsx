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

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

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

    const [debouncedSearch, setDebouncedSearch] = useState<string>("");


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

        } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("failed to fetch tutors",error.message);
  } else {
    console.error(error);
  }
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

      } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("failed to update tutor",error.message);
  } else {
    console.error(error);
  }

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
              debouncedSearch.toLowerCase();

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
      debouncedSearch,
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

    const navigate = useNavigate();
  return (
    <div className="relative px-10 py-10 bg-[#0E1016] text-[#F3F4F8] min-h-screen overflow-hidden">

      {/* background glow — matches Home / ExploreTutors */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }}
        />
      </div>

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
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2" style={mono}>Admin</p>

            <h1 className="text-4xl font-extrabold" style={fraunces}>
              Tutors
            </h1>

            <p className="text-[#9CA1B5] mt-1">
              Manage and monitor all registered tutors
            </p>
          </div>

          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] rounded-xl font-bold hover:scale-105 transition"
        onClick={()=>navigate("/admin-dashboard")}>
          <FaArrowLeft />Back to Dashboard
        </Button>
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
          className="bg-[#171A24] rounded-3xl border border-[#2A2E3D] shadow-sm p-6"
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
              className="border border-[#2A2E3D] rounded-xl px-4 py-3 bg-[#0E1016] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
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
              className="border border-[#2A2E3D] rounded-xl px-4 py-3 bg-[#0E1016] text-[#F3F4F8] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
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
          className="bg-[#171A24] rounded-3xl p-8 shadow-sm border border-[#2A2E3D]"
        >

          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold" style={fraunces}>
                Tutor List
              </h2>

              <p className="text-sm text-[#9CA1B5] mt-1">
                {
                  filteredTutors.length
                } tutors found
              </p>
            </div>

            <div className="text-sm text-[#6B7185]" style={mono}>
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
                className="flex items-center gap-2 px-4 py-2 border border-[#2A2E3D] rounded-xl text-[#F3F4F8] hover:border-[#7C9CFF] transition disabled:opacity-50"
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
                            ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016]"
                            : "bg-[#1E2230] text-[#9CA1B5] hover:text-[#F3F4F8]"
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
                className="flex items-center gap-2 px-4 py-2 border border-[#2A2E3D] rounded-xl text-[#F3F4F8] hover:border-[#7C9CFF] transition disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center">

          <div className="bg-[#171A24] rounded-3xl shadow-xl p-8 w-[360px] text-center border border-[#2A2E3D]">

            <h2 className="text-xl font-bold text-[#F3F4F8] mb-4" style={fraunces}>
              Confirm Action
            </h2>

            <p className="text-[#9CA1B5] mb-6">
              Are you sure you want to change this tutor’s status?
            </p>

            <div className="flex justify-center gap-4">

              <Button
                onClick={
                  handleToggleStatus
                }
                className="bg-red-600 hover:bg-red-500 text-white"
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
                className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]"
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