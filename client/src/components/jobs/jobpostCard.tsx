import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Hourglass } from "lucide-react";
import { IJobPost } from "../../types/IJobPost";
import { LEVELS, TIMES, WEEKDAYS, labelOf } from "../../utils/jobPostForm";
import { fraunces, mono } from "../../utils/midNightTheme";

type Props = { post: IJobPost; onMessage: (clientUserId: string) => void };

const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// "2 days ago", "3 hours ago"
const ago = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (mins < 60) return rtf.format(-Math.max(mins, 0), "minute");
  if (mins < 60 * 24) return rtf.format(-Math.round(mins / 60), "hour");
  return rtf.format(-Math.round(mins / (60 * 24)), "day");
};
const daysLeft = (iso: string) => Math.max(1, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
const initials = (name?: string) => (name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "S");
const titleCase = (name?: string) => name?.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

const JobPostCard: React.FC<Props> = ({ post, onMessage }) => {
  const [expanded, setExpanded] = useState(false);
  const client = post.clientId && typeof post.clientId === "object" ? post.clientId : null;
  const name = titleCase(client?.name) || "A student";
  const tags = [post.subject, labelOf(LEVELS, post.level), ...post.languages];
  const days = post.preferredDays.map((d) => labelOf(WEEKDAYS, d)).join(", ");
  const left = daysLeft(post.expiresAt);
  const long = post.description.length > 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="w-full min-w-0 bg-[#171A24] border border-[#343B53] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#7C9CFF]/60 hover:shadow-lg hover:shadow-[#7C9CFF]/5 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 h-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div style={fraunces} className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#101321] flex-shrink-0">
              {initials(client?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 style={fraunces} className="text-xl font-bold text-[#F8F9FF] break-words">{post.title}</h2>
              <p className="text-xs text-[#C0C7DE] mt-1">Posted by {name}, {ago(post.createdAt)}</p>
            </div>
          </div>

          <p className={`text-sm text-[#D0D5E8] mt-4 leading-relaxed whitespace-pre-line break-words ${expanded ? "" : "line-clamp-3"}`}>{post.description}</p>
          {long && (
            <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-1 text-xs font-medium text-[#AFC2FF] hover:text-[#F8F9FF] transition">
              {expanded ? "Show less" : "Read more"}
            </button>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${i % 2 === 0 ? "bg-[#242B40] border-[#384665] text-[#DCE5FF]" : "bg-[#30263E] border-[#4B3A60] text-[#F0DCFF]"}`}>{tag}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-[#C0C7DE]">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#8EAAFF]" />{post.sessionDuration} min, {labelOf(TIMES, post.preferredTime).toLowerCase()}</span>
            <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-[#8EAAFF]" />{days}, from {fmt(new Date(`${post.startDate}T00:00:00`))}</span>
            <span className="flex items-center gap-1.5"><Hourglass className="w-3.5 h-3.5 text-[#D0AEFF]" />Open for {left} more day{left === 1 ? "" : "s"}</span>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-stretch justify-between gap-3 sm:w-40 sm:flex-shrink-0">
          <div className="sm:text-center">
            <p style={mono} className="text-lg font-bold text-[#B6C8FF]">₹{post.budgetMin} to ₹{post.budgetMax}</p>
            <p className="text-[11px] text-[#C0C7DE] mt-0.5">per hour</p>
          </div>
          <button
            type="button" disabled={!client?._id} onClick={() => client?._id && onMessage(client._id)}
            className="rounded-full px-5 h-11 bg-gradient-to-r from-[#7C9CFF] to-[#A18BFA] text-[#101321] text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:brightness-100"
          >
            Message
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobPostCard;