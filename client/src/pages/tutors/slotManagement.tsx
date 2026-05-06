import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserSidebar from "../../components/userCommon/sidebar";
import { Button } from "../../components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { Calendar, Edit } from "lucide-react";
import { createSlotRule, getSlotRule } from "../../services/slotService";
import { ISlotRule } from "../../types/ISlotRules";

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
  const [existingRule, setExistingRule] = useState<ISlotRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const fetchRule = async () => {
    try {
      const res = await getSlotRule();
      if (res.success && res.data?.data) {
        const r = res.data.data;
        setExistingRule(r);
        setSelectedDays(r.selectedDays || []);
        setStartTime(r.startTime || "09:00");
        setEndTime(r.endTime || "17:00");
        setDuration(r.duration || 60);
        setDurationUnit(r.durationUnit || "minutes");
        setAmount(r.amount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRule = async () => {
    if (selectedDays.length === 0) {
      toast.error("Select at least one day");
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
      toast.success("Slot rule saved");
      setShowForm(false);
      fetchRule();
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRule();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 ">
      <Toaster position="top-center" />
      <UserSidebar />

      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Slot Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure your availability and session pricing.
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white border rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-600" />
                Slot Rules
              </h2>

              {!showForm && (
                <Button
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  {existingRule ? "Edit" : "Create"}
                </Button>
              )}
            </div>

            {/* VIEW MODE */}
            {!showForm && existingRule && (
              <div className="space-y-3 text-sm text-slate-700">
                <p><b>Days:</b> {existingRule.selectedDays?.join(", ")}</p>
                <p><b>Time:</b> {existingRule.startTime} - {existingRule.endTime}</p>
                <p><b>Duration:</b> {existingRule.duration} {existingRule.durationUnit}</p>
                <p><b>Amount:</b> ₹{existingRule.amount}</p>
              </div>
            )}

            {!showForm && !existingRule && (
              <p className="text-slate-400 text-sm">
                No slot rule found. Create one to start accepting bookings.
              </p>
            )}

            {/* FORM */}
            {showForm && (
              <div className="space-y-6">

                {/* DAYS */}
                <div>
                  <p className="text-sm font-medium mb-2">Select Days</p>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition ${
                          selectedDays.includes(day)
                            ? "bg-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TIME + AMOUNT */}
                <div className="grid md:grid-cols-2 gap-4" >
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  />

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  />

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Amount"
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  />
                </div>

                {/* DURATION */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="border border-slate-200 rounded-lg px-3 py-2 w-full"
                  />

                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveRule}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SlotManagement;