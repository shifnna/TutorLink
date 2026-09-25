import { useState, KeyboardEvent, FocusEvent } from "react";
import { FaTimes } from "react-icons/fa";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const commitTag = (raw: string) => {
    const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const merged = [...value];
    parts.forEach((part) => {
      if (!merged.some((t) => t.toLowerCase() === part.toLowerCase())) {
        merged.push(part);
      }
    });
    onChange(merged);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1)); // backspace on empty input pops the last chip
    }
  };

  const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim()) commitTag(inputValue);
  };

  const removeTag = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="flex flex-wrap items-center gap-2 min-h-12 bg-[#1E2230] border border-[#2A2E3D] rounded-xl p-2 focus-within:ring-2 focus-within:ring-[#7C9CFF]/40 focus-within:border-[#7C9CFF] transition">
      {value.map((tag, index) => (
        <span key={`${tag}-${index}`} className="flex items-center gap-1 bg-[#2A2E3D] text-[#F3F4F8] text-sm px-3 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => removeTag(index)} className="text-[#9CA1B5] hover:text-red-400 transition">
            <FaTimes size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-[#F3F4F8] placeholder:text-[#9CA1B5] text-sm py-1"
      />
    </div>
  );
};

export default TagInput;