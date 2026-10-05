import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";


export interface Column<T> {
  key: string;
  header: string; 
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
}

const alignClass = { left: "text-left", center: "text-center", right: "text-right" };

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  minWidth?: string;
  emptyTitle?: string;
  emptyText?: string;
}

export function DataTable<T>({
  columns, rows, rowKey, minWidth = "min-w-[760px]",
  emptyTitle = "Nothing to show", emptyText = "Try changing your search or filters.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidth} border-collapse`}>
        <thead>
          <tr className="bg-[#1B1F2D] border-y border-[#2A2E3D]">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#9CA1B5] whitespace-nowrap ${alignClass[c.align ?? "left"]}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1E2230] border border-[#2A2E3D] flex items-center justify-center mb-3">
                  <Inbox className="w-5 h-5 text-[#6B7185]" />
                </div>
                <p className="font-semibold text-[#F3F4F8]">{emptyTitle}</p>
                <p className="text-sm text-[#6B7185] mt-1">{emptyText}</p>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-[#2A2E3D]/70 last:border-b-0 hover:bg-[#1B1F2D]/70 transition-colors">
                {columns.map((c) => (
                  <td key={c.key} className={`px-6 py-4 text-sm text-[#D7D9E2] align-middle ${alignClass[c.align ?? "left"]}`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


interface TableCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const TableCard = ({ title, subtitle, children }: TableCardProps) => (
  <section className="rounded-2xl border border-[#2A2E3D] bg-[#171A24] overflow-hidden">
    <div className="px-6 py-5">
      <h2 className="text-lg font-bold" >{title}</h2>
      {subtitle && <p className="text-sm text-[#9CA1B5] mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </section>
);


const getPages = (page: number, total: number): (number | "…")[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const list = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
};

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ page, perPage, total, onChange }: PaginationProps) => {
  if (total === 0) return null;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#2A2E3D]">
      <p className="text-xs text-[#9CA1B5]">
        Showing {from}–{to} of {total}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
            className="w-9 h-9 rounded-lg border border-[#2A2E3D] flex items-center justify-center text-[#F3F4F8] hover:border-[#7C9CFF] transition disabled:opacity-40 disabled:hover:border-[#2A2E3D]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPages(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`dots-${i}`} className="w-9 text-center text-[#6B7185]">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                  p === page
                    ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016]"
                    : "bg-[#1E2230] text-[#9CA1B5] hover:text-[#F3F4F8]"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
            className="w-9 h-9 rounded-lg border border-[#2A2E3D] flex items-center justify-center text-[#F3F4F8] hover:border-[#7C9CFF] transition disabled:opacity-40 disabled:hover:border-[#2A2E3D]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Avatar + name cell ---------- */

const getInitials = (name?: string) =>
  !name ? "?" : name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

interface UserCellProps {
  name?: string;
  sub?: string;
  image?: string | null;
}

export const UserCell = ({ name, sub, image }: UserCellProps) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);

  return (
    <div className="flex items-center gap-3 min-w-0">
      {image && !failed ? (
        <img
          src={image}
          alt={name || "User"}
          onError={() => setFailed(true)}
          className="w-10 h-10 rounded-full object-cover border border-[#2A2E3D] flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] flex-shrink-0">
          {getInitials(name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-[#F3F4F8] truncate">{name || "Unknown"}</p>
        {sub && <p className="text-xs text-[#9CA1B5] truncate">{sub}</p>}
      </div>
    </div>
  );
};