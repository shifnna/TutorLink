import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, BadgeCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { tutorService } from "../../services/tutorService";
import { ITutor } from "../../types/ITutor";
import { useAuthStore } from "../../store/authStore";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

type SortOption = "all" | "price_low_high" | "price_high_low" | "name_asc" | "name_desc";

// Waits until `value` stops changing for `delayMs` before updating the
// returned value. Used on the search box so we're not firing a request
// on every keystroke.
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

// Tutor "skills" sometimes comes back as a comma-joined string instead of
// string[] (same normalization ApplicationModal already does elsewhere).
const toArray = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  return Array.isArray(value)
    ? value
    : value.split(",").map((v) => v.trim()).filter(Boolean);
};

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
  const { search, setSearch } = useAuthStore();

  const [sortBy, setSortBy] = useState<SortOption>("all");
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 400);

  // Load the homepage's display + mono typefaces once.
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

  const fetchTutors = useCallback(async () => {
    setLoading(true);

    try {
      const response = await tutorService.getAllTutors({
        search: debouncedSearch,
        sortBy,
      });

      if (response.success && response.data) {
        setTutors(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const resultsLabel = `${tutors.length} tutor${tutors.length === 1 ? "" : "s"} found`;

  return (
    <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8] px-6 py-15 overflow-hidden">

      {/* background glow — matches Home */}
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

      <div className="max-w-2xl mx-auto mb-10">
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

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
          <span style={mono} className="text-sm text-[#9CA1B5]">
            {!loading && resultsLabel}
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                  const skills = toArray(tutor.skills);

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

                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2230] text-[#9CA1B5]"
                                >
                                  {skill}
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
  );
};

export default ExploreTutors;