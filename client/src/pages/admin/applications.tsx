import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FileText, Clock, XCircle } from "lucide-react";
import { ITutorApplication } from "../../types/ITutorApplication";
import { adminService } from "../../services/adminService";
import Header from "../../components/adminCommon/header";
import SearchBar from "../../components/adminCommon/searchBar";
import StatCard from "../../components/adminCommon/statCard";
import StatusBadge from "../../components/adminCommon/statusBadge";
import { FilterBar, FilterSelect } from "../../components/adminCommon/filterSelect";
import { ConfirmDialog, Modal } from "../../components/adminCommon/modal";
import { Column, DataTable, Pagination, TableCard, UserCell } from "../../components/adminCommon/dataTable";
import { Button } from "../../components/ui/button";
import { useDebounce } from "../../hooks/useDebounce";

type FilterStatus = "all" | "pending" | "rejected";
type SortType = "latest" | "oldest" | "az" | "za";

const ITEMS_PER_PAGE = 5;

const getStatus = (app: ITutorApplication) => app.tutorId?.tutorApplication?.status || "Pending";
const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-[#6B7185] mb-1" >{label}</p>
    <p className="text-sm text-[#F3F4F8]">{value || "—"}</p>
  </div>
);

const join = (v?: string[] | string) => (Array.isArray(v) ? v.join(", ") : v);

