import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import Header from "../../components/userCommon/Header";
import { ITutor } from "../../types/ITutor";
import { ISlot } from "../../types/ISlotRules";
import { useAuthStore } from "../../store/authStore";
import { tutorService } from "../../services/tutorService";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { bookSlot, showSlots } from "../../services/sessionService";

const ExploreTutors: React.FC = () => {
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const { search, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<ITutor | null>(null);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await tutorService.getAllTutors();
        if (response.success && response.data) setTutors(response.data);
      } catch (err) {
        console.error("Failed to fetch tutors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    const name =
      typeof tutor.tutorId === "object" && tutor.tutorId?.name
        ? tutor.tutorId.name
        : "Tutor";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleViewTutor = (tutor: ITutor) => setSelectedTutor(tutor);

  const handleShowSlots = async (tutorId: string) => {
    setSlotLoading(true);
    setShowSlotsModal(true);
    try {
      const res = await showSlots(tutorId);
      setSlots(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load slots", err);
    } finally {
      setSlotLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    try {
      const res = await bookSlot(slotId,user?._id);
      if (res.data?.success) {
        toast.success("Booking confirmed!");
        setSlots((prev) => prev.filter((s) => s._id !== slotId));
      } else {
        toast.error(res.data?.message || "Booking failed");
      }
    } catch (err) {
      console.error("Error booking slot", err);
      toast.error("Something went wrong while booking the slot");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading tutors...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900">
      <Header />

      <div className="w-full text-center mt-4 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-700 to-pink-600">
          Explore Verified Tutors
        </h2>
        <p className="text-gray-700 mt-1 text-sm md:text-base">
          Connect with skilled and verified tutors to achieve your learning
          goals.
        </p>
      </div>

      <div className="flex w-full mt-6 px-4 md:px-8 gap-6">
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor._id}
              className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={tutor.profileImage}
                  alt="Tutor"
                  className="w-24 h-24 object-cover rounded-xl shadow-sm border"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {typeof tutor.tutorId === "object" && tutor.tutorId?.name
                      ? tutor.tutorId.name
                      : "Tutor"}
                  </h3>
                  <p className="text-gray-500 text-sm">{tutor.occupation}</p>
                  <p className="text-sm text-gray-700">{tutor.education}</p>
                  <h3 className="text-sm text-gray-700">
                    {tutor.description}
                  </h3>
                  <p className="text-yellow-500 mt-1">⭐ Verified</p>
                </div>
              </div>
              <Button
                className="mt-4 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-full px-4 py-2 text-sm hover:scale-105 transition"
                onClick={() => handleViewTutor(tutor)}
              >
                View Details
              </Button>
            </div>
          ))}
        </section>
      </div>

      {/* Tutor Details Modal */}
      <AnimatePresence>
        {selectedTutor && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-lg"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedTutor(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg"
              >
                ✕
              </button>

              <div className="flex gap-6 mb-6">
                <img
                  src={selectedTutor.profileImage}
                  alt="Tutor"
                  className="w-32 h-32 rounded-xl object-cover shadow-md border"
                />
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {typeof selectedTutor.tutorId === "object" &&
                    selectedTutor.tutorId?.name
                      ? selectedTutor.tutorId.name
                      : "Tutor"}
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {selectedTutor.description}
                  </p>
                  <p className="text-md mt-2 text-gray-600">
                    🎓 <strong>Education:</strong> {selectedTutor.education}
                  </p>
                  <p className="text-md mt-1 text-gray-600">
                    💼 <strong>Occupation:</strong> {selectedTutor.occupation}
                  </p>
                  <p className="text-md mt-1 text-gray-600">
                    ⚧ <strong>Gender:</strong> {selectedTutor.gender}
                  </p>
                  <p className="text-md mt-1 text-gray-600">
                    🕒 <strong>Experience:</strong>{" "}
                    {selectedTutor.experienceLevel}
                  </p>
                  <p className="text-md mt-1 text-gray-600">
                    🌍 <strong>Languages:</strong>{" "}
                    {selectedTutor.languages?.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-full px-6 py-2 mt-4 hover:scale-105 transition"
                  onClick={() => {
                    const tutorId =
                      typeof selectedTutor?.tutorId === "object"
                        ? selectedTutor.tutorId._id
                        : selectedTutor?.tutorId;
                    if (tutorId) handleShowSlots(tutorId);
                  }}
                >
                  📅 Book a Session
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slots Modal */}
      {/* Slots Modal */}
<AnimatePresence>
  {showSlotsModal && (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl border border-gray-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowSlotsModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
          Available Slots
        </h3>

        {slotLoading ? (
          <p className="text-center text-gray-600">Loading slots...</p>
        ) : slots.length > 0 ? (
          Object.entries(
            slots.reduce((acc, slot) => {
              const day = slot.day || "Other";
              if (!acc[day]) acc[day] = [];
              acc[day].push(slot);
              return acc;
            }, {} as Record<string, ISlot[]>)
          ).map(([day, daySlots]) => (
            <div key={day} className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 border-l-4 border-purple-600 pl-2 mb-3">
                {day}
              </h4>

              {/* FLEX ROW LAYOUT */}
              <div className="flex flex-wrap gap-4">
                {daySlots.map((slot) => (
                  <motion.div
                    key={slot._id}
                    whileHover={{ scale: 1.03 }}
                    className={`flex flex-col justify-between p-4 w-[220px] rounded-xl border transition-all duration-200 ${
                      slot.isBooked
                        ? "bg-gray-100 border-gray-200 text-gray-400"
                        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-gray-300 hover:shadow-lg"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            slot.isBooked
                              ? "bg-gray-300"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {slot.isBooked ? "Booked" : "Available"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        ⏱ {slot.duration || 60} mins
                      </p>
                      <p className="text-xs text-gray-600">
                        💰 ₹{slot.amount || 500}
                      </p>
                    </div>

                    {!slot.isBooked && (
                      <Button
                        onClick={() =>{
                          setSelectedSlotId(slot._id); 
                          setConfirmModal(true);
                        }}
                        className="mt-3 w-full bg-gradient-to-r from-blue-800 to-purple-700 text-white rounded-xl py-1 text-xs hover:scale-105 transition-transform"
                      >
                        Book
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No slots available for this tutor.
          </p>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* ✅ Confirmation Modal */}
<AnimatePresence>
  {confirmModal && (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border border-gray-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Booking
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to book this session?
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              if (selectedSlotId) handleBookSlot(selectedSlotId);
              setConfirmModal(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Yes, Book
          </Button>
          <Button
            onClick={() => setConfirmModal(false)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ExploreTutors;
