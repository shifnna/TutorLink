
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, BadgeCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { tutorService } from "../../services/tutorService";
import { ITutor } from "../../types/ITutor";
import {
  FilterOptions,
  SelectedFilters,
  SortOption,
} from "../../types/IFilter";
import FilterSidebar from "../../components/userCommon/filterSidebar";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const FALLBACK_PRICE_BOUNDS = { min: 0, max: 2000 };

const DEFAULT_FILTERS: SelectedFilters = {
  subjects: [],
  languages: [],
  experienceLevels: [],
  availableDays: [],
  priceRange: FALLBACK_PRICE_BOUNDS,
  sortBy: "all",
};

const EMPTY_FILTER_OPTIONS: FilterOptions = {
  subjects: [],
  languages: [],
  experienceLevels: [],
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

const toArray = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  return Array.isArray(value)
    ? value
    : value.split(",").map((v) => v.trim()).filter(Boolean);
};

const capitalize = (value: string) =>
  value.length
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value;

const getInitials = (name?: string) => {
  if (!name) return "T";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const formatteName = (name?: string) => {
  return name?.split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(" ");
}

const TutorAvatar: React.FC<{ src?: string; name?: string }> = ({
  src,
  name,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return (
      <div
        style={fraunces}
        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#101321] flex-shrink-0"
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Tutor"}
      onError={() => setImageFailed(true)}
      className="w-16 h-16 rounded-full object-cover border border-[#38415C] flex-shrink-0"
    />
  );
};

const ExploreTutors: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SelectedFilters>(DEFAULT_FILTERS);
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(EMPTY_FILTER_OPTIONS);

  const [priceBounds] = useState(FALLBACK_PRICE_BOUNDS);
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    const id = "tutorlink-midnight-fonts";

    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";

    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await tutorService.getFilterOptions();

        if (response.success && response.data) {
          setFilterOptions(response.data);
        }
      } catch (error: unknown) {
        console.error(
          error instanceof Error ? error.message : error
        );
      }
    };

    loadFilterOptions();
  }, []);

  const fetchTutors = useCallback(async () => {
    setLoading(true);

    try {
      const response = await tutorService.getAllTutors({
        search: debouncedSearch,
        sortBy: filters.sortBy,
        experienceLevels: filters.experienceLevels,
        subjects: filters.subjects,
        languages: filters.languages,
      });

      if (response.success && response.data) {
        setTutors(response.data);
      }
    } catch (error: unknown) {
      console.error(
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    filters.sortBy,
    filters.experienceLevels,
    filters.subjects,
    filters.languages,
  ]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const resultsLabel = `${tutors.length} tutor${
    tutors.length === 1 ? "" : "s"
  } found`;

  return (
    <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8] px-10 sm:px-12 lg:px-16 py-10 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Page heading */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <p
          style={mono}
          className="text-[11px] uppercase tracking-wider text-[#B0B7CE] mb-2"
        >
          Explore
        </p>

        <h1
          style={fraunces}
          className="text-4xl font-bold text-[#F8F9FF] mt-8"
        >
          Find your tutor
        </h1>

        <p className="text-[#C0C7DE] mt-2">
          Learn from verified professionals, matched to your subject
          and schedule.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#A6B0CB]" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors by name, subject, or keyword..."
            className="w-full border border-[#343B53] rounded-xl pl-12 pr-4 py-3 bg-[#171A24] text-[#F3F4F8] placeholder:text-[#929AB2] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row gap-5 items-start">
        {/* Filter sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            options={filterOptions}
            priceBounds={priceBounds}
          />
        </div>

        {/* Tutor results */}
        <div className="flex-1 w-full min-w-0">
          {/* Results header */}
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <span
              style={mono}
              className="text-sm text-[#C0C7DE]"
            >
              {!loading && resultsLabel}
            </span>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as SortOption,
                }))
              }
              className="border border-[#343B53] rounded-xl px-4 py-2.5 bg-[#171A24] text-[#F3F4F8] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
            >
              <option value="all">Sort: All</option>
              <option value="price_low_high">
                Sort: Price, low to high
              </option>
              <option value="price_high_low">
                Sort: Price, high to low
              </option>
              <option value="name_asc">Sort: Name, A to Z</option>
              <option value="name_desc">Sort: Name, Z to A</option>
            </select>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#7C9CFF]" />
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
              <AnimatePresence>
                {tutors.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-[#C0C7DE] border border-dashed border-[#343B53] rounded-3xl">
                    No tutors found. Try a different search.
                  </div>
                ) : (
                  tutors.map((tutor) => {
                    const subjects = toArray(tutor.subjects);

                    return (
                      <motion.div
                        key={tutor._id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full min-w-0 bg-[#171A24] border border-[#343B53] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#7C9CFF]/60 hover:shadow-lg hover:shadow-[#7C9CFF]/5 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 h-full">
                          {/* Tutor information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4">
                              <TutorAvatar
                                src={tutor.profileImage}
                                name={getInitials(tutor.tutorId?.name)}
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h2
                                    style={fraunces}
                                    className="text-xl font-bold text-[#F8F9FF] break-words"
                                  >
                                    {formatteName(tutor.tutorId?.name)}
                                  </h2>

                                  <BadgeCheck className="w-4 h-4 text-[#8EAAFF] flex-shrink-0" />
                                </div>

                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  {tutor.averageRating != null && (
                                    <>
                                      <Star className="w-3.5 h-3.5 fill-[#F5B942] text-[#F5B942]" />

                                      <span className="text-sm font-semibold text-[#F5F6FF]">
                                        {tutor.averageRating.toFixed(1)}
                                      </span>
                                    </>
                                  )}

                                  <span className="text-xs text-[#C0C7DE]">
                                    · Tutor
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            {tutor.description && (
                              <p className="text-sm text-[#D0D5E8] mt-4 leading-relaxed line-clamp-3">
                                {tutor.description}
                              </p>
                            )}

                            {/* Subject tags */}
                            {subjects.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {subjects.slice(0, 4).map(
                                  (subject, index) => (
                                    <span
                                      key={subject}
                                      className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                                        index % 2 === 0
                                          ? "bg-[#242B40] border-[#384665] text-[#DCE5FF]"
                                          : "bg-[#30263E] border-[#4B3A60] text-[#F0DCFF]"
                                      }`}
                                    >
                                      {capitalize(subject)}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex sm:flex-col items-center sm:items-stretch gap-3 sm:w-36 sm:flex-shrink-0">
                            <Button
                              onClick={() =>
                                navigate(
                                  `/tutor/get-tutor/${tutor._id}`
                                )
                              }
                              className="flex-1 sm:flex-none rounded-full px-4 py-5 bg-gradient-to-r from-[#7C9CFF] to-[#A18BFA] text-[#101321] font-semibold hover:brightness-110 transition-all"
                            >
                              View profile
                            </Button>

                            <Button
                              onClick={() =>
                                navigate(
                                  `/messages?with=${tutor.tutorId?._id}`
                                )
                              }
                              className="flex-1 sm:flex-none rounded-full px-4 py-5 bg-transparent border border-[#46516F] text-[#E4E8F7] hover:bg-[#242B40] hover:border-[#7C9CFF] transition-all"
                            >
                              Message
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreTutors;