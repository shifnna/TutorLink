import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock3, BadgeCheck, Briefcase, GraduationCap,
  UserRound, Clock, Sparkles, Languages as LanguagesIcon, Star, ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { tutorService } from "../../services/tutorService";
import { getAvailableSlots } from "../../services/slotService";
import { createOrder, verifyPayment } from "../../services/sessionService";
import { useAuthStore } from "../../store/authStore";
import { ITutor } from "../../types/ITutor";
import { IAvailableSlot, IDurationOption } from "../../types/ISlotRules";

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const getInitials = (name?: string) => {
  if (!name) return "T";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes % 60 === 0) {
    const hrs = minutes / 60;
    return `${hrs} hr${hrs > 1 ? "s" : ""} class`;
  }
  if (minutes > 60) {
    const hrs = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return `${hrs}h ${rem}m class`;
  }
  return `${minutes} min class`;
};

const formatDate = (dateStr: string) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
  interface ImportMetaEnv {
    readonly VITE_RAZORPAY_KEY_ID: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const TutorDetails: React.FC = () => {
  const { tutorId } = useParams();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState<ITutor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<IAvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<IAvailableSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<IDurationOption | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const slotsRef = useRef<HTMLDivElement | null>(null);
  const scrollToSlots = () => slotsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const bookingDetailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedSlot) return;
    const timer = setTimeout(() => {
      bookingDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedSlot]);

  const [arrowVisible, setArrowVisible] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 80) setArrowVisible(false);
      else if (currentY < lastY) setArrowVisible(true);
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const tutorRes = await tutorService.getTutorById(tutorId!);
        if (tutorRes.success && tutorRes.data) {
          setTutor(tutorRes.data);

          const slotsRes = await getAvailableSlots(tutorRes.data.tutorId?._id || "");
          if (slotsRes.success && slotsRes.data?.data) setAvailableSlots(slotsRes.data.data);
        }
      } catch {
        toast.error("Failed to load tutor");
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [tutorId]);

  const groupedByDate = useMemo(() => {
    const grouped: Record<string, IAvailableSlot[]> = {};
    availableSlots.forEach((slot) => {
      if (!grouped[slot.date]) grouped[slot.date] = [];
      grouped[slot.date].push(slot);
    });
    return Object.entries(grouped).sort(([a], [b]) => (a < b ? -1 : 1));
  }, [availableSlots]);

  const selectSlot = (slot: IAvailableSlot) => {
    setSelectedSlot(slot);
    setSelectedDuration(null);
  };

  const proceedToPay = async () => {
    const tutorUserId = tutor?.tutorId?._id;

    if (!selectedSlot || !selectedDuration || !tutor || !tutorUserId) {
      toast.error("Missing booking details — please pick a slot again.");
      return;
    }

    try {
      const orderRes = await createOrder(selectedDuration.amount);
      const order = orderRes.data?.data;
      if (!order?.id) { toast.error("Order creation failed"); return; }

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "TutorLink",
        description: "Session Booking",
        prefill: { name: user?.name || "", email: user?.email || "" },
        theme: { color: "#111827" },
        handler: async (response: RazorpayPaymentResponse) => {
  const verify = await verifyPayment({
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    bookingDetails: {
      ruleId: selectedSlot.ruleId,
      date: selectedSlot.date,
      minutes: selectedDuration.minutes,
    },
  });

  if (!verify.success) {
    toast.error(verify.message || "Payment verification failed");
    return;
  }

  toast.success("Session booked");

  setAvailableSlots((prev) =>
    prev.filter((s) => !(s.ruleId === selectedSlot.ruleId && s.date === selectedSlot.date))
  );
  setSelectedSlot(null);
  setSelectedDuration(null);
},
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Booking failed");
    }
  };

  if (!tutor) {
    if (loading) return null;
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1016] text-[#F3F4F8]">
        Tutor not found
      </div>
    );
  }

  const name = tutor.tutorId?.name;
  const profileImage = tutor.tutorId?.profileImage || tutor.profileImage;

  const memberSince = (() => {
    const createdAt = (tutor as ITutor)?.createdAt;
    if (!createdAt) return "—";
    try {
      return new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "—";
    }
  })();

  const selectedDurationLabel = formatDuration(selectedDuration?.minutes);

  return (
    <>
      <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8]">
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[60vmax] h-[60vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl" style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vmax] h-[50vmax] rounded-full opacity-25 animate-blob mix-blend-screen blur-3xl" style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)", animationDelay: "-4s" }} />
          <div className="absolute inset-0 bg-[#0E1016]/30 backdrop-blur-[1px]" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="relative px-4 md:px-8 py-25">
          <div className="max-w-6xl mx-auto space-y-6">

            <div>
              <span style={mono} className="inline-flex items-center gap-2 rounded-full border border-[#2A2E3D] bg-[#171A24]/60 px-4 py-1.5 text-[11px] uppercase tracking-wider text-[#9CA1B5]">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA]" />
                Tutor profile
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-8 shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

                <div className="flex items-center gap-5 mb-6">
                  {profileImage && !imageFailed ? (
                    <img src={profileImage} alt={name} onError={() => setImageFailed(true)} className="w-28 h-28 rounded-2xl object-cover border border-[#2A2E3D] shrink-0" />
                  ) : (
                    <div style={fraunces} className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] shrink-0">
                      {getInitials(name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 style={fraunces} className="text-2xl font-semibold truncate">{name}</h2>
                      <BadgeCheck className="w-4 h-4 text-[#7C9CFF]" />
                    </div>
                    {tutor.occupation && (
                      <span style={mono} className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,156,255,0.25)] bg-[rgba(124,156,255,0.1)] px-3 py-1 text-[11px] uppercase tracking-wide text-[#7C9CFF]">
                        {tutor.occupation}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#2A2E3D] pt-6">
                  <dt style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-1">About</dt>
                  <dd className="text-base text-[#F3F4F8]/90 leading-relaxed">
                    {tutor.description || <span className="text-[#9CA1B5]/60 italic">No bio added yet.</span>}
                  </dd>
                </div>

                <div className="border-t border-[#2A2E3D] mt-6 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
                  <div>
                    <dt style={mono} className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"><Briefcase className="w-3.5 h-3.5" />Experience</dt>
                    <dd className="text-base text-[#F3F4F8]">{tutor.experienceLevel || <span className="text-[#9CA1B5]/60 italic">—</span>}</dd>
                  </div>
                  <div>
                    <dt style={mono} className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"><GraduationCap className="w-3.5 h-3.5" />Education</dt>
                    <dd className="text-base text-[#F3F4F8]">{tutor.education || <span className="text-[#9CA1B5]/60 italic">—</span>}</dd>
                  </div>
                  <div>
                    <dt style={mono} className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9CA1B5] mb-1"><UserRound className="w-3.5 h-3.5" />Gender</dt>
                    <dd className="text-base text-[#F3F4F8]">{tutor.gender || <span className="text-[#9CA1B5]/60 italic">—</span>}</dd>
                  </div>
                  <div>
                    <p style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-2">Subjects</p>
                    {tutor.subjects?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects.map((subject) => <span key={subject} className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2230] text-[#9CA1B5]">{subject}</span>)}
                      </div>
                    ) : <span className="text-sm text-[#9CA1B5]/60 italic">—</span>}
                  </div>
                  <div>
                    <p style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5] mb-2">Languages</p>
                    {tutor.languages?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {tutor.languages.map((lang) => <span key={lang} className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2230] text-[#9CA1B5]">{lang}</span>)}
                      </div>
                    ) : <span className="text-sm text-[#9CA1B5]/60 italic">—</span>}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#1E2230] p-6 shadow-xl h-fit">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-5 h-5 text-[#0E1016]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F3F4F8]">Verified tutor</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-current text-[#C08BFA]" />
                      <span className="text-[10px] text-[#9CA1B5]">4.9 rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#9CA1B5]"><Clock className="w-4 h-4" />Member since</span>
                    <span style={mono} className="text-[#F3F4F8]">{memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#9CA1B5]"><Sparkles className="w-4 h-4" />Role</span>
                    <span style={mono} className="text-[#F3F4F8]">Tutor</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#9CA1B5]"><Briefcase className="w-4 h-4" />Occupation</span>
                    <span style={mono} className="text-[#F3F4F8] text-right">{tutor.occupation || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#9CA1B5]"><GraduationCap className="w-4 h-4" />Education</span>
                    <span style={mono} className="text-[#F3F4F8] text-right">{tutor.education || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#9CA1B5]"><LanguagesIcon className="w-4 h-4" />Languages</span>
                    <span style={mono} className="text-[#F3F4F8] text-right">{tutor.languages?.length || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#9CA1B5]"><CalendarDays className="w-4 h-4" />Upcoming slots</span>
                    <span style={mono} className="text-[#F3F4F8] text-right">{availableSlots.length}</span>
                  </div>
                </div>

                <div className="flex gap-1 mt-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C9CFF]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A78CF5]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C08BFA]" />
                </div>
              </div>
            </div>

            <div ref={slotsRef} className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-8 shadow-xl scroll-mt-24">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="w-5 h-5 text-[#7C9CFF]" />
                <h2 style={fraunces} className="text-xl font-semibold">Available Slots</h2>
              </div>

              {!groupedByDate.length ? (
                <div className="text-center py-10 text-[#9CA1B5] text-sm border border-dashed border-[#2A2E3D] rounded-2xl">No slots available</div>
              ) : (
                <div className="space-y-5">
                  {groupedByDate.map(([date, slots]) => (
                    <div key={date}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[#F3F4F8]">{formatDate(date)}</h3>
                        <span style={mono} className="text-xs text-[#9CA1B5]">{slots[0].day}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {slots.map((slot) => {
                          const isSelected = selectedSlot?.ruleId === slot.ruleId && selectedSlot?.date === slot.date;
                          const fromPrice = Math.min(...slot.durations.map((d) => d.amount));
                          return (
                            <motion.button
                              key={`${slot.ruleId}-${slot.date}`}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => selectSlot(slot)}
                              className={`border rounded-xl p-4 text-left transition ${isSelected ? "border-[#7C9CFF] bg-[rgba(124,156,255,0.1)]" : "border-[#2A2E3D] hover:border-[#7C9CFF] hover:bg-[#1E2230]"}`}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium text-[#F3F4F8]">
                                <Clock3 className="w-4 h-4 text-[#7C9CFF]" />
                                <span>{slot.startTime} - {slot.endTime}</span>
                              </div>
                              <p className="text-xs text-[#9CA1B5] mt-2">{slot.durations.length} duration{slot.durations.length > 1 ? "s" : ""} · from ₹{fromPrice}</p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSlot && (
                <motion.div
                  ref={bookingDetailsRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-t border-[#2A2E3D] pt-5 space-y-4 scroll-mt-24"
                >
                  <div className="rounded-xl bg-[#1E2230] border border-[#2A2E3D] p-4">
                    <p style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">Selected Slot</p>
                    <h3 style={fraunces} className="font-semibold text-lg mt-1.5 text-[#F3F4F8]">
                      {formatDate(selectedSlot.date)} • {selectedSlot.startTime} - {selectedSlot.endTime}
                    </h3>

                    <p style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5] mt-4 mb-2">Choose duration</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSlot.durations.map((d) => (
                        <button
                          key={d.minutes}
                          type="button"
                          onClick={() => setSelectedDuration(d)}
                          className={`px-4 py-2 rounded-full border text-sm transition ${selectedDuration?.minutes === d.minutes ? "bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold border-transparent" : "bg-[#171A24] border-[#2A2E3D] text-[#9CA1B5] hover:text-[#F3F4F8] hover:border-[#7C9CFF]"}`}
                        >
                          {d.minutes} min · ₹{d.amount}
                        </button>
                      ))}
                    </div>

                    {selectedDurationLabel && (
                      <span style={mono} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,156,255,0.25)] bg-[rgba(124,156,255,0.12)] px-3 py-1.5 text-xs font-semibold text-[#7C9CFF]">
                        <Clock3 className="w-3.5 h-3.5" />
                        {selectedDurationLabel}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={proceedToPay}
                    disabled={!selectedDuration}
                    className="w-full rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold hover:scale-[1.02] transition disabled:opacity-50"
                  >
                    {selectedDuration ? `Book for ₹${selectedDuration.amount}` : "Choose a duration"}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {arrowVisible && (
          <motion.button
            key="scroll-hint"
            onClick={scrollToSlots}
            aria-label="Scroll to available slots"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ opacity: { duration: 0.25 }, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-11 h-11 rounded-full bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <ChevronDown className="w-5 h-5 text-[#0E1016]" />
          </motion.button>
        )}
      </AnimatePresence>

      <Toaster position="top-center" toastOptions={{ style: { background: "#171A24", color: "#F3F4F8", border: "1px solid #2A2E3D" } }} />
    </>
  );
};

export default TutorDetails;