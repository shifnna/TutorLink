import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

import UserSidebar from "../../components/userCommon/sidebar";
import { Button } from "../../components/ui/button";

import {
  createSlotRule,
  getSlotRule,
} from "../../services/slotService";

import {
  ISchedule,
} from "../../types/ISlotRules";

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
  const [selectedDay, setSelectedDay] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState(initialForm);

  const [schedules, setSchedules] =
    useState<ISchedule[]>([]);


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
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
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
    toast.error(
      "End time must be greater than start time"
    );
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

  // overlap validation
  const overlap = schedules.find(
    (slot) =>
      slot.day === selectedDay &&
      form.startTime < slot.endTime &&
      form.endTime > slot.startTime
  );

  if (overlap) {
    toast.error(
      "This slot overlaps with another slot"
    );
    return false;
  }

  return true;
};

  /* ---------------- ADD SLOT ---------------- */

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

  /* ---------------- REMOVE SLOT ---------------- */

  const removeSlot = (id?: string) => {
    setSchedules((prev) =>
      prev.filter((slot) => slot.id !== id)
    );

    toast.success("Slot removed");
  };

  /* ---------------- SAVE ---------------- */

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
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-center" />

      <UserSidebar />

      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold">
              Slot Management
            </h1>

            <p className="text-slate-500 mt-1">
              Configure tutoring schedules.
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">

            {/* TOP */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="w-5 h-5" />
                Weekly Slots
              </h2>

              {!showForm && (
                <Button className="bg-blue-400 text-amber-50"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  {schedules.length
                    ? "Edit"
                    : "Create"}
                </Button>
              )}
            </div>

            {/* EMPTY */}
            {!showForm && !schedules.length && (
              <p className="text-slate-400 text-sm">
                No schedules configured.
              </p>
            )}

            {/* VIEW */}
            {!showForm && !!schedules.length && (
              <div className="space-y-3">
                {schedules.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center border rounded-xl p-4 bg-slate-50"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {slot.day}
                      </h3>

                      <p className="text-sm text-slate-600">
                        {slot.startTime} -{" "}
                        {slot.endTime}
                      </p>

                      <p className="text-sm text-slate-500">
                        {slot.duration}{" "}
                        {slot.durationUnit}
                      </p>
                    </div>

                    <span className="font-semibold text-emerald-600">
                      ₹{slot.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* FORM */}
            {showForm && (
              <div className="space-y-8">

                {/* DAYS */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">
                      Select Day
                    </h3>

                    <p className="text-sm text-slate-500">
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
                            ? "bg-black text-white"
                            : "bg-white hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLOT FORM */}
                {!!selectedDay && (
                  <div className="bg-slate-50 border rounded-2xl p-6 space-y-6">

                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedDay} Slot
                      </h3>

                      <p className="text-sm text-slate-500">
                        Configure slot timing and
                        pricing.
                      </p>
                    </div>

                    {/* TIME */}
                    <div className="grid md:grid-cols-2 gap-5">

                      <div>
                        <label className="text-sm font-medium">
                          Start Time
                        </label>

                        <input
                          type="time"
                          value={form.startTime}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              startTime:
                                e.target.value,
                            })
                          }
                          className="w-full mt-2 border rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          End Time
                        </label>

                        <input
                          type="time"
                          value={form.endTime}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              endTime:
                                e.target.value,
                            })
                          }
                          className="w-full mt-2 border rounded-xl px-4 py-3"
                        />
                      </div>
                    </div>

                    {/* DURATION + PRICE */}
                    <div className="grid md:grid-cols-2 gap-5">

                      <div>
                        <label className="text-sm font-medium">
                          Session Duration
                        </label>

                        <div className="flex gap-2 mt-2">
                          <input
                            type="number"
                            value={form.duration}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                duration: Number(
                                  e.target.value
                                ),
                              })
                            }
                            className="w-full border rounded-xl px-4 py-3"
                          />

                          <select
                            value={
                              form.durationUnit
                            }
                            onChange={(e) =>
                              setForm({
                                ...form,
                                durationUnit:
                                  e.target.value,
                              })
                            }
                            className="border rounded-xl px-4"
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
                        <label className="text-sm font-medium">
                          Session Price
                        </label>

                        <div className="relative mt-2">
                          <span className="absolute left-4 top-3 text-slate-500">
                            ₹
                          </span>

                          <input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                amount: Number(
                                  e.target.value
                                ),
                              })
                            }
                            className="w-full border rounded-xl pl-8 pr-4 py-3"
                            placeholder="500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ADD SLOT */}
                    <Button
  type="button"
  onClick={() => {
    const valid = validate();

    if (!valid) return;

    addSlot();
  }}
  className="bg-emerald-600 hover:bg-emerald-700 text-white"
>
  Add Slot
</Button>
                  </div>
                )}

                {/* SAVED */}
                {!!schedules.length && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">
                      Saved Slots
                    </h3>

                    {schedules.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex justify-between items-center border rounded-xl p-4"
                      >
                        <div>
                          <h4 className="font-semibold">
                            {slot.day}
                          </h4>

                          <p className="text-sm text-slate-600">
                            {slot.startTime} -{" "}
                            {slot.endTime}
                          </p>

                          <p className="text-sm text-slate-500">
                            {slot.duration}{" "}
                            {
                              slot.durationUnit
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-emerald-600">
                            ₹{slot.amount}
                          </span>

                          <Button
                            variant="destructive" className="bg-rose-500"
                            onClick={() =>
                              removeSlot(
                                slot.id
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                  <Button
  onClick={() => {
    if (!schedules.length) {
      toast.error(
        "Please add at least one slot before saving"
      );

      return;
    }

    saveSchedules();
  }}
  disabled={loading}
  className="bg-indigo-600 hover:bg-indigo-700 text-white"
>
  {loading ? "Saving..." : "Save Rules"}
</Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setShowForm(false)
                    }
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