// ======================================
// ExploreTutors.tsx
// ======================================

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";

import FilterSidebar from "../../components/userCommon/filterSidebar";

import { tutorService } from "../../services/tutorService";

import { getTutorRuleForClient } from "../../services/slotService";

import { useAuthStore } from "../../store/authStore";

import { ITutor } from "../../types/ITutor";

import {
  ISlotRule,
  ISchedule,
} from "../../types/ISlotRules";

import { SelectedFilters } from "../../types/IFilter";

const ExploreTutors: React.FC = () => {
  const navigate = useNavigate();

  const { search, setSearch } =
    useAuthStore();

  const [loading, setLoading] =
    useState(true);

  const [showFilter, setShowFilter] =
    useState(false);

  const [tutors, setTutors] = useState<
    ITutor[]
  >([]);

  const [rulesByTutorId, setRulesByTutorId] =
    useState<
      Record<
        string,
        ISlotRule | undefined
      >
    >({});

  const [filters, setFilters] =
    useState<SelectedFilters>({
      subjects: [],
      languages: [],
      skills: [],
      experienceLevels: [],
      availableDays: [],
      priceRange: {
        min: 0,
        max: 10000,
      },
      sortBy: "price_low_high",
    });

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res =
          await tutorService.getAllTutors();

        if (res.success && res.data) {
          setTutors(res.data);

          const rules =
            await Promise.all(
              res.data.map(
                async (tutor) => {
                  const tutorUserId =
                    tutor.tutorId?._id;

                  if (!tutorUserId)
                    return null;

                  const rule =
                    await getTutorRuleForClient(
                      tutorUserId
                    );

                  return {
                    tutorId: tutor._id,
                    rule:
                      rule.data?.data,
                  };
                }
              )
            );

          const map: Record<
            string,
            ISlotRule
          > = {};

          rules.forEach((r) => {
            if (
              r?.tutorId &&
              r.rule
            ) {
              map[r.tutorId] =
                r.rule;
            }
          });

          setRulesByTutorId(map);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const getMinPrice = (
    schedules?: ISchedule[]
  ) => {
    if (!schedules?.length)
      return null;

    return Math.min(
      ...schedules.map(
        (s) => s.amount
      )
    );
  };

  /* ---------------- FILTER ---------------- */

  const processedTutors =
    useMemo(() => {
      return tutors
        .filter((tutor) => {
          const name =
            tutor.tutorId?.name?.toLowerCase() ||
            "";

          return name.includes(
            search.toLowerCase()
          );
        })

        .filter((tutor) => {
          const schedules =
            rulesByTutorId[
              tutor._id
            ]?.schedules || [];

          const minPrice =
            getMinPrice(
              schedules
            ) || 0;

          return (
            minPrice <=
            filters.priceRange.max
          );
        })

        .sort((a, b) => {
          const aPrice =
            getMinPrice(
              rulesByTutorId[a._id]
                ?.schedules
            ) || 999999;

          const bPrice =
            getMinPrice(
              rulesByTutorId[b._id]
                ?.schedules
            ) || 999999;

          switch (
            filters.sortBy
          ) {
            case "price_low_high":
              return (
                aPrice - bPrice
              );

            case "price_high_low":
              return (
                bPrice - aPrice
              );

            default:
              return 0;
          }
        });
    }, [
      tutors,
      search,
      filters,
      rulesByTutorId,
    ]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading tutors...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      {/* FILTER */}
      <AnimatePresence>
        {showFilter && (
          <FilterSidebar
            isOpen
            filters={filters}
            onClose={() =>
              setShowFilter(false)
            }
            onChange={setFilters}
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          Explore Tutors
        </h1>

        <p className="text-slate-500 mt-2">
          Learn from verified
          professionals.
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-10">

        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search tutors..."
            className="w-full border rounded-xl pl-12 pr-4 py-3 bg-white"
          />
        </div>

        <Button
          onClick={() =>
            setShowFilter(true)
          }
          className="bg-white text-black border hover:bg-slate-100"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
        </Button>
      </div>

      {/* GRID */}
      <motion.div
        layout
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>

          {!processedTutors.length ? (
            <div className="col-span-full text-center py-20 text-slate-500">
              No tutors available
            </div>
          ) : (
            processedTutors.map(
              (tutor) => {
                const rule =
                  rulesByTutorId[
                    tutor._id
                  ];

                const minPrice =
                  getMinPrice(
                    rule?.schedules
                  );

                return (
                  <motion.div
                    key={tutor._id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition"
                  >
                    <div className="flex items-center gap-4">

                      <img
                        src={
                          tutor.profileImage
                        }
                        className="w-20 h-20 rounded-2xl object-cover"
                      />

                      <div>
                        <h2 className="text-xl font-bold">
                          {
                            tutor
                              .tutorId
                              ?.name
                          }
                        </h2>

                        <p className="text-sm text-slate-500">
                          {
                            tutor.occupation
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">

                      <p>
                        <b>
                          Experience:
                        </b>{" "}
                        {
                          tutor.experienceLevel
                        }
                      </p>

                      <p>
                        <b>
                          Education:
                        </b>{" "}
                        {
                          tutor.education
                        }
                      </p>
                    </div>

                    <div className="mt-6 flex justify-between items-center">

                      <span className="text-lg font-bold text-emerald-600">
                        {minPrice
                          ? `Starts from ₹${minPrice}`
                          : "No slots"}
                      </span>

                      <Button
                        onClick={() =>
                          navigate(
                            `/tutor/get-tutor/${tutor._id}`
                          )
                        }
                        className="bg-black hover:bg-slate-800 text-white rounded-full px-6"
                      >
                        View
                      </Button>
                    </div>
                  </motion.div>
                );
              }
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExploreTutors;