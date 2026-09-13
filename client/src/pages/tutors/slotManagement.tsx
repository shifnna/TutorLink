import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TriangleAlert } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "../../components/ui/button";

import {
  createSlotRule,
  getSlotRule,
} from "../../services/slotService";

import {
  ISchedule,
} from "../../types/ISlotRules";

// Midnight theme type treatment — same Fraunces / Space Mono pairing as the homepage
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const toastDarkOptions = {
  style: {
    background: "#171A24",
    color: "#F3F4F8",
    border: "1px solid #2A2E3D",
  },
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialForm = {
  startTime: "",
  endTime: "",
  duration: 60,
  durationUnit: "minutes",
  amount: 0,
};

const SlotManagement = () => {

  const [selectedDay, setSelectedDay] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm);

  const [schedules, setSchedules] = useState<ISchedule[]>([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {

    try {

      const res = await getSlotRule();

      if (res.success && res.data?.data?.schedules) {

        setSchedules(
          res.data.data.schedules.filter(
            (slot) => !slot.isBooked
          )
        );
      }

    } catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
    }
  };

  const validate = (): boolean => {

    if (!selectedDay) {
      toast.error("Please select a day");
      return false;
    }

    if (!form.startTime.trim()) {
      toast.error("Start time is required");
      return false;
    }

    if (!form.endTime.trim()) {
      toast.error("End time is required");
      return false;
    }

    if (form.startTime >= form.endTime) {
      toast.error("End time must be greater than start time");
      return false;
    }

    const start = new Date(`1970-01-01T${form.startTime}`);
const end = new Date(`1970-01-01T${form.endTime}`);

const timeDifference =
  (end.getTime() - start.getTime()) / (1000 * 60);

if (timeDifference > 240) {
  toast.error("Slot time cannot exceed 4 hours (240 minutes)");
  return false;
}

const durationInMinutes =
  form.durationUnit === "hours"
    ? form.duration * 60
    : form.duration;

if (durationInMinutes > 240) {
  toast.error("Session duration cannot exceed 4 hours (240 minutes)");
  return false;
}

if (durationInMinutes > timeDifference) {
  toast.error("Session duration cannot be longer than the selected time slot");
  return false;
}

    if (!form.duration || form.duration <= 0) {
      toast.error("Enter valid session duration");
      return false;
    }

    if (
      form.durationUnit !== "minutes" &&
      form.durationUnit !== "hours"
    ) {
      toast.error("Select valid duration unit");
      return false;
    }

    if (!form.amount || form.amount <= 0) {
      toast.error("Enter valid session price");
      return false;
    }

    const overlap = schedules.find(
      (slot) =>
        slot.day === selectedDay &&
        form.startTime < slot.endTime &&
        form.endTime > slot.startTime
    );

    if (overlap) {
      toast.error("This slot overlaps with another slot");
      return false;
    }

    return true;
  };

  const addSlot = () => {

    if (!validate()) return;

    setSchedules((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        day: selectedDay,
        ...form,
      },
    ]);

    toast.success("Slot added");

    setForm(initialForm);
  };

  const removeSlot = (id?: string) => {

    toast((t) => (
      <div className="flex flex-col gap-4">

        <div className="flex items-start gap-3">

          <TriangleAlert className="w-5 h-5 text-amber-400 mt-0.5" />

          <div>
            <h3 className="font-semibold text-[#F3F4F8]">
              Remove slot?
            </h3>

            <p className="text-sm text-[#9CA1B5]">
              This slot will be removed permanently.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">

          <Button
            variant="outline"
            size="sm"
            className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            className="bg-rose-500 text-white hover:scale-105 transition"
            onClick={() => {

              setSchedules((prev) =>
                prev.filter((slot) => slot.id !== id)
              );

              toast.dismiss(t.id);

              toast.success("Slot removed");
            }}
          >
            Remove
          </Button>

        </div>
      </div>
    ), {
      duration: 5000,
      style: toastDarkOptions.style,
    });
  };

  const saveSchedules = async () => {

    if (!schedules.length) {
      toast.error("Add at least one slot");
      return;
    }

    setLoading(true);

    try {

      const res = await createSlotRule({
        schedules,
      });

      if (!res.success) {

        toast.error(
          res.message || "Failed to save"
        );

        return;
      }

      toast.success(
        "Schedules saved successfully"
      );

      setShowForm(false);

      fetchSchedules();

    } catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
      toast.error("Something went wrong");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#0E1016] text-[#F3F4F8]">

      {/* Ambient background, same treatment as the homepage */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)", animationDelay: "-4s" }}
        />
        <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
      </div>

      <Toaster position="top-center" toastOptions={toastDarkOptions} />

      {/* <UserSidebar /> */}

      <main className="relative flex-1 px-8 py-10 overflow-y-auto">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >

          <div>
            <span
              style={mono}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Scheduling
            </span>

            {/* <h2 style={fraunces} className="mt-4 text-3xl font-bold">
              Slot Management
            </h2> */}

            <p className="text-[#9CA1B5] mt-1">
              Configure tutoring schedules.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] shadow-xl p-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

            <div className="flex items-center justify-between mb-6">

              <h2 style={fraunces} className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="w-5 h-5 text-[#7C9CFF]" />
                Weekly Slots
              </h2>

              {!showForm && (
                <Button
                  className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-5 hover:scale-105 transition"
                  onClick={() => setShowForm(true)}
                >
                  {schedules.length ? "Edit" : "Create"}
                </Button>
              )}
            </div>

            {!showForm && !schedules.length && (
              <p className="text-[#9CA1B5]/70 text-sm italic">
                No schedules configured.
              </p>
            )}

            {!showForm && !!schedules.length && (

              <div className="space-y-3">

                {schedules.map((slot) => (

                  <div
                    key={slot.id}
                    className="flex justify-between items-center border border-[#2A2E3D] rounded-xl p-4 bg-[#1E2230]"
                  >

                    <div>
                      <h3 className="font-semibold text-[#F3F4F8]">
                        {slot.day}
                      </h3>

                      <p className="text-sm text-[#9CA1B5]">
                        {slot.startTime} - {slot.endTime}
                      </p>

                      <p style={mono} className="text-sm text-[#9CA1B5]">
                        {slot.duration} {slot.durationUnit}
                      </p>
                    </div>

                    <span style={mono} className="font-bold text-emerald-400">
                      ₹{slot.amount}
                    </span>

                  </div>
                ))}

              </div>
            )}

            {showForm && (

              <div className="space-y-8">

                <div className="space-y-3">

                  <div>
                    <h3 className="font-semibold text-[#F3F4F8]">
                      Select Day
                    </h3>

                    <p className="text-sm text-[#9CA1B5]">
                      Multiple slots allowed.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {days.map((day) => (

                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelectedDay(day);
                          setForm(initialForm);
                        }}
                        className={`px-4 py-2 rounded-full border text-sm transition ${
                          selectedDay === day
                            ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold border-transparent hover:scale-105"
                            : "bg-[#1E2230] border-[#2A2E3D] text-[#9CA1B5] hover:text-[#F3F4F8] hover:border-[#7C9CFF]"
                        }`}
                      >
                        {day}
                      </button>
                    ))}

                  </div>
                </div>

                {!!selectedDay && (

                  <div className="bg-[#1E2230] border border-[#2A2E3D] rounded-2xl p-6 space-y-6">

                    <div>
                      <h3 style={fraunces} className="text-lg font-semibold">
                        {selectedDay} Slot
                      </h3>

                      <p className="text-sm text-[#9CA1B5]">
                        Configure slot timing and pricing.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                      <div>
                        <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">
                          Start Time
                        </label>

                        <input
                          type="time"
                          value={form.startTime}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full mt-2 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF]/40 transition [color-scheme:dark]"
                        />
                      </div>

                      <div>
                        <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">
                          End Time
                        </label>

                        <input
                          type="time"
                          value={form.endTime}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full mt-2 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF]/40 transition [color-scheme:dark]"
                        />
                      </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                      <div>

                        <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">
                          Session Duration
                        </label>

                        <div className="flex gap-2 mt-2">

                          <input
                            type="number"
                            value={form.duration}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                duration: Number(e.target.value),
                              })
                            }
                            className="w-full border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF]/40 transition [color-scheme:dark]"
                          />

                          <select
                            value={form.durationUnit}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                durationUnit: e.target.value,
                              })
                            }
                            className="border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 [color-scheme:dark]"
                          >
                            <option value="minutes">
                              Minutes
                            </option>

                            <option value="hours">
                              Hours
                            </option>

                          </select>

                        </div>
                      </div>

                      <div>

                        <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">
                          Session Price
                        </label>

                        <div className="relative mt-2">

                          <span className="absolute left-4 top-3 text-[#9CA1B5]">
                            ₹
                          </span>

                          <input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                amount: Number(e.target.value),
                              })
                            }
                            className="w-full border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 focus:border-[#7C9CFF]/40 transition [color-scheme:dark]"
                            placeholder="500"
                          />

                        </div>
                      </div>

                    </div>

                    <Button
                      type="button"
                      onClick={addSlot}
                      className="bg-emerald-500 text-[#0E1016] font-semibold rounded-full px-5 hover:scale-105 transition"
                    >
                      Add Slot
                    </Button>

                  </div>
                )}

                {!!schedules.length && (

                  <div className="space-y-3">

                    <h3 className="font-semibold text-[#F3F4F8]">
                      Saved Slots
                    </h3>

                    {schedules.map((slot) => (

                      <div
                        key={slot.id}
                        className="flex justify-between items-center border border-[#2A2E3D] rounded-xl p-4 bg-[#1E2230]"
                      >

                        <div>

                          <h4 className="font-semibold text-[#F3F4F8]">
                            {slot.day}
                          </h4>

                          <p className="text-sm text-[#9CA1B5]">
                            {slot.startTime} - {slot.endTime}
                          </p>

                          <p style={mono} className="text-sm text-[#9CA1B5]">
                            {slot.duration} {slot.durationUnit}
                          </p>

                        </div>

                        <div className="flex items-center gap-4">

                          <span style={mono} className="font-bold text-emerald-400">
                            ₹{slot.amount}
                          </span>

                          <Button
                            variant="destructive"
                            className="bg-rose-500 text-white rounded-full hover:scale-105 transition"
                            onClick={() => removeSlot(slot.id)}
                          >
                            Remove
                          </Button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

                <div className="flex gap-3 pt-4">

                  <Button
                    onClick={saveSchedules}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-6 hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? "Saving..." : "Save Rules"}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent rounded-full transition"
                    onClick={() => {

                      if (JSON.stringify(form) !== JSON.stringify(initialForm)) {

                        toast((t) => (

                          <div className="flex flex-col gap-4">

                            <div className="flex items-start gap-3">

                              <TriangleAlert className="w-5 h-5 text-amber-400 mt-0.5" />

                              <div>

                                <h3 className="font-semibold text-[#F3F4F8]">
                                  Cancel changes?
                                </h3>

                                <p className="text-sm text-[#9CA1B5]">
                                  Unsaved slot changes will be lost.
                                </p>

                              </div>
                            </div>

                            <div className="flex justify-end gap-2">

                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent transition"
                                onClick={() => toast.dismiss(t.id)}
                              >
                                Continue Editing
                              </Button>

                              <Button
                                size="sm"
                                className="bg-rose-500 text-white hover:scale-105 transition"
                                onClick={() => {

                                  setShowForm(false);

                                  setForm(initialForm);

                                  setSelectedDay("");

                                  toast.dismiss(t.id);
                                }}
                              >
                                Discard
                              </Button>

                            </div>
                          </div>

                        ), { style: toastDarkOptions.style });

                        return;
                      }

                      setShowForm(false);
                    }}
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