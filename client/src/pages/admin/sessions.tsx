import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, IndianRupee, Hourglass, CircleCheck, Star } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useDebounce } from "../../hooks/useDebounce";
import SessionDetailsModal from "../../pages/common/sessionDetailsModal";
import Header from "../../components/adminCommon/header";
import SearchBar from "../../components/adminCommon/searchBar";
import StatCard from "../../components/adminCommon/statCard";
import StatusBadge, { Tone } from "../../components/adminCommon/statusBadge";
import { FilterBar, FilterSelect } from "../../components/adminCommon/filterSelect";
import { ConfirmDialog, Modal } from "../../components/adminCommon/modal";
import { Column, DataTable, Pagination, TableCard, UserCell } from "../../components/adminCommon/dataTable";
import { Button } from "../../components/ui/button";

interface IUserInfo { _id: string; name: string; email: string }
interface ITutorInfo { tutorId: IUserInfo }
interface IFeedback { message: string; rating: number; unsatisfied: boolean }
type PaymentStatus = "HOLD" | "RELEASED" | "REFUNDED";

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

type SortType = "latest" | "oldest" | "amountHigh" | "amountLow";

const ITEMS_PER_PAGE = 5;

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const sessionTone = (status: string): Tone => {
  const s = status.toLowerCase();
  if (s === "completed") return "green";
  if (s === "cancelled") return "red";
  if (["upcoming", "confirmed", "booked"].includes(s)) return "blue";
  return "gray";
};

const paymentTone: Record<PaymentStatus, Tone> = { HOLD: "amber", RELEASED: "green", REFUNDED: "red" };
const paymentLabel: Record<PaymentStatus, string> = { HOLD: "On hold", RELEASED: "Paid to tutor", REFUNDED: "Refunded" };

