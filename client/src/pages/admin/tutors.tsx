import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { GraduationCap, UserCheck, UserX } from "lucide-react";
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

type SortOption = "latest" | "oldest" | "nameAsc" | "nameDesc";
type FilterOption = "all" | "blocked" | "active";

const ITEMS_PER_PAGE = 5;

const TutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await adminService.getAllTutors();
        if (res.success && res.data) {
          setTutors(
            res.data.map((tutor): IUser => ({
              id: tutor.id,
              name: tutor.name,
              email: tutor.email,
              role: tutor.role,
              isBlocked: tutor.isBlocked || false,
              isVerified: tutor.isVerified,
              joinedDate: tutor.createdAt
                ? new Date(tutor.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "Unknown",
              createdAt: tutor.createdAt,
              profileImage: tutor.profileImage || null,
              tutorProfile: tutor.tutorProfile || null,
            }))
          );
        }
      } catch (error: unknown) {
        console.error("failed to fetch tutors", error instanceof Error ? error.message : error);
        toast.error("Failed to load tutors");
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterBy, sortBy]);

  const selectedTutor = tutors.find((t) => t.id === selectedId);

  const handleToggleStatus = async () => {
    if (!selectedId) return;
    setBusy(true);
    try {
      const updated = await adminService.toggleUserStatus(selectedId);
      if (updated.success && updated.data) {
        const isBlocked = updated.data.isBlocked ?? false;
        setTutors((prev) => prev.map((t) => (t.id === selectedId ? { ...t, isBlocked } : t)));
        toast.success(isBlocked ? "Tutor blocked" : "Tutor unblocked");
      }
    } catch (error: unknown) {
      console.error("failed to update tutor", error instanceof Error ? error.message : error);
      toast.error("Could not update status");
    } finally {
      setBusy(false);
      setSelectedId(null);
    }
  };

  const filteredTutors = useMemo(() => {
    const query = debouncedSearch.toLowerCase();

    const filtered = tutors.filter((tutor) => {
      const matchesSearch = tutor.name.toLowerCase().includes(query) || tutor.email.toLowerCase().includes(query);
      const matchesFilter = filterBy === "all" ? true : filterBy === "blocked" ? tutor.isBlocked : !tutor.isBlocked;
      return matchesSearch && matchesFilter;
    });

    const time = (u: IUser) => new Date(u.createdAt || "").getTime();
    filtered.sort((a, b) => {
      if (sortBy === "latest") return time(b) - time(a);
      if (sortBy === "oldest") return time(a) - time(b);
      if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return filtered;
  }, [tutors, debouncedSearch, filterBy, sortBy]);

  const paginated = filteredTutors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns: Column<IUser>[] = [
    { key: "tutor", header: "Tutor", render: (t) => <UserCell name={t.name} sub={t.email} image={t.profileImage} /> },
    {
      key: "status",
      header: "Account status",
      render: (t) => <StatusBadge label={t.isBlocked ? "Blocked" : "Active"} tone={t.isBlocked ? "red" : "green"} />,
    },
    {
      key: "verified",
      header: "Email verified",
      render: (t) => <StatusBadge label={t.isVerified ? "Verified" : "Not verified"} tone={t.isVerified ? "blue" : "gray"} />,
    },
    { key: "joined", header: "Joined on", render: (t) => t.joinedDate },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (t) => (
        <Button
          onClick={() => setSelectedId(t.id)}
          className={`rounded-lg px-4 h-9 text-sm font-medium text-white ${t.isBlocked ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"}`}
        >
          {t.isBlocked ? "Unblock" : "Block"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Header title="Tutors" subtitle="Manage and monitor all registered tutors" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total tutors" value={tutors.length} icon={GraduationCap} tone="purple" />
        <StatCard label="Active" value={tutors.filter((t) => !t.isBlocked).length} icon={UserCheck} tone="green" />
        <StatCard label="Blocked" value={tutors.filter((t) => t.isBlocked).length} icon={UserX} tone="amber" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" />
        <FilterSelect
          label="Status"
          value={filterBy}
          onChange={(v) => setFilterBy(v as FilterOption)}
          options={[
            { value: "all", label: "All tutors" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
        />
        <FilterSelect
          label="Sort by"
          value={sortBy}
          onChange={(v) => setSortBy(v as SortOption)}
          options={[
            { value: "latest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "nameAsc", label: "Name A–Z" },
            { value: "nameDesc", label: "Name Z–A" },
          ]}
        />
      </FilterBar>

      <TableCard title="Tutor list" subtitle={`${filteredTutors.length} tutors found`}>
        <DataTable columns={columns} rows={paginated} rowKey={(t) => t.id} emptyTitle="No tutors found" />
        <Pagination page={currentPage} perPage={ITEMS_PER_PAGE} total={filteredTutors.length} onChange={setCurrentPage} />
      </TableCard>

      <ConfirmDialog
        open={!!selectedId}
        title={selectedTutor?.isBlocked ? "Unblock tutor" : "Block tutor"}
        message={
          <>
            Are you sure you want to {selectedTutor?.isBlocked ? "unblock" : "block"}{" "}
            <b className="text-[#F3F4F8]">{selectedTutor?.name}</b>?
          </>
        }
        tone={selectedTutor?.isBlocked ? "success" : "danger"}
        confirmLabel={selectedTutor?.isBlocked ? "Unblock" : "Block"}
        busy={busy}
        onConfirm={handleToggleStatus}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default TutorsPage;