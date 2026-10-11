import { mono } from "../../utils/midNightTheme";

type Props = { page: number; totalPages: number; loading?: boolean; onChange: (page: number) => void };

const SimplePagination: React.FC<Props> = ({ page, totalPages, loading = false, onChange }) => {
  if (totalPages <= 1) return null;
  const go = (p: number) => { onChange(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const btn = "rounded-full px-5 py-2.5 text-sm font-medium border border-[#46516F] text-[#E4E8F7] hover:bg-[#242B40] hover:border-[#7C9CFF] transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-[#46516F]";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 pt-8">
      <button type="button" className={btn} disabled={page <= 1 || loading} onClick={() => go(page - 1)}>Previous</button>
      <span style={mono} className="text-sm text-[#C0C7DE]">Page {page} of {totalPages}</span>
      <button type="button" className={btn} disabled={page >= totalPages || loading} onClick={() => go(page + 1)}>Next</button>
    </nav>
  );
};

export default SimplePagination;