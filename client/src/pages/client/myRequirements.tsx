import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { jobPostService } from "../../services/jobPostService";
import { IJobPost, IJobPostList } from "../../types/IJobPost";
import PostJobModal from "../../components/jobs/postJobModal";
import JobPostCard from "../../components/jobs/jobpostCard";
import SimplePagination from "../../components/jobs/simplePagination";

const TABS = [{ value: "", label: "All" }, { value: "open", label: "Open" }, { value: "closed", label: "Closed" }, { value: "expired", label: "Expired" }];
const PAGE_SIZE = 6;

const MyRequirements: React.FC = () => {
  const [data, setData] = useState<IJobPostList>({ items: [], total: 0, page: 1, totalPages: 1 });
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IJobPost | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const latest = useRef(0); // ignore answers from older requests

  useEffect(() => {
    const id = ++latest.current;
    setLoading(true);
    setError("");
    jobPostService.getMine({ page, limit: PAGE_SIZE, status }).then((res) => {
      if (id !== latest.current) return;
      if (res.success && res.data) {
        // last item on the last page was removed: go back one page
        if (res.data.items.length === 0 && page > 1) { setPage(res.data.totalPages); return; }
        setData(res.data);
      } else {
        setError(res.message || "Couldn't load your requirements.");
      }
      setLoading(false);
    });
  }, [page, status, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: IJobPost) => { setEditing(p); setModalOpen(true); };
  const changeTab = (value: string) => { setStatus(value); setPage(1); };

  const act = async (p: IJobPost, kind: "close" | "delete") => {
    if (busyId) return; // one action at a time
    const ask = kind === "close" ? "Close this requirement? Tutors will no longer see it." : "Delete this requirement? This can't be undone.";
    if (!window.confirm(ask)) return;
    setBusyId(p._id);
    const res = kind === "close" ? await jobPostService.close(p._id) : await jobPostService.remove(p._id);
    setBusyId(null);
    if (res.success) toast.success(res.message || "Done");
    else toast.error(res.message || "Something went wrong. Try again.");
    reload(); // reload either way so the list matches the server
  };

  return (
    <div className="space-y-6 text-[#F3F4F8]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My requirements</h1>
          <p className="text-sm text-[#9AA0B4] mt-1">Post what you need and tutors can find it. You can keep up to 5 open at a time.</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0E1016] bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] hover:scale-[1.02] transition">
          <Plus className="w-4 h-4" />Post requirement
        </button>
      </div>

      <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.value} role="tab" aria-selected={status === t.value} type="button" onClick={() => changeTab(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${status === t.value ? "bg-[#7C9CFF]/15 border-[#7C9CFF]" : "border-[#2A2E3D] text-[#9AA0B4] hover:border-[#7C9CFF]/60"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-8 text-center">
          <p className="text-sm text-[#F87171]">{error}</p>
          <button type="button" onClick={reload} className="mt-4 px-4 py-2 rounded-xl text-sm border border-[#2A2E3D] hover:border-[#7C9CFF]">Try again</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" aria-busy="true">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-56 rounded-2xl bg-[#171A24] border border-[#2A2E3D] animate-pulse" />)}
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2A2E3D] bg-[#171A24]/60 p-10 text-center">
          <p className="font-medium">{status ? `No ${status} requirements` : "You haven't posted a requirement yet"}</p>
          <p className="text-sm text-[#9AA0B4] mt-1">{status ? "Try another tab." : "Tell tutors the subject, budget and time you need."}</p>
          {!status && <button type="button" onClick={openCreate} className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0E1016] bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]">Post requirement</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.items.map((p) => (
            <JobPostCard key={p._id} post={p} mode="owner" busy={busyId === p._id} onEdit={openEdit} onClose={(x) => act(x, "close")} onDelete={(x) => act(x, "delete")} />
          ))}
        </div>
      )}

      <SimplePagination page={page} totalPages={data.totalPages} loading={loading} onChange={setPage} />

      <PostJobModal
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSaved={(_post, mode) => { if (mode === "created") { setStatus(""); setPage(1); } reload(); }}
      />
    </div>
  );
};

export default MyRequirements;