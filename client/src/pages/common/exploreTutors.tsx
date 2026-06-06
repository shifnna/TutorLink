import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import FilterSidebar from "../../components/userCommon/filterSidebar";
import { tutorService } from "../../services/tutorService";
import { ITutor } from "../../types/ITutor";
import { SelectedFilters } from "../../types/IFilter";
import { useAuthStore } from "../../store/authStore";

const ExploreTutors: React.FC = () => {

  const navigate = useNavigate();

  const { search, setSearch } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(true);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [tutors, setTutors] = useState<ITutor[]>([]);

  const [filters, setFilters] = useState<SelectedFilters>({
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

  useEffect(() => {

    const timer = setTimeout(() => {
      fetchTutors();
    }, 400);

    return () => clearTimeout(timer);

  }, [search, filters]);

  const fetchTutors = async (): Promise<void> => {

    try {

      setLoading(true);

      const response = await tutorService.getAllTutors({
        search,
        experienceLevels: filters.experienceLevels,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        sortBy: filters.sortBy,
      });

      if (response.success && response.data) {
        setTutors(response.data);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      <AnimatePresence>
        {showFilter && (
          <FilterSidebar
            isOpen
            filters={filters}
            onClose={() => setShowFilter(false)}
            onChange={setFilters}
          />
        )}
      </AnimatePresence>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          Explore Tutors
        </h1>

        <p className="text-slate-500 mt-2">
          Learn from verified professionals.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-10">

        <div className="relative flex-1">

          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
            className="w-full border rounded-xl pl-12 pr-4 py-3 bg-white"
          />
        </div>

        <Button
          onClick={() => setShowFilter(true)}
          className="bg-white text-black border hover:bg-slate-100"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
        </Button>
      </div>

      {loading ? (

        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-black" />
        </div>

      ) : (

        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >

          <AnimatePresence>

            {!tutors.length ? (

              <div className="col-span-full text-center py-20 text-slate-500">
                No tutors found
              </div>

            ) : (

              tutors.map((tutor) => (

                <motion.div
                  key={tutor._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={tutor.profileImage}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />

                    <div>
                      <h2 className="text-xl font-bold">
                        {tutor.tutorId?.name}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {tutor.occupation}
                      </p>
                      
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">

                    <p>
                      <b>Experience:</b> {tutor.experienceLevel}
                    </p>

                    <p>
                      <b>Education:</b> {tutor.education}
                    </p>
                    
                  </div>

                  <div className="mt-6 flex justify-end">

                    <Button
                      onClick={() =>
                        navigate(`/tutor/get-tutor/${tutor._id}`)
                      }
                      className="bg-black hover:bg-slate-800 text-white rounded-full px-6"
                    >
                      View
                    </Button>
                  </div>

                </motion.div>
              ))
            )}

          </AnimatePresence>

        </motion.div>
      )}
    </div>
  );
};

export default ExploreTutors;