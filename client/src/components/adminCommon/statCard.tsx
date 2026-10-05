import React from "react";

type StatTone = "blue" | "purple" | "green" | "amber";

const tones: Record<StatTone, string> = {
  blue: "from-[#7C9CFF]/25 to-[#7C9CFF]/5 text-[#A9BCFF] border-[#7C9CFF]/30",
  purple: "from-[#C08BFA]/25 to-[#C08BFA]/5 text-[#D9B8FF] border-[#C08BFA]/30",
  green: "from-emerald-500/25 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
  amber: "from-amber-500/25 to-amber-500/5 text-amber-300 border-amber-500/30",
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone?: StatTone;
  hint?: string;
}

const StatCard = ({ label, value, icon: Icon, tone = "blue", hint }: StatCardProps) => (
  <div className="rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-5 flex items-center gap-4 hover:border-[#7C9CFF]/50 hover:-translate-y-0.5 transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl border bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${tones[tone]}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-[#9CA1B5]" >{label}</p>
      <p className="text-2xl font-bold text-[#F3F4F8] truncate">{value}</p>
      {hint && <p className="text-xs text-[#6B7185] mt-0.5">{hint}</p>}
    </div>
  </div>
);

export default StatCard;