const Sessions = () => {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<SortType>("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [refundModal, setRefundModal] = useState<ISession | null>(null);
  const [confirmRelease, setConfirmRelease] = useState<ISession | null>(null);
  const [detailsSession, setDetailsSession] = useState<ISession | null>(null);
  const [refundPercent, setRefundPercent] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  const loadSessions = async () => {
    try {
      const response = await adminService.getAllSessions();
      if (response.success && response.data) setSessions(response.data as ISession[]);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, paymentFilter, sortType]);

  const filteredSessions = useMemo(() => {
    const query = debouncedSearch.toLowerCase();

    const filtered = sessions.filter((s) => {
      const tutorName = s.tutorId?.tutorId?.name?.toLowerCase() || "";
      const userName = s.userId?.name?.toLowerCase() || "";
      const status = s.status.toLowerCase();

      const matchesSearch = tutorName.includes(query) || userName.includes(query) || status.includes(query);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesPayment = paymentFilter === "all" || s.paymentStatus.toLowerCase() === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });

    filtered.sort((a, b) => {
      if (sortType === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortType === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortType === "amountHigh") return b.amount - a.amount;
      return a.amount - b.amount;
    });

    return filtered;
  }, [sessions, debouncedSearch, sortType, statusFilter, paymentFilter]);

  const paginated = filteredSessions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totals = useMemo(() => {
    const sum = (list: ISession[]) => list.reduce((t, s) => t + s.amount, 0);
    return {
      value: sum(sessions),
      hold: sum(sessions.filter((s) => s.paymentStatus === "HOLD")),
      released: sum(sessions.filter((s) => s.paymentStatus === "RELEASED")),
    };
  }, [sessions]);

  const handleRelease = async () => {
    if (!confirmRelease) return;
    setBusy(true);
    try {
      await adminService.releasePayment(confirmRelease._id);
      toast.success("Payment released");
      setConfirmRelease(null);
      await loadSessions();
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Release failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRefund = async () => {
    if (!refundModal) return;
    if (refundPercent <= 0 || refundPercent > 100) {
      toast.error("Enter a percentage between 1 and 100");
      return;
    }
    setBusy(true);
    try {
      await adminService.refundAmount(refundModal._id, refundPercent);
      toast.success("Refund processed");
      setRefundModal(null);
      setRefundPercent(0);
      await loadSessions();
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Refund failed");
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<ISession>[] = [
    {
      key: "tutor",
      header: "Tutor",
      render: (s) => <UserCell name={s.tutorId?.tutorId?.name} sub={s.tutorId?.tutorId?.email} />,
    },
    {
      key: "client",
      header: "Client",
      render: (s) => <UserCell name={s.userId?.name} sub={s.userId?.email} />,
    },
    {
      key: "schedule",
      header: "Date & time",
      render: (s) => (
        <div className="whitespace-nowrap">
          <p className="font-medium text-[#F3F4F8]">
            {new Date(s.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs text-[#9CA1B5] mt-0.5">{s.startTime} – {s.endTime}</p>
        </div>
      ),
    },
    { key: "status", header: "Session status", render: (s) => <StatusBadge label={capitalize(s.status)} tone={sessionTone(s.status)} /> },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (s) => <span className="font-semibold text-[#F3F4F8]">{inr(s.amount)}</span>,
    },
    {
      key: "payment",
      header: "Payment",
      render: (s) => <StatusBadge label={paymentLabel[s.paymentStatus] ?? s.paymentStatus} tone={paymentTone[s.paymentStatus] ?? "gray"} />,
    },
    {
      key: "rating",
      header: "Rating",
      render: (s) =>
        s.feedback?.rating ? (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              {s.feedback.rating}
              <span className="text-[#6B7185] font-normal">/5</span>
            </span>
            {s.feedback.unsatisfied && <StatusBadge label="Unsatisfied" tone="red" />}
          </div>
        ) : (
          <span className="text-[#6B7185]">No rating</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDetailsSession(s)}
            className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230] hover:border-[#7C9CFF] bg-transparent rounded-lg"
          >
            Details
          </Button>
          {s.paymentStatus === "HOLD" && s.feedback && !s.feedback.unsatisfied && (
            <Button size="sm" onClick={() => setConfirmRelease(s)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
              Release
            </Button>
          )}
          {s.paymentStatus === "HOLD" && s.feedback?.unsatisfied && (
            <Button size="sm" onClick={() => setRefundModal(s)} className="bg-red-600 hover:bg-red-500 text-white rounded-lg">
              Refund
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Header title="Sessions" subtitle="Track bookings, ratings and payments" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total sessions" value={sessions.length} icon={CalendarCheck} tone="blue" />
        <StatCard label="Total value" value={inr(totals.value)} icon={IndianRupee} tone="purple" />
        <StatCard label="Payments on hold" value={inr(totals.hold)} icon={Hourglass} tone="amber" />
        <StatCard label="Paid to tutors" value={inr(totals.released)} icon={CircleCheck} tone="green" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tutor, client or status" />
        <FilterSelect
          label="Session status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All status" },
            { value: "upcoming", label: "Upcoming" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
        <FilterSelect
          label="Payment"
          value={paymentFilter}
          onChange={setPaymentFilter}
          options={[
            { value: "all", label: "All payments" },
            { value: "hold", label: "On hold" },
            { value: "released", label: "Paid to tutor" },
            { value: "refunded", label: "Refunded" },
          ]}
        />
        <FilterSelect
          label="Sort by"
          value={sortType}
          onChange={(v) => setSortType(v as SortType)}
          options={[
            { value: "latest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "amountHigh", label: "Amount: high to low" },
            { value: "amountLow", label: "Amount: low to high" },
          ]}
        />
      </FilterBar>

      <TableCard title="Session list" subtitle={`${filteredSessions.length} sessions found`}>
        <DataTable
          columns={columns}
          rows={paginated}
          rowKey={(s) => s._id}
          minWidth="min-w-[1100px]"
          emptyTitle="No sessions found"
        />
        <Pagination page={currentPage} perPage={ITEMS_PER_PAGE} total={filteredSessions.length} onChange={setCurrentPage} />
      </TableCard>

      {/* Release */}
      <ConfirmDialog
        open={!!confirmRelease}
        title="Release payment"
        message={<>Release <b className="text-[#F3F4F8]">{confirmRelease ? inr(confirmRelease.amount) : ""}</b> to the tutor?</>}
        tone="success"
        confirmLabel="Release"
        busy={busy}
        onConfirm={handleRelease}
        onClose={() => setConfirmRelease(null)}
      />

      {/* Refund */}
      <Modal open={!!refundModal} onClose={() => setRefundModal(null)} title="Refund client">
        <label className="block text-[10px] uppercase tracking-wider text-[#6B7185] mb-1.5" >
          Refund percentage (1–100)
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={refundPercent}
          onChange={(e) => setRefundPercent(Number(e.target.value))}
          className="w-full bg-[#0E1016] border border-[#2A2E3D] rounded-xl px-4 py-2.5 text-[#F3F4F8] outline-none focus:border-[#7C9CFF] focus:ring-2 focus:ring-[#7C9CFF]/30 transition"
        />
        {refundModal && refundPercent > 0 && refundPercent <= 100 && (
          <p className="text-sm text-[#9CA1B5] mt-3">
            Client will get back{" "}
            <b className="text-[#F3F4F8]">{inr(Math.round((refundModal.amount * refundPercent) / 100))}</b> of {inr(refundModal.amount)}.
          </p>
        )}
        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={() => setRefundModal(null)}
            className="px-4 py-2.5 rounded-xl border border-[#2A2E3D] text-sm hover:bg-[#1E2230] hover:border-[#7C9CFF] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRefund}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {busy ? "Please wait…" : "Refund"}
          </button>
        </div>
      </Modal>

      <SessionDetailsModal session={detailsSession} onClose={() => setDetailsSession(null)} />
    </div>
  );
};

export default Sessions;