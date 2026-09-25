import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, BadgeCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { tutorService } from "../../services/tutorService";
import { ITutor } from "../../types/ITutor";
import { FilterOptions, SelectedFilters, SortOption, SubjectCount } from "../../types/IFilter";
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

// const POPULAR_SUBJECTS_LIMIT = 8;

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
  value.length ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const getInitials = (name?: string) => {
  if (!name) return "T";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
};

const TutorAvatar: React.FC<{ src?: string; name?: string }> = ({ src, name }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return (
      <div
        style={fraunces}
        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] flex-shrink-0"
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
      className="w-16 h-16 rounded-full object-cover border border-[#2A2E3D] flex-shrink-0"
    />
  );
};

const ExploreTutors: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<SelectedFilters>(DEFAULT_FILTERS);
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);

  // const [topSubjects, setTopSubjects] = useState<SubjectCount[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(EMPTY_FILTER_OPTIONS);
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

  // useEffect(() => {
  //   const loadTopSubjects = async () => {
  //     try {
  //       const response = await tutorService.getTopSubjects(POPULAR_SUBJECTS_LIMIT);
  //       if (response.success && response.data) {
  //         setTopSubjects(response.data);
  //       }
  //     } catch (error: unknown) {
  //       console.error(error instanceof Error ? error.message : error);
  //     }
  //   };

  //   loadTopSubjects();
  // }, []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await tutorService.getFilterOptions();
        if (response.success && response.data) {
          setFilterOptions(response.data);
        }
      } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : error);
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
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.sortBy, filters.experienceLevels, filters.subjects, filters.languages]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // const toggleSubjectChip = (subject: string) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     subjects: prev.subjects.includes(subject)
  //       ? prev.subjects.filter((s) => s !== subject)
  //       : [...prev.subjects, subject],
  //   }));
  // };

  const resultsLabel = `${tutors.length} tutor${tutors.length === 1 ? "" : "s"} found`;

  return (
    <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8] px-6 py-15 overflow-hidden">

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }}
        />
      </div>

      <div className="text-center mb-8 max-w-2xl mx-auto">
        <p style={mono} className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2">
          Explore
        </p>
        <h1 style={fraunces} className="text-4xl font-bold">
          Find your tutor
        </h1>
        <p className="text-[#9CA1B5] mt-2">
          Learn from verified professionals, matched to your subject and schedule.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#9CA1B5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors by name, subject, or keyword..."
            className="w-full border border-[#2A2E3D] rounded-xl pl-12 pr-4 py-3 bg-[#171A24] text-[#F3F4F8] placeholder:text-[#6B7185] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF] transition"
          />
        </div>
      </div>

      {/* {topSubjects.length > 0 && (
        <div className="max-w-2xl mx-auto mb-10 flex flex-wrap justify-center gap-2">
          {topSubjects.map(({ subject, count }) => {
            const active = filters.subjects.includes(subject);

            return (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubjectChip(subject)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] border-transparent font-semibold"
                    : "bg-transparent border-[#2A2E3D] text-[#9CA1B5] hover:border-[#7C9CFF] hover:text-[#F3F4F8]"
                }`}
              >
                {capitalize(subject)}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      )} */}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            options={filterOptions}
            priceBounds={priceBounds}
          />
        </div>

        <div className="flex-1 w-full min-w-0">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <span style={mono} className="text-sm text-[#9CA1B5]">
              {!loading && resultsLabel}
            </span>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
              }
              className="border border-[#2A2E3D] rounded-xl px-4 py-2.5 bg-[#171A24] text-[#F3F4F8] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40"
            >
              <option value="all">Sort: All</option>
              <option value="price_low_high">Sort: Price, low to high</option>
              <option value="price_high_low">Sort: Price, high to low</option>
              <option value="name_asc">Sort: Name, A to Z</option>
              <option value="name_desc">Sort: Name, Z to A</option>
            </select>
          </div>

          {loading ? (

            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#7C9CFF]" />
            </div>

          ) : (

            <motion.div layout className="grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
              <AnimatePresence>
                {tutors.length === 0 ? (

                  <div className="col-span-full text-center py-20 text-[#9CA1B5] border border-dashed border-[#2A2E3D] rounded-3xl">
                    No tutors found. Try a different search.
                  </div>

                ) : (

                  tutors.map((tutor) => {
                    const subjects = toArray(tutor.subjects);

                    return (
                      <motion.div
                        key={tutor._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-[#171A24] border border-[#2A2E3D] rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-[#7C9CFF] hover:-translate-y-1 transition"
                      >
                        <div className="flex items-center gap-4">
                          <TutorAvatar src={tutor.profileImage} name={tutor.tutorId?.name} />

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h2 className="text-lg font-bold">{tutor.tutorId?.name}</h2>
                              <BadgeCheck className="w-4 h-4 text-[#7C9CFF]" />
                            </div>

                            {subjects.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {subjects.slice(0, 4).map((subject) => (
                                  <span
                                    key={subject}
                                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2230] text-[#9CA1B5]"
                                  >
                                    {capitalize(subject)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {tutor.description && (
                          <p className="text-sm text-[#9CA1B5] mt-3 leading-relaxed line-clamp-2">
                            {tutor.description}
                          </p>
                        )}

                        <div className="mt-5 pt-4 border-t border-[#2A2E3D] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-current text-[#F3F4F8]" />
                              <span className="text-[12px] font-semibold">4.9</span>
                            </div>
                            <span className="text-[11px] text-[#6B7185]">Tutor</span>
                          </div>

                          <Button
                            onClick={() => navigate(`/tutor/get-tutor/${tutor._id}`)}
                            className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold hover:scale-105 transition rounded-full px-6"
                          >
                            View profile
                          </Button>
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