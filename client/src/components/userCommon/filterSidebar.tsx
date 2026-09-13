import React from "react";
import { SelectedFilters } from "../../types/IFilter";

interface FilterSidebarProps {
  filters: SelectedFilters;
  onChange: (filters: SelectedFilters) => void;
}

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer science",
  "English literature",
  "Spanish",
  "Music theory",
  "Economics",
  "Essay writing",
  "SAT / ACT prep",
];

const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Expert"];
const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange }) => {
  const update = <K extends keyof SelectedFilters>(key: K, value: SelectedFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleInArray = (
    key: "subjects" | "experienceLevels" | "availableDays",
    value: string
  ) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    update(key, next);
  };

  const clearAll = () => {
    onChange({
      subjects: [],
      languages: [],
      skills: [],
      experienceLevels: [],
      availableDays: [],
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
      sortBy: filters.sortBy,
    });
  };

  return (
    <aside className="w-full bg-[#171A24] border border-[#2A2E3D] rounded-2xl px-7 py-7 h-fit md:sticky md:top-6">

      {/* subjects */}
      <div className="pb-6 mb-6 border-b border-[#2A2E3D]">
        <h4 className="text-[13px] font-semibold text-[#F3F4F8] mb-4">Subjects</h4>

        <div className="space-y-3">
          {SUBJECT_OPTIONS.map((subject) => (
            <label
              key={subject}
              className="flex items-center gap-3 text-[13.5px] text-[#9CA1B5] hover:text-[#F3F4F8] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.subjects.includes(subject)}
                onChange={() => toggleInArray("subjects", subject)}
                className="w-[15px] h-[15px] accent-[#7C9CFF] cursor-pointer"
              />
              <span>{subject}</span>
            </label>
          ))}
        </div>
      </div>

      {/* price */}
      <div className="pb-6 mb-6 border-b border-[#2A2E3D]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[13px] font-semibold text-[#F3F4F8]">Max price</h4>
          <span className="text-[12px] font-mono text-[#7C9CFF]">₹{filters.priceRange.max}</span>
        </div>

        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={filters.priceRange.max}
          onChange={(e) =>
            update("priceRange", { ...filters.priceRange, max: Number(e.target.value) })
          }
          className="w-full h-1 accent-[#7C9CFF] cursor-pointer"
        />

        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#6B7185]">₹{PRICE_MIN}</span>
          <span className="text-[10px] text-[#6B7185]">₹{PRICE_MAX}</span>
        </div>
      </div>

      {/* experience level */}
      <div className="pb-6 mb-6 border-b border-[#2A2E3D]">
        <h4 className="text-[13px] font-semibold text-[#F3F4F8] mb-4">Experience level</h4>

        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_OPTIONS.map((level) => {
            const active = filters.experienceLevels.includes(level);

            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleInArray("experienceLevels", level)}
                className={`px-3 py-1.5 rounded-full text-[12px] border transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] border-transparent font-semibold"
                    : "bg-transparent border-[#2A2E3D] text-[#9CA1B5] hover:border-[#7C9CFF] hover:text-[#F3F4F8]"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* available days */}
      <div>
        <h4 className="text-[13px] font-semibold text-[#F3F4F8] mb-4">Available on</h4>

        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map((day) => {
            const active = filters.availableDays.includes(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleInArray("availableDays", day)}
                className={`w-9 h-9 rounded-full text-[11px] border transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] border-transparent font-semibold"
                    : "bg-transparent border-[#2A2E3D] text-[#9CA1B5] hover:border-[#7C9CFF] hover:text-[#F3F4F8]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={clearAll}
        className="w-full mt-7 py-2.5 rounded-lg border border-dashed border-[#2A2E3D] text-[12px] text-[#9CA1B5] hover:text-[#F3F4F8] hover:border-[#7C9CFF] transition-all"
      >
        Clear all filters
      </button>
    </aside>
  );
};

export default FilterSidebar;