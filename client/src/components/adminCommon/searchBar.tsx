import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-xl border border-purple-800/40 mb-7 shadow-sm">
      <FaSearch className="text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none text-white flex-1 placeholder-gray-400 font-medium"
      />
    </div>
  );
};

export default SearchBar;
