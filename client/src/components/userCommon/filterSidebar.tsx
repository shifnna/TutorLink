import React, { Key } from "react";
import { SelectedFilters } from "../../types/IFilter";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  filters: SelectedFilters;
  onClose: () => void;
  onChange: (f: SelectedFilters) => void;
}

const FilterSidebar: React.FC<Props> = ({
  isOpen,
  filters,
  onClose,
  onChange,
}) => {
  if (!isOpen) return null;

  const update = <K extends keyof SelectedFilters>(key: K, val: SelectedFilters[K]) => {
    onChange({ ...filters, [key]: val });
  };

  return (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* RIGHT PANEL ONLY */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35 }}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Filters</h2>

        {/* Price */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Price Range</h3>
          <input
            type="range"
            min={0}
            max={2000}
            value={filters.priceRange.max}
            onChange={(e) =>
              update("priceRange", {
                ...filters.priceRange,
                max: Number(e.target.value),
              })
            }
            className="w-full"
          />
          <p className="text-gray-600 mt-1">
            Up to <b>₹{filters.priceRange.max}</b>
          </p>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Experience Level</h3>

          {["Beginner", "Intermediate", "Expert"].map((lvl) => {
            const active = filters.experienceLevels.includes(lvl);

            return (
              <button
                key={lvl}
                onClick={() =>
                  active
                    ? update(
                        "experienceLevels",
                        filters.experienceLevels.filter((i) => i !== lvl)
                      )
                    : update("experienceLevels", [
                        ...filters.experienceLevels,
                        lvl,
                      ])
                }
                className={`px-3 py-2 rounded-lg mr-2 mb-2 transition ${
                  active
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value as SelectedFilters["sortBy"])}
            className="w-full p-2 border rounded-lg"
          >
            <option value="price_low_high">Price: Low → High</option>
            <option value="price_high_low">Price: High → Low</option>
            <option value="name_asc">Name: A → Z</option>
            <option value="name_desc">Name: Z → A</option>
          </select>
        </div>

        <Button className="w-full bg-black text-white" onClick={onClose}>
          Apply Filters
        </Button>
      </motion.div>
    </>
  );
};

export default FilterSidebar;