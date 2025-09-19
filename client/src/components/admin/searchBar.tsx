import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-purple-800/40 mb-6">
      <FaSearch className="text-gray-400" />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-white flex-1 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
