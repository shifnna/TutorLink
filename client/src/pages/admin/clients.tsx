import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, UserCheck, UserX } from "lucide-react";
import { IUser } from "../../types/IUser";
import { adminService } from "../../services/adminService";
import { useDebounce } from "../../hooks/useDebounce";
import Header from "../../components/adminCommon/header";
import SearchBar from "../../components/adminCommon/searchBar";
import StatCard from "../../components/adminCommon/statCard";
import StatusBadge from "../../components/adminCommon/statusBadge";
import { FilterBar, FilterSelect } from "../../components/adminCommon/filterSelect";
import { ConfirmDialog } from "../../components/adminCommon/modal";
import { Column, DataTable, Pagination, TableCard, UserCell } from "../../components/adminCommon/dataTable";
import { Button } from "../../components/ui/button";

const USERS_PER_PAGE = 5;

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
            joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Unknown",
            createdAt: u.createdAt,
            profileImage: u.profileImage || null,
            tutorProfile: u.tutorProfile || null,
          }))
        );
        setTotalCount(res.data.total);
      }
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Failed to load clients");
    }
  }, [debouncedSearch, statusFilter, sortOrder, currentPage]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sortOrder]);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleConfirm = async () => {
    if (!selectedUserId) return;
    setBusy(true);
    try {
      const res = await adminService.toggleUserStatus(selectedUserId);
      if (res.data) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUserId ? { ...u, isBlocked: res.data.isBlocked } : u)));
        toast.success(res.data.isBlocked ? "Client blocked" : "Client unblocked");
      }
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Could not update status");
    } finally {
      setBusy(false);
      setSelectedUserId(null);
    }
  };

  const columns: Column<IUser>[] = [
    { key: "client", header: "Client", render: (u) => <UserCell name={u.name} sub={u.email} image={u.profileImage} /> },
    {
      key: "status",
      header: "Account status",
      render: (u) => <StatusBadge label={u.isBlocked ? "Blocked" : "Active"} tone={u.isBlocked ? "red" : "green"} />,
    },
    {
      key: "verified",
      header: "Email verified",
      render: (u) => <StatusBadge label={u.isVerified ? "Verified" : "Not verified"} tone={u.isVerified ? "blue" : "gray"} />,
    },
    { key: "joined", header: "Joined on", render: (u) => u.joinedDate },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (u) => (
        <Button
          onClick={() => setSelectedUserId(u.id)}
          className={`rounded-lg px-4 h-9 text-sm font-medium text-white ${u.isBlocked ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"}`}
        >
          {u.isBlocked ? "Unblock" : "Block"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Header title="Clients" subtitle="Manage all registered clients" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Matching clients" value={totalCount} icon={Users} tone="blue" />
        <StatCard label="Active on this page" value={users.filter((u) => !u.isBlocked).length} icon={UserCheck} tone="green" />
        <StatCard label="Blocked on this page" value={users.filter((u) => u.isBlocked).length} icon={UserX} tone="amber" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All clients" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
        />
        <FilterSelect
          label="Sort by"
          value={sortOrder}
          onChange={setSortOrder}
          options={[
            { value: "latest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "az", label: "Name A–Z" },
            { value: "za", label: "Name Z–A" },
          ]}
        />
      </FilterBar>

      <TableCard title="Client list" subtitle={`${totalCount} clients found`}>
        <DataTable
          columns={columns}
          rows={users}
          rowKey={(u) => u.id}
          emptyTitle="No clients found"
        />
        <Pagination page={currentPage} perPage={USERS_PER_PAGE} total={totalCount} onChange={setCurrentPage} />
      </TableCard>

      <ConfirmDialog
        open={!!selectedUserId}
        title={selectedUser?.isBlocked ? "Unblock client" : "Block client"}
        message={
          <>
            Are you sure you want to {selectedUser?.isBlocked ? "unblock" : "block"}{" "}
            <b className="text-[#F3F4F8]">{selectedUser?.name}</b>?
          </>
        }
        tone={selectedUser?.isBlocked ? "success" : "danger"}
        confirmLabel={selectedUser?.isBlocked ? "Unblock" : "Block"}
        busy={busy}
        onConfirm={handleConfirm}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
};

export default ClientsPage;