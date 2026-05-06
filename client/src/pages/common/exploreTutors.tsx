import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { ITutor } from "../../types/ITutor";
import { useAuthStore } from "../../store/authStore";
import { tutorService } from "../../services/tutorService";
import { ISlotRule } from "../../types/ISlotRules";
import { getTutorRuleForClient } from "../../services/slotService";
import { SelectedFilters } from "../../types/IFilter";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../../components/userCommon/filterSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

const ExploreTutors: React.FC = () => {
  const { search, setSearch } = useAuthStore(); // ✅ FIXED
  const navigate = useNavigate();

  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<SelectedFilters>({
    subjects: [],
    languages: [],
    skills: [],
    experienceLevels: [],
    availableDays: [],
    priceRange: { min: 0, max: 2000 },
    sortBy: "price_low_high",
  });

  const [rulesByTutorId, setRulesByTutorId] = useState<
    Record<string, ISlotRule | undefined>
  >({});

  /* ---------------- FETCH TUTORS ---------------- */

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await tutorService.getAllTutors();
        if (res.success && res.data) {
          const list = res.data;
          setTutors(list);

          const rulePromises = list.map(async (tutor) => {
            const userId = tutor.tutorId?._id;
            if (userId) {
              const r = await getTutorRuleForClient(userId);
              if (r.success && r.data?.data) {
                return { tutorId: tutor._id, rule: r.data.data as ISlotRule };
              }
            }
            return null;
          });

          const result = await Promise.all(rulePromises);
          const map: Record<string, ISlotRule> = {};
          result.forEach((it) => {
            if (it?.tutorId && it.rule) map[it.tutorId] = it.rule;
          });

          setRulesByTutorId(map);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  /* ---------------- FILTER + SEARCH ---------------- */

  const processedTutors = useMemo(() => {
    const filteredBySearch = tutors.filter((t) => {
      const name = t.tutorId?.name ?? "Tutor";
      return name.toLowerCase().includes(search.toLowerCase());
    });

    return filteredBySearch
      .filter((t) => {
        const rule = rulesByTutorId[t._id];
        if (!rule) return true;
        return rule.amount <= filters.priceRange.max;
      })
      .filter((t) => {
        if (!filters.experienceLevels.length) return true;
        return filters.experienceLevels.includes(t.experienceLevel || "");
      })
      .sort((a, b) => {
        const ruleA = rulesByTutorId[a._id];
        const ruleB = rulesByTutorId[b._id];

        switch (filters.sortBy) {
          case "price_low_high":
            return (ruleA?.amount ?? 999999) - (ruleB?.amount ?? 999999);
          case "price_high_low":
            return (ruleB?.amount ?? 0) - (ruleA?.amount ?? 0);
          case "name_asc":
            return (a.tutorId?.name || "").localeCompare(b.tutorId?.name || "");
          case "name_desc":
            return (b.tutorId?.name || "").localeCompare(a.tutorId?.name || "");
          default:
            return 0;
        }
      });
  }, [tutors, rulesByTutorId, filters, search]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold text-slate-600">
        Loading tutors...
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-50 px-6 md:px-10 py-10 relative overflow-hidden">

      {/* FILTER SIDEBAR */}
      <AnimatePresence>
        {showFilter && (
          <FilterSidebar
            isOpen={true}
            filters={filters}
            onClose={() => setShowFilter(false)}
            onChange={setFilters}
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900">
          Find Your Perfect Tutor
        </h2>
        <p className="text-slate-500 mt-2">
          Learn from verified professionals around the world
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search tutors..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-s-black focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <Button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-2 bg-white border border-m text-slate-700 hover:bg-slate-100 rounded-xl px-6"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </Button>
      </div>

      {/* GRID */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {processedTutors.map((t) => {
            const rule = rulesByTutorId[t._id];
            const name = t.tutorId?.name ?? "Tutor";

            return (
              <motion.div
                key={t._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.profileImage}
                    className="w-20 h-20 rounded-2xl object-cover shadow"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{name}</h3>
                    <p className="text-slate-500 text-sm">{t.occupation}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Education:
                    </span>{" "}
                    {t.education}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">
                      Experience:
                    </span>{" "}
                    {t.experienceLevel || "Not specified"}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-black-600 font-bold text-lg">
                    {rule?.amount ? `₹${rule.amount}` : "N/A"}
                  </span>

                  <Button
                    onClick={() => navigate(`/tutor/get-tutor/${t._id}`)}
                    className="rounded-full bg-black hover:bg-gray-600 text-white px-6"
                  >
                    View
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExploreTutors;