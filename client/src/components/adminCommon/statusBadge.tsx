export type Tone = "green" | "red" | "amber" | "blue" | "purple" | "gray";

const styles: Record<Tone, { box: string; dot: string }> = {
  green: { box: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25", dot: "bg-emerald-400" },
  red: { box: "bg-rose-500/10 text-rose-300 border-rose-500/25", dot: "bg-rose-400" },
  amber: { box: "bg-amber-500/10 text-amber-300 border-amber-500/25", dot: "bg-amber-400" },
  blue: { box: "bg-[#7C9CFF]/10 text-[#A9BCFF] border-[#7C9CFF]/25", dot: "bg-[#7C9CFF]" },
  purple: { box: "bg-[#C08BFA]/10 text-[#D9B8FF] border-[#C08BFA]/25", dot: "bg-[#C08BFA]" },
  gray: { box: "bg-white/5 text-[#9CA1B5] border-white/10", dot: "bg-[#6B7185]" },
};

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
}

const StatusBadge = ({ label, tone = "gray" }: StatusBadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${styles[tone].box}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${styles[tone].dot}`} />
    {label}
  </span>
);

export default StatusBadge;