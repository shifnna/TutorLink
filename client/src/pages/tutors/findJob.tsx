import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobPostService } from "../../services/jobPostService";
import { IJobFilterOptions, IJobPostList } from "../../types/IJobPost";
import JobFilterSidebar, { EMPTY_FILTERS, JobFilters } from "../../components/jobs/jobFilterSidebar";
import JobPostCard from "../../components/jobs/jobpostCard";
import SimplePagination from "../../components/jobs/simplePagination";
import { fraunces, mono, useMidnightFonts } from "../../utils/midNightTheme";


const PAGE_SIZE = 8;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

const FindJob: React.FC = () => {
  useMidnightFonts();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<IJobPostList>({ items: [], total: 0, page: 1, totalPages: 1 });
  const [options, setOptions] = useState<IJobFilterOptions>({ subjects: [], languages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const latest = useRef(0); // lets us ignore answers from older requests

  const dSearch = useDebouncedValue(search.trim(), 400);
  const dMinPay = useDebouncedValue(filters.minPay, 400);

  useEffect(() => {
    jobPostService.getFilterOptions().then((res) => { if (res.success && res.data) setOptions(res.data); });
  }, []);

  useEffect(() => {
    const id = ++latest.current;
    setLoading(true);
    setError("");
    jobPostService
      .getBoard({ page, limit: PAGE_SIZE, search: dSearch, sort, minBudget: dMinPay || undefined, subjects: filters.subjects, languages: filters.languages, levels: filters.levels })
      .then((res) => {
        if (id !== latest.current) return; // an older request finished late
        if (res.success && res.data) {
          // the last job on this page was taken down: go back a page
          if (res.data.items.length === 0 && page > 1) { setPage(res.data.totalPages); return; }
          setData(res.data);
        } else {
          setError(res.message || "Couldn't load jobs. Please try again.");
        }
        setLoading(false);
      });
  }, [page, dSearch, dMinPay, sort, filters.subjects, filters.languages, filters.levels, reloadKey]);

  const changeFilters = (next: JobFilters) => { setFilters(next); setPage(1); };
  const filtered = !!dSearch || dMinPay > 0 || filters.subjects.length + filters.languages.length + filters.levels.length > 0;
  const clearAll = () => { setSearch(""); setFilters(EMPTY_FILTERS); setPage(1); };
  const resultsLabel = `${data.total} job${data.total === 1 ? "" : "s"} found`;

  return (
    <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8] px-10 sm:px-12 lg:px-16 py-10 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }} />
      </div>

      {/* Page heading */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <p style={mono} className="text-[11px] uppercase tracking-wider text-[#B0B7CE] mb-2">Jobs</p>
        <h1 style={fraunces} className="text-4xl font-bold text-[#F8F9FF] mt-8">Find a job</h1>
        <p className="text-[#C0C7DE] mt-2">See what students need and message them to start teaching.</p>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#A6B0CB]" />
          <input
            value={search} maxLength={60} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search jobs"
            placeholder="Search jobs by title, subject, or keyword..."
            className="w-full border border-[#343B53] rounded-xl pl-12 pr-4 py-3 bg-[#171A24] text-[#F3F4F8] placeholder:text-[#929AB2] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row gap-5 items-start">
        <div className="w-full md:w-64 flex-shrink-0">
          <JobFilterSidebar value={filters} options={options} onChange={changeFilters} />
        </div>

        <div className="flex-1 w-full min-w-0">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <span style={mono} className="text-sm text-[#C0C7DE]">{!loading && !error && resultsLabel}</span>
            <select
              value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} aria-label="Sort jobs"
              className="border border-[#343B53] rounded-xl px-4 py-2.5 bg-[#171A24] text-[#F3F4F8] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 [color-scheme:dark]"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="budget_high">Sort: Pay, high to low</option>
              <option value="budget_low">Sort: Pay, low to high</option>
            </select>
          </div>

          {error ? (
            <div className="text-center py-20 border border-dashed border-[#343B53] rounded-3xl">
              <p className="text-[#F3F4F8]">{error}</p>
              <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="mt-5 rounded-full px-6 h-11 border border-[#46516F] text-[#E4E8F7] text-sm hover:bg-[#242B40] hover:border-[#7C9CFF] transition-all">Try again</button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-32" aria-busy="true"><Loader2 className="w-10 h-10 animate-spin text-[#7C9CFF]" /></div>
          ) : data.items.length === 0 ? (
            <div className="text-center py-20 text-[#C0C7DE] border border-dashed border-[#343B53] rounded-3xl">
              <p>{filtered ? "No jobs match your filters. Try a different search." : "No jobs are open right now. New requirements from students will show up here."}</p>
              {filtered && <button type="button" onClick={clearAll} className="mt-5 rounded-full px-6 h-11 border border-[#46516F] text-[#E4E8F7] text-sm hover:bg-[#242B40] hover:border-[#7C9CFF] transition-all">Clear filters</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <AnimatePresence>
                {data.items.map((post) => <JobPostCard key={post._id} post={post} onMessage={(clientUserId) => navigate(`/messages?with=${clientUserId}`)} />)}
              </AnimatePresence>
            </div>
          )}

          <SimplePagination page={page} totalPages={data.totalPages} loading={loading} onChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default FindJob;