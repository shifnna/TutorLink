import { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";


interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm mb-8">
    <FaSearch className="text-slate-400" />
    <input
      value={value}
      onChange={onChange}
      placeholder="Search clients by name or email..."
      className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
    />
  </div>
);

export default SearchBar;