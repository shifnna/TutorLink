import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { createSlotRule, getSlotRules } from "../../services/slotService";
import { ISlotRule } from "../../types/ISlotRules";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };
const toastDarkOptions = { style: { background: "#171A24", color: "#F3F4F8", border: "1px solid #2A2E3D" } };
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const durationPresets = [30, 45, 60, 90];
const todayISO = () => new Date().toISOString().slice(0, 10);
const initialForm = { startDate: "", endDate: "", startTime: "", endTime: "" };

const SlotManagement = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [form, setForm] = useState(initialForm);
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [customDuration, setCustomDuration] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<ISlotRule[]>([]);

  useEffect(() => { fetchRules(); }, []);

  const fetchRules = async () => {
    try {
      const res = await getSlotRules();
      if (res.success && res.data?.data) setRules(res.data.data);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
    }
  };

  const toggleDay = (day: string) =>
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));

  const toggleDuration = (mins: number) =>
    setDurations((prev) => {
      const next = { ...prev };
      if (mins in next) delete next[mins];
      else next[mins] = mins * 10;
      return next;
    });

  const addCustomDuration = () => {
    const mins = Number(customDuration);
    if (!mins || mins <= 0) return;
    setDurations((prev) => ({ ...prev, [mins]: mins * 10 }));
    setCustomDuration("");
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedDays([]);
    setDurations({});
    setShowForm(false);
  };

  const submitRule = async () => {
    if (!selectedDays.length) { toast.error("Select at least one weekday"); return; }
    if (!form.startDate || !form.endDate) { toast.error("Pick a start and end date"); return; }
    if (!form.startTime || !form.endTime) { toast.error("Pick a start and end time"); return; }
    if (!Object.keys(durations).length) { toast.error("Add at least one session duration"); return; }

    setLoading(true);
    try {
      const res = await createSlotRule({
        weekdays: selectedDays,
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.startTime,
        endTime: form.endTime,
        durations: Object.entries(durations).map(([minutes, amount]) => ({ minutes: Number(minutes), amount })),
      });

      if (!res.success) { toast.error(res.message || "Failed to create slot"); return; }

      toast.success(`Slot rule ${res.data?.data?.ruleCode ?? ""} created`);
      resetForm();
      fetchRules();
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#0E1016] text-[#F3F4F8]">
      <Toaster position="top-center" toastOptions={toastDarkOptions} />
      <main className="relative flex-1 px-8 py-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
          <div>
            <span style={mono} className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
              Scheduling
            </span>
            <p className="text-[#9CA1B5] mt-1">Configure recurring tutoring schedules.</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] shadow-xl p-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />
            <div className="flex items-center justify-between mb-6">
              <h2 style={fraunces} className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="w-5 h-5 text-[#7C9CFF]" />
                Slot Rules
              </h2>
              {!showForm && (
                <Button className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-5 hover:scale-105 transition" onClick={() => setShowForm(true)}>
                  Create Rule
                </Button>
              )}
            </div>

            {!showForm && !rules.length && <p className="text-[#9CA1B5]/70 text-sm italic">No slot rules configured.</p>}

            {!showForm && !!rules.length && (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule._id} className="border border-[#2A2E3D] rounded-xl p-4 bg-[#1E2230]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[#F3F4F8]">{rule.weekdays.join(", ")}</h3>
                        <p className="text-sm text-[#9CA1B5]">{rule.startDate} to {rule.endDate} · {rule.startTime}-{rule.endTime}</p>
                        <p style={mono} className="text-xs text-[#7C9CFF] mt-1">{rule.ruleCode}</p>
                      </div>
                      <div className="text-right space-y-1">
                        {rule.durations.map((d) => (
                          <p key={d.minutes} style={mono} className="text-xs text-emerald-400">{d.minutes} min · ₹{d.amount}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showForm && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#F3F4F8]">Weekdays</h3>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button key={day} type="button" onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-full border text-sm transition ${selectedDays.includes(day) ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold border-transparent" : "bg-[#1E2230] border-[#2A2E3D] text-[#9CA1B5] hover:text-[#F3F4F8] hover:border-[#7C9CFF]"}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">Start Date</label>
                    <input type="date" min={todayISO()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full mt-2 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">End Date</label>
                    <input type="date" min={form.startDate || todayISO()} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full mt-2 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 [color-scheme:dark]" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">Start Time</label>
                    <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full mt-2 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">End Time</label>
                    <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full mt-2 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-3 [color-scheme:dark]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-[#F3F4F8]">Session Durations & Price</h3>
                  <div className="flex flex-wrap gap-2">
                    {durationPresets.map((mins) => (
                      <button key={mins} type="button" onClick={() => toggleDuration(mins)}
                        className={`px-4 py-2 rounded-full border text-sm transition ${mins in durations ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold border-transparent" : "bg-[#1E2230] border-[#2A2E3D] text-[#9CA1B5] hover:text-[#F3F4F8] hover:border-[#7C9CFF]"}`}>
                        {mins} min
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input type="number" min={5} placeholder="custom mins" value={customDuration} onChange={(e) => setCustomDuration(e.target.value)}
                      className="border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-xl px-4 py-2 [color-scheme:dark]" />
                    <Button type="button" variant="outline" className="border-[#2A2E3D] text-[#F3F4F8] bg-transparent" onClick={addCustomDuration}>
                      + Add
                    </Button>
                  </div>

                  {Object.entries(durations).map(([mins, amount]) => (
                    <div key={mins} className="flex justify-between items-center border border-[#2A2E3D] rounded-xl p-3 bg-[#1E2230]">
                      <span style={mono} className="text-sm text-[#F3F4F8]">{mins} min</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#9CA1B5]">₹</span>
                        <input type="number" min={0} value={amount}
                          onChange={(e) => setDurations((prev) => ({ ...prev, [Number(mins)]: Number(e.target.value) }))}
                          className="w-24 border border-[#2A2E3D] bg-[#171A24] text-[#F3F4F8] rounded-lg px-3 py-1.5 [color-scheme:dark]" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={submitRule} disabled={loading} className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-6 hover:scale-105 transition disabled:opacity-50">
                    {loading ? "Saving..." : "Create Rule"}
                  </Button>
                  <Button variant="outline" className="border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#171A24] hover:border-[#7C9CFF] bg-transparent rounded-full transition" onClick={resetForm}>
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