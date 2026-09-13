import { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";


interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="flex items-center  bg-[#0E1016] border border-[#2A2E3D] rounded-2xl px-6 py-4  focus-within:border-[#7C9CFF] focus-within:ring-2 focus-within:ring-[#7C9CFF]/40 transition">
    <FaSearch className="text-[#9CA1B5]" />
    <input
      value={value}
      onChange={onChange}
      placeholder="Search clients by name or email..."
      className="flex-1 outline-none bg-transparent text-[#F3F4F8] placeholder:text-[#6B7185]"
    />
  </div>
);

export default SearchBar;