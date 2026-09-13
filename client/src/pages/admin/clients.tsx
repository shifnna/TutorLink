import { useState, useEffect, useCallback } from "react";
import { IUser } from "../../types/IUser";
import TableList from "../../components/adminCommon/tableList";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const USERS_PER_PAGE = 5;

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const navigate = useNavigate();

  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const res = await adminService.getAllClients({
        search: debouncedSearch,
        status: statusFilter,
        sort: sortOrder,
        page: currentPage,
        limit: USERS_PER_PAGE,
      });

      if (res.success && res.data) {
        setUsers(
          res.data.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            isBlocked: u.isBlocked || false,
            isVerified: u.isVerified,
            joinedDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "Unknown",
            createdAt: u.createdAt,
            profileImage: u.profileImage || null,
            tutorProfile: u.tutorProfile || null,
          }))
        );
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  }, [debouncedSearch, statusFilter, sortOrder, currentPage]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  //// Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sortOrder]);

  const handleConfirm = async () => {
    if (!selectedUserId) return;
    try {
      const res = await adminService.toggleUserStatus(selectedUserId);
      if (res.data) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserId
              ? { ...u, isBlocked: res.data.isBlocked }
              : u
          )
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setConfirmModal(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8] px-8 py-8 overflow-hidden">

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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5]" style={mono}>Admin</p>
            <h1 className="text-4xl font-black" style={fraunces}>Clients</h1>
            <p className="text-[#9CA1B5]">Manage all registered users</p>
          </div>

          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] rounded-xl font-bold hover:scale-105 transition"
          onClick={()=>navigate("/admin-dashboard")}>
            <FaArrowLeft />Back to Dashboard
          </Button>
        </motion.div>

        {/* SEARCH + FILTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171A24] border border-[#2A2E3D] rounded-3xl shadow-sm p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-3 text-[#9CA1B5]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-[#2A2E3D] rounded-xl pl-9 pr-4 py-2 bg-[#0E1016] text-[#F3F4F8] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-[#2A2E3D] rounded-xl px-4 py-2 bg-[#0E1016] text-[#F3F4F8] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#171A24] rounded-3xl border border-[#2A2E3D] shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#2A2E3D]">
            <div>
              <h2 className="text-xl font-bold" style={fraunces}>Client List</h2>
              <p className="text-sm text-[#9CA1B5] mt-1">{totalCount} users found</p>
            </div>
            <div className="text-sm text-[#6B7185]" style={mono}>
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          <div className="p-6">
            <TableList
              users={users}
              handleToggleStatus={(id) => {
                setSelectedUserId(id);
                setConfirmModal(true);
              }}
            />
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-5 border-t border-[#2A2E3D]">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="rounded-xl border-[#2A2E3D] text-[#F3F4F8] hover:border-[#7C9CFF] hover:bg-[#1E2230]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                      currentPage === index + 1
                        ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016]"
                        : "bg-[#1E2230] text-[#9CA1B5] hover:text-[#F3F4F8]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="rounded-xl border-[#2A2E3D] text-[#F3F4F8] hover:border-[#7C9CFF] hover:bg-[#1E2230]"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* CONFIRM MODAL */}
      <Dialog open={confirmModal} onClose={() => setConfirmModal(false)}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#171A24] rounded-3xl shadow-xl p-8 w-[360px] text-center border border-[#2A2E3D]">
            <h2 className="text-xl font-bold text-[#F3F4F8] mb-3" style={fraunces}>
              Change User Status
            </h2>
            <p className="text-[#9CA1B5] text-sm mb-8">
              Are you sure you want to update this user's status?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleConfirm}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setConfirmModal(false)} className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230]">
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