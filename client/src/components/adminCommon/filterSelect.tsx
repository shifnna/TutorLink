import React from "react";
import { ChevronDown } from "lucide-react";

interface Option { value: string; label: string }

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export const FilterSelect = ({ label, value, onChange, options }: FilterSelectProps) => (
  <label className="flex flex-col gap-1.5 min-w-[160px]">
    <span className="text-[10px] uppercase tracking-wider text-[#6B7185]">{label}</span>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#0E1016] border border-[#2A2E3D] rounded-xl pl-4 pr-10 py-2.5 text-sm text-[#F3F4F8] cursor-pointer outline-none focus:border-[#7C9CFF] focus:ring-2 focus:ring-[#7C9CFF]/30 transition [&>option]:bg-[#171A24]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA1B5]" />
    </div>
  </label>
);

export const FilterBar = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:items-end">
    {children}
  </div>
);