const TutorApplications: React.FC = () => {
  const [applications, setApplications] = useState<ITutorApplication[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortType, setSortType] = useState<SortType>("latest");

  const [viewing, setViewing] = useState<ITutorApplication | null>(null);
  const [action, setAction] = useState<{ type: "approve" | "reject"; userId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const loadApplications = async () => {
    try {
      const res = await adminService.getAllTutorApplications();
      setApplications(res.success && res.data ? res.data : []);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, sortType]);

  const closeAction = () => {
    setAction(null);
    setRejectReason("");
  };

  const handleApprove = async () => {
    if (!action) return;
    setBusy(true);
    try {
      const res = await adminService.approveTutor(action.userId);
      if (res.success) {
        toast.success("Tutor approved successfully!");
        setViewing(null);
        await loadApplications();
      }
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Failed to approve tutor");
    } finally {
      setBusy(false);
      closeAction();
    }
  };

  const handleReject = async () => {
    if (!action || !rejectReason.trim()) {
      toast.error("Enter rejection reason");
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.rejectTutor(action.userId, rejectReason);
      if (res.success) {
        toast.success("Tutor rejected successfully!");
        setViewing(null);
        await loadApplications();
      }
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Failed to reject tutor");
    } finally {
      setBusy(false);
      closeAction();
    }
  };

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase();

    const list = applications.filter((app) => {
      const name = app.tutorId?.name?.toLowerCase() || "";
      const email = app.tutorId?.email?.toLowerCase() || "";
      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesStatus = filterStatus === "all" || getStatus(app).toLowerCase() === filterStatus;
      return matchesSearch && matchesStatus;
    });

    const time = (a: ITutorApplication) => new Date(a.createdAt || "").getTime();
    const name = (a: ITutorApplication) => a.tutorId?.name || "";
    list.sort((a, b) => {
      if (sortType === "latest") return time(b) - time(a);
      if (sortType === "oldest") return time(a) - time(b);
      if (sortType === "az") return name(a).localeCompare(name(b));
      return name(b).localeCompare(name(a));
    });

    return list;
  }, [applications, debouncedSearch, filterStatus, sortType]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const pendingCount = applications.filter((a) => getStatus(a) === "Pending").length;
  const rejectedCount = applications.filter((a) => getStatus(a) === "Rejected").length;

  const columns: Column<ITutorApplication>[] = [
    {
      key: "applicant",
      header: "Applicant",
      render: (a) => <UserCell name={a.tutorId?.name} sub={a.tutorId?.email} image={a.profileImage} />,
    },
    { key: "education", header: "Education", render: (a) => a.education || "—" },
    { key: "experience", header: "Experience", render: (a) => a.experienceLevel || "—" },
    { key: "applied", header: "Applied on", render: (a) => <span className="whitespace-nowrap">{formatDate(a.createdAt)}</span> },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge label={getStatus(a)} tone={getStatus(a) === "Rejected" ? "red" : "amber"} />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (a) => (
        <Button
          onClick={() => setViewing(a)}
          className="rounded-lg px-4 h-9 text-sm bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold hover:scale-[1.03] transition"
        >
          Review
        </Button>
      ),
    },
  ];

  const userIdOf = (a: ITutorApplication) => a.tutorId?._id || a._id;

  return (
    <div className="space-y-6">
      <Header title="Tutor Applications" subtitle="Review and manage tutor requests" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total applications" value={applications.length} icon={FileText} tone="blue" />
        <StatCard label="Pending review" value={pendingCount} icon={Clock} tone="amber" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} tone="purple" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by applicant name or email" />
        <FilterSelect
          label="Status"
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as FilterStatus)}
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
        <FilterSelect
          label="Sort by"
          value={sortType}
          onChange={(v) => setSortType(v as SortType)}
          options={[
            { value: "latest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "az", label: "Name A–Z" },
            { value: "za", label: "Name Z–A" },
          ]}
        />
      </FilterBar>

      <TableCard title="Applications" subtitle={`${filtered.length} applications found`}>
        <DataTable columns={columns} rows={paginated} rowKey={(a) => a._id} emptyTitle="No applications found" />
        <Pagination page={currentPage} perPage={ITEMS_PER_PAGE} total={filtered.length} onChange={setCurrentPage} />
      </TableCard>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Tutor application" width="max-w-2xl">
        {viewing && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <a href={viewing.profileImage} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <img
                  src={viewing.profileImage}
                  alt={viewing.tutorId?.name || "Tutor"}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#2A2E3D] hover:opacity-90 transition"
                />
              </a>
              <div className="min-w-0">
                <p className="text-lg font-bold truncate">{viewing.tutorId?.name}</p>
                <p className="text-sm text-[#9CA1B5] truncate">{viewing.tutorId?.email}</p>
                <div className="mt-2">
                  <StatusBadge label={getStatus(viewing)} tone={getStatus(viewing) === "Rejected" ? "red" : "amber"} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-[#2A2E3D] bg-[#0E1016] p-5">
              <Field label="Education" value={viewing.education} />
              <Field label="Experience" value={viewing.experienceLevel} />
              <Field label="Occupation" value={viewing.occupation} />
              <Field label="Gender" value={viewing.gender} />
              <Field label="Applied on" value={formatDate(viewing.createdAt)} />
              <Field label="Languages" value={join(viewing.languages)} />
              <div className="col-span-2">
                <Field label="Subjects" value={join(viewing.subjects)} />
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6B7185] mb-2" >About</p>
              <div className="rounded-2xl border border-[#2A2E3D] bg-[#0E1016] p-4 text-sm leading-relaxed text-[#D7D9E2]">
                {viewing.description || "No description"}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6B7185] mb-2" >Certificates</p>
              {!viewing.certificates?.length ? (
                <p className="text-sm text-[#9CA1B5]">No certificates uploaded</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {viewing.certificates.map((certificate: string, index: number) => (
                    <a
                      key={index}
                      href={certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl border border-[#2A2E3D] bg-[#0E1016] hover:bg-[#1E2230] hover:border-[#7C9CFF] text-sm font-medium transition"
                    >
                      Certificate {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#2A2E3D]">
              <button
                onClick={() => setAction({ type: "reject", userId: userIdOf(viewing) })}
                className="px-5 py-2.5 mt-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition"
              >
                Reject
              </button>
              <button
                onClick={() => setAction({ type: "approve", userId: userIdOf(viewing) })}
                className="px-5 py-2.5 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={action?.type === "approve"}
        title="Approve tutor"
        message="Are you sure you want to approve this tutor?"
        tone="success"
        confirmLabel="Approve"
        busy={busy}
        onConfirm={handleApprove}
        onClose={closeAction}
      />

      <Modal open={action?.type === "reject"} onClose={closeAction} title="Reject tutor">
        <label className="block text-[10px] uppercase tracking-wider text-[#6B7185] mb-1.5" >
          Reason (the tutor will see this)
        </label>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Write why this application is rejected..."
          className="w-full min-h-[120px] bg-[#0E1016] border border-[#2A2E3D] rounded-xl p-3 text-sm text-[#F3F4F8] placeholder:text-[#6B7185] outline-none focus:border-[#7C9CFF] focus:ring-2 focus:ring-[#7C9CFF]/30 transition"
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeAction}
            className="px-4 py-2.5 rounded-xl border border-[#2A2E3D] text-sm hover:bg-[#1E2230] hover:border-[#7C9CFF] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {busy ? "Please wait…" : "Reject"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TutorApplications;