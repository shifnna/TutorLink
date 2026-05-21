import { useState, useEffect, useMemo } from "react";

import { IUser } from "../../types/IUser";

import TableList from "../../components/adminCommon/tableList";

import { adminService } from "../../services/adminService";

import SearchBar from "../../components/adminCommon/searchBar";

import { Dialog } from "@headlessui/react";

import { Button } from "../../components/ui/button";

import { motion } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const ClientsPage: React.FC = () => {

  const [users, setUsers] =
    useState<IUser[]>([]);

  const [search, setSearch] =
    useState("");

  const [confirmModal, setConfirmModal] =
    useState(false);

  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  /* =========================
      FILTER / SORT
  ========================== */

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState("latest");

  /* =========================
      PAGINATION
  ========================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const USERS_PER_PAGE = 5;

  /* =========================
      FETCH USERS
  ========================== */

  useEffect(() => {

    const fetchClients =
      async () => {

        try {

          const res =
            await adminService.getAllClients();

          if (
            res.success &&
            res.data
          ) {

            setUsers(
              res.data.map((u) => ({
                id: u.id,

                name: u.name,

                email: u.email,

                role: u.role,

                isBlocked:
                  u.isBlocked || false,

                isVerified:
                  u.isVerified,

                joinedDate:
                  u.createdAt
                    ? new Date(
                        u.createdAt
                      ).toLocaleDateString()
                    : "Unknown",

                createdAt:
                  u.createdAt,

                profileImage:
                  u.profileImage || null,

                tutorProfile:
                  u.tutorProfile || null,
              }))
            );
          }

        } catch (err) {

          console.error(err);
        }
      };

    fetchClients();

  }, []);

  /* =========================
      FILTERED USERS
  ========================== */

  const filteredUsers =
    useMemo(() => {

      let filtered =
        users.filter((u) => {

          const matchesSearch =
            u.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            u.email
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            statusFilter === "all"
              ? true
              : statusFilter ===
                "blocked"
              ? u.isBlocked
              : !u.isBlocked;

          return (
            matchesSearch &&
            matchesStatus
          );
        });

      /* SORT */

      filtered.sort((a, b) => {

        const dateA =
          new Date(
            a.createdAt || ""
          ).getTime();

        const dateB =
          new Date(
            b.createdAt || ""
          ).getTime();

        if (sortOrder === "latest") {
          return dateB - dateA;
        }

        if (sortOrder === "oldest") {
          return dateA - dateB;
        }

        if (sortOrder === "az") {
          return a.name.localeCompare(
            b.name
          );
        }

        if (sortOrder === "za") {
          return b.name.localeCompare(
            a.name
          );
        }

        return 0;
      });

      return filtered;

    }, [
      users,
      search,
      statusFilter,
      sortOrder,
    ]);

  /* =========================
      PAGINATION
  ========================== */

  const totalPages =
    Math.ceil(
      filteredUsers.length /
        USERS_PER_PAGE
    );

  const paginatedUsers =
    filteredUsers.slice(
      (currentPage - 1) *
        USERS_PER_PAGE,

      currentPage *
        USERS_PER_PAGE
    );

  /* =========================
      TOGGLE USER
  ========================== */

  const handleConfirm =
    async () => {

      if (!selectedUserId)
        return;

      try {

        const res =
          await adminService.toggleUserStatus(
            selectedUserId
          );

        if (res.data) {

          setUsers((prev) =>
            prev.map((u) =>
              u.id ===
              selectedUserId
                ? {
                    ...u,
                    isBlocked:
                      res.data
                        .isBlocked,
                  }
                : u
            )
          );
        }

      } catch (err) {

        console.error(err);

      } finally {

        setConfirmModal(false);
      }
    };

  return (
    <div className="min-h-screen bg-slate-100 px-8 py-8">

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
          className="space-y-2"
        >

          <h1 className="text-4xl font-black text-slate-900">
            Clients
          </h1>

          <p className="text-slate-500">
            Manage all registered users
          </p>

        </motion.div>

        {/* SEARCH + FILTER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6"
        >

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3">

              {/* STATUS */}
              <div className="relative">

                <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />

                <select
                  value={
                    statusFilter
                  }
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="border rounded-xl pl-9 pr-4 py-2 bg-white text-sm"
                >
                  <option value="all">
                    All Users
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="blocked">
                    Blocked
                  </option>
                </select>
              </div>

              {/* SORT */}
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value
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
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >

          {/* TOP BAR */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Client List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Page {currentPage} of{" "}
              {totalPages || 1}
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="p-6">

            <TableList
              users={
                paginatedUsers
              }
              handleToggleStatus={(
                id
              ) => {

                setSelectedUserId(
                  id
                );

                setConfirmModal(
                  true
                );
              }}
            />

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">

              <Button
                variant="outline"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">

                {Array.from({
                  length:
                    totalPages,
                }).map(
                  (_, index) => (
                    <button
                      key={
                        index
                      }
                      onClick={() =>
                        setCurrentPage(
                          index + 1
                        )
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                        currentPage ===
                        index + 1
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}

              </div>

              <Button
                variant="outline"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  )
                }
                className="rounded-xl"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>

            </div>
          )}
        </motion.div>
      </div>

      {/* CONFIRM MODAL */}
      <Dialog
        open={
          confirmModal
        }
        onClose={() =>
          setConfirmModal(
            false
          )
        }
      >

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center border border-slate-100">

            <h2 className="text-xl font-bold text-slate-800 mb-3">
              Change User Status
            </h2>

            <p className="text-slate-500 text-sm mb-8">
              Are you sure you want to
              update this user's status?
            </p>

            <div className="flex gap-3 justify-center">

              <Button
                onClick={
                  handleConfirm
                }
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setConfirmModal(
                    false
                  )
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

export default ClientsPage;