import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserSidebar from "../../components/userCommon/sidebar";
import { Button } from "../../components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { Calendar, Trash2, Edit } from "lucide-react";
import { createSlotRule, getSlots, deleteSlot, getSlotRule} from "../../services/slotService";
import { ISlot, ISlotRule } from "../../types/ISlotRules";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SlotManagement: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(60);
  const [amount, setAmount] = useState(0);
  const [durationUnit, setDurationUnit] = useState("minutes");
  const [generatedSlots, setGeneratedSlots] = useState<ISlot[]>([]);
  const [existingRule, setExistingRule] = useState<ISlotRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  //// For delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const fetchRule = async () => {
    try {
      const res = await getSlotRule();
      if (res.success && res.data?.data) {
        setExistingRule(res.data.data);
        setSelectedDays(res.data.data.selectedDays || []);
        setStartTime(res.data.data.startTime || "09:00");
        setEndTime(res.data.data.endTime || "17:00");
        setDuration(res.data.data.duration || 60);
        setDurationUnit(res.data.data.durationUnit || "minutes");
        setAmount(res.data.data.amount || 0);
      }else if (!res.success) {
        toast.error(`${res.statusCode ?? 400}: ${res.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await getSlots();
      if (res.success && Array.isArray(res.data?.data)) {
        setGeneratedSlots(res.data.data);
      } else {
        setGeneratedSlots([]);
        if (!res.success) toast.error(`${res.statusCode}: ${res.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch slots.");
    }
  };

  const handleSaveRule = async () => {
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day!");
      return;
    }
    setLoading(true);
    try {
      await createSlotRule({
        days: selectedDays,
        startTime,
        endTime,
        duration,
        durationUnit,
        amount,
      });
      toast.success("Slot rule saved successfully!");
      setShowForm(false);
      fetchRule();
      fetchSlots();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save slot rule.");
    } finally {
      setLoading(false);
    }
  };

  // delete slot confirmation modal trigr
  const confirmDeleteSlot = (slotId: string) => {
    setSlotToDelete(slotId);
    setShowConfirm(true);
  };

  // deletion after confirmation
  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;
    try {
      await deleteSlot(slotToDelete);
      setGeneratedSlots((prev) => prev.filter((s) => s._id !== slotToDelete));
      toast.success("Slot deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete slot.");
    } finally {
      setShowConfirm(false);
      setSlotToDelete(null);
    }
  };

  useEffect(() => {
    fetchRule();
    fetchSlots();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0118] via-[#160733] to-[#1a002e] text-white relative">
      <UserSidebar />

      <main className="flex-1 p-10 overflow-y-auto relative">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Slot Management
          </h1>

          {/* Rule Section */}
          <div className="bg-black/30 border border-purple-800 rounded-2xl p-6 mb-8 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-pink-400" /> Slot Rules
            </h2>

            {!showForm ? (
              existingRule ? (
                <div className="space-y-4">
                  <p>
                    <strong>Days:</strong> {existingRule?.selectedDays?.join(", ") || "No days selected"}

                  </p>
                  <p>
                    <strong>Time:</strong> {existingRule.startTime} -{" "}
                    {existingRule.endTime}
                  </p>
                  <p>
                    <strong>Duration:</strong> {existingRule.duration}{" "}
                    {existingRule.durationUnit}
                  </p>
                  <p>
                    <strong>Amount:</strong> {existingRule.amount}{" "}
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Rule
                  </Button>
                </div>
              ) : (
                <div className="text-gray-400 italic">
                  No rule found. Click below to create.
                  <div className="mt-4">
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-700 text-white"
                    >
                      Create Rule
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-6">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        selectedDays.includes(day)
                          ? "bg-gradient-to-r from-pink-500 to-indigo-500 text-white"
                          : "border-purple-700 text-gray-300 hover:bg-purple-900/30"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm text-gray-400">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 bg-black/40 border border-purple-700 rounded-lg text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2 bg-black/40 border border-purple-700 rounded-lg text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-black/40 border border-purple-700 rounded-lg text-gray-200"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-sm text-gray-400">
                      Slot Duration
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-black/40 border border-purple-700 rounded-lg text-gray-200"
                      />
                      <select
                        value={durationUnit}
                        onChange={(e) => setDurationUnit(e.target.value)}
                        className="px-4 py-2 bg-black/40 border border-purple-700 rounded-lg text-gray-200"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6 gap-4">
                  <Button
                    onClick={handleSaveRule}
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-700 text-white font-semibold py-2 px-6 rounded-xl hover:scale-105 transition-transform"
                  >
                    {loading ? "Saving..." : "Save Rule"}
                  </Button>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="border border-gray-400 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Slots Table */}
          <div className="overflow-hidden rounded-2xl border border-purple-800/40 bg-gradient-to-b from-black/30 via-purple-950/30 to-black/40 backdrop-blur-md shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-purple-900/40 text-gray-300">
                <tr>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Start</th>
                  <th className="py-3 px-4">End</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {generatedSlots.length > 0 ? (
                  generatedSlots.map((slot) => (
                    <tr
                      key={slot._id}
                      className="border-b border-gray-800 hover:bg-purple-900/20 transition"
                    >
                      <td className="py-3 px-4">{slot.day}</td>
                      <td className="py-3 px-4 text-gray-200">
                        {slot.startTime}
                      </td>
                      <td className="py-3 px-4 text-gray-200">
                        {slot.endTime}
                      </td>
                      <td className="py-3 px-4 text-gray-200 text-center">
                        {slot.isBooked?(
                          <p className="text-red-400">Booked</p>
                        ):(
                          <p className="text-green-500">Available</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {slot.isBooked?(
                         <p>-</p>
                        ):(
                          <button
                          onClick={() => confirmDeleteSlot(slot._id)}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-gray-400 italic"
                    >
                      No slots generated yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a002e] border border-purple-700 rounded-2xl p-6 shadow-2xl text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this slot?
            </h2>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleDeleteSlot}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
              >
                Yes, Delete
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SlotManagement;
