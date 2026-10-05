import { ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search...", label = "Search" }: SearchBarProps) => (
  <label className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
    <span className="text-[10px] uppercase tracking-wider text-[#6B7185]" >{label}</span>
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7185] pointer-events-none" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0E1016] border border-[#2A2E3D] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#F3F4F8] placeholder:text-[#6B7185] outline-none focus:border-[#7C9CFF] focus:ring-2 focus:ring-[#7C9CFF]/30 transition"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7185] hover:text-[#F3F4F8] transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </label>
);

export default SearchBar;