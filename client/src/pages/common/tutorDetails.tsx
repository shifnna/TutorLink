import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Briefcase, Clock, GraduationCap, MessageCircle, ShieldCheck, Star, UserRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { tutorService } from "../../services/tutorService";
import { getAvailableSlots } from "../../services/slotService";
import { createOrder, verifyPayment } from "../../services/sessionService";
import { useAuthStore } from "../../store/authStore";
import { ITutor } from "../../types/ITutor";
import { IAvailableSlot, IDurationOption } from "../../types/ISlotRules";


const toArray = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").map((v) => v.trim()).filter(Boolean);
};

const capitalize = (v: string) => (v.length ? v.charAt(0).toUpperCase() + v.slice(1) : v);

const getInitials = (name?: string) =>
  name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "T";

const formatDuration = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes % 60 === 0) {
    const hrs = minutes / 60;
    return `${hrs} hr${hrs > 1 ? "s" : ""} class`;
  }
  if (minutes > 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m class`;
  return `${minutes} min class`;
};

const parseDate = (d: string) => new Date(`${d}T00:00:00`);
const formatDate = (d: string) => parseDate(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
const weekdayOf = (d: string) => parseDate(d).toLocaleDateString("en-IN", { weekday: "short" });
const dayMonthOf = (d: string) => parseDate(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

interface RazorpayOptions {
  key: string; amount: number; currency: string; order_id: string; name: string; description: string;
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

const DATE_LIMIT = 8;
const FACT_COLS: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };
const H2 = "text-lg font-semibold text-[#F8F9FF] mb-3";
const OUTLINE_BTN = "rounded-full px-5 py-5 bg-transparent border border-[#556ba7] text-[#E4E8F7] hover:bg-[#242B40] hover:border-[#7C9CFF] transition-all";
const GRADIENT_BTN = "rounded-full py-5 bg-gradient-to-r from-[#7C9CFF] to-[#A18BFA] text-[#101321] font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:hover:brightness-100";

// Add rounded-xl or rounded-full where you use it.
const pill = (active: boolean) =>
  `border text-sm transition ${
    active
      ? "border-[#7C9CFF] bg-[rgba(124,156,255,0.12)] text-[#F8F9FF]"
      : "border-[#2A2E3D] bg-transparent text-[#C0C7DE] hover:border-[#7C9CFF]/70 hover:text-[#F3F4F8]"
  }`;

const Step: React.FC<{ n: number; label: string; children: React.ReactNode }> = ({ n, label, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-2.5">
      <span className="w-5 h-5 rounded-full border border-[#384665] bg-[#242B40] text-[11px] font-semibold text-[#DCE5FF] flex items-center justify-center">{n}</span>
      <p className="text-sm font-medium text-[#F3F4F8]">{label}</p>
    </div>
    {children}
  </div>
);

const TutorDetails: React.FC = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState<ITutor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<IAvailableSlot[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<IAvailableSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<IDurationOption | null>(null);
  const [showAllDates, setShowAllDates] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const bookingRef = useRef<HTMLDivElement | null>(null);
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

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

  const lowestPrice = useMemo(() => {
    const prices = availableSlots.flatMap((s) => s.durations.map((d) => d.amount));
    return prices.length ? Math.min(...prices) : null;
  }, [availableSlots]);

  const subjects = useMemo(() => toArray(tutor?.subjects), [tutor]);
  const languages = useMemo(() => toArray(tutor?.languages), [tutor]);

  // If the tutor has only one subject or language, it is chosen automatically.
  const subject = selectedSubject ?? (subjects.length === 1 ? subjects[0] : null);
  const language = selectedLanguage ?? (languages.length === 1 ? languages[0] : null);

  // Falls back to the first date if the chosen date has no slots left (e.g. after booking).
  const activeDate = groupedByDate.some(([d]) => d === selectedDate) ? selectedDate : groupedByDate[0]?.[0] ?? null;
  const slotsForDate = groupedByDate.find(([d]) => d === activeDate)?.[1] ?? [];

  // Shows the first dates only, but the chosen date always stays visible.
  const visibleDates = showAllDates ? groupedByDate : groupedByDate.filter(([d], i) => i < DATE_LIMIT || d === activeDate);
  const hiddenDates = groupedByDate.length - visibleDates.length;

  const hasSelection = !!(selectedSubject || selectedLanguage || selectedDate || selectedSlot || selectedDuration);

  // The next thing the client still has to choose. null means ready to book.
  const missingStep =
    subjects.length > 0 && !subject ? "Choose a subject"
    : languages.length > 0 && !language ? "Choose a language"
    : !selectedSlot ? "Choose a time"
    : !selectedDuration ? "Choose a duration"
    : null;

  const pickDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSelectedDuration(null);
  };

  const selectSlot = (slot: IAvailableSlot) => {
    setSelectedSlot(slot);
    setSelectedDuration(null);
  };

  const resetSelection = () => {
    setSelectedSubject(null);
    setSelectedLanguage(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedDuration(null);
  };

  const proceedToPay = async () => {
    const tutorUserId = tutor?.tutorId?._id;

    if (!selectedSlot || !selectedDuration || !tutor || !tutorUserId) {
      toast.error("Missing booking details — please pick a slot again.");
      return;
    }
    if (missingStep) {
      toast.error(`${missingStep} first.`);
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
              subject: subject ?? undefined,
              language: language ?? undefined,
            },
          });

          if (!verify.success) {
            toast.error(verify.message || "Payment verification failed");
            return;
          }

          toast.success("Session booked");
          setAvailableSlots((prev) => prev.filter((s) => !(s.ruleId === selectedSlot.ruleId && s.date === selectedSlot.date)));
          resetSelection();
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
  const firstName = name?.split(" ")[0] || "tutor";
  const profileImage = tutor.tutorId?.profileImage || tutor.profileImage;
  const rating = tutor.averageRating;
  const selectedDurationLabel = formatDuration(selectedDuration?.minutes);

  const memberSince = (() => {
    const createdAt = (tutor as ITutor)?.createdAt;
    if (!createdAt) return undefined;
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? undefined : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  })();

  const facts = [
    { label: "Education", value: tutor.education, icon: GraduationCap },
    { label: "Experience", value: tutor.experienceLevel, icon: Briefcase },
    { label: "Gender", value: tutor.gender, icon: UserRound },
    { label: "Member since", value: memberSince, icon: Clock },
  ].filter((f) => f.value);

  // Step numbers adjust if the tutor has no subjects or languages listed.
  const steps = [subjects.length > 0 && "subject", languages.length > 0 && "language", "date", "time", "duration"].filter(Boolean) as string[];
  const num = (key: string) => steps.indexOf(key) + 1;

  const messageTutor = () => navigate(`/messages?with=${tutor.tutorId?._id}`);

  return (
    <>
      <div className="relative min-h-screen bg-[#0E1016] text-[#F3F4F8]">
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
            style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
            style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }} />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="relative px-4 md:px-8 pt-28 pb-28 lg:pb-16">
          <div className="max-w-6xl mx-auto">
            <button type="button" onClick={() => navigate("/explore-tutors")}
              className="inline-flex items-center gap-1.5 text-sm text-[#9CA1B5] hover:text-[#F3F4F8] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />Back to tutors
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start">
              {/* Profile */}
              <div className="rounded-2xl border border-[#2A2E3D] bg-[#171A24] shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8 bg-gradient-to-b from-[rgba(124,156,255,0.08)] to-transparent">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {profileImage && !imageFailed ? (
                      <img src={profileImage} alt={name} onError={() => setImageFailed(true)}
                        className="w-28 h-28 rounded-2xl object-cover border border-[#2A2E3D] shrink-0" />
                    ) : (
                      <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] shrink-0">
                        {getInitials(name)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-[#F8F9FF] break-words">{name}</h1>
                        <BadgeCheck className="w-5 h-5 text-[#8EAAFF] shrink-0" aria-label="Verified tutor" />
                      </div>
                      {tutor.occupation && <p className="text-[#C0C7DE] mt-1">{tutor.occupation}</p>}
                      {rating != null && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Star className="w-4 h-4 fill-[#F5B942] text-[#F5B942]" />
                          <span className="text-sm font-semibold text-[#F5F6FF]">{rating.toFixed(1)}</span>
                          <span className="text-sm text-[#9CA1B5]">average rating</span>
                        </div>
                      )}
                    </div>

                    <Button onClick={messageTutor} className={`${OUTLINE_BTN} w-full sm:w-auto shrink-0`}>
                      <MessageCircle className="w-4 h-4 mr-2" />Message
                    </Button>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  {facts.length > 0 && (
                    <dl className={`grid grid-cols-2 ${FACT_COLS[facts.length]} gap-4 rounded-xl border border-[#2A2E3D] bg-[#1E2230]/60 p-4 mb-8`}>
                      {facts.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[rgba(124,156,255,0.1)] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[#7C9CFF]" />
                          </div>
                          <div className="min-w-0">
                            <dt className="text-xs text-[#9CA1B5]">{label}</dt>
                            <dd className="text-sm font-medium text-[#F3F4F8] break-words">{value}</dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  )}

                  <section>
                    <h2 className={H2}>About {firstName}</h2>
                    <p className="text-[15px] text-[#D0D5E8] leading-relaxed max-w-prose">
                      {tutor.description || <span className="text-[#9CA1B5] italic">This tutor hasn't added a bio yet.</span>}
                    </p>
                  </section>

                  {(subjects.length > 0 || languages.length > 0) && (
                    <div className="grid sm:grid-cols-2 gap-8 border-t border-[#2A2E3D] mt-8 pt-8">
                      {subjects.length > 0 && (
                        <section>
                          <h2 className={H2}>Subjects</h2>
                          <div className="flex flex-wrap gap-2">
                            {subjects.map((s, i) => (
                              <span key={s} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                                i % 2 === 0 ? "bg-[#242B40] border-[#384665] text-[#DCE5FF]" : "bg-[#30263E] border-[#4B3A60] text-[#F0DCFF]"
                              }`}>
                                {capitalize(s)}
                              </span>
                            ))}
                          </div>
                        </section>
                      )}

                      {languages.length > 0 && (
                        <section>
                          <h2 className={H2}>Languages</h2>
                          <div className="flex flex-wrap gap-2">
                            {languages.map((l) => (
                              <span key={l} className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#2A2E3D] bg-[#1E2230] text-[#C0C7DE]">
                                {capitalize(l)}
                              </span>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Booking panel */}
              <aside ref={bookingRef} className="scroll-mt-28">
                <div className="relative overflow-hidden rounded-2xl border border-[#2A2E3D] bg-[#171A24] p-6 pt-7 shadow-xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA]" />

                  <h2 className="text-xl font-semibold text-[#F8F9FF]">Book a session</h2>
                  {lowestPrice != null && (
                    <p className="text-base text-[#9CA1B5] mt-1">
                      Sessions from <span className="font-semibold text-[#e4f1f9]">₹{lowestPrice}</span>
                    </p>
                  )}

                  {!groupedByDate.length ? (
                    <div className="text-center px-4 py-8 mt-5 text-sm text-[#9CA1B5] border border-dashed border-[#2A2E3D] rounded-xl">
                      <p>No slots available right now.</p>
                      <p className="mt-1">Message {firstName} to ask for a time.</p>
                      <Button onClick={messageTutor} className={`${OUTLINE_BTN} mt-4`}>
                        <MessageCircle className="w-4 h-4 mr-2" />Message {firstName}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mt-6 space-y-6">
                        {subjects.length > 0 && (
                          <Step n={num("subject")} label="Subject">
                            <div className="flex flex-wrap gap-2">
                              {subjects.map((s) => (
                                <button key={s} type="button" aria-pressed={subject === s} onClick={() => setSelectedSubject(s)}
                                  className={`${pill(subject === s)} rounded-full px-3.5 py-1.5 text-[13px]`}>
                                  {capitalize(s)}
                                </button>
                              ))}
                            </div>
                          </Step>
                        )}

                        {languages.length > 0 && (
                          <Step n={num("language")} label="Language">
                            <div className="flex flex-wrap gap-2">
                              {languages.map((l) => (
                                <button key={l} type="button" aria-pressed={language === l} onClick={() => setSelectedLanguage(l)}
                                  className={`${pill(language === l)} rounded-full px-3.5 py-1.5 text-[13px]`}>
                                  {capitalize(l)}
                                </button>
                              ))}
                            </div>
                          </Step>
                        )}

                        <Step n={num("date")} label="Date">
                          <div className="grid grid-cols-4 gap-2">
                            {visibleDates.map(([date]) => (
                              <button key={date} type="button" aria-pressed={date === activeDate} onClick={() => pickDate(date)}
                                className={`${pill(date === activeDate)} rounded-xl px-2 py-2 text-center`}>
                                <span className="block text-[11px] text-[#9CA1B5]">{weekdayOf(date)}</span>
                                <span className="block font-medium mt-0.5">{dayMonthOf(date)}</span>
                              </button>
                            ))}
                          </div>
                          {groupedByDate.length > DATE_LIMIT && (showAllDates || hiddenDates > 0) && (
                            <button type="button" onClick={() => setShowAllDates((prev) => !prev)} aria-expanded={showAllDates}
                              className="mt-3 text-[12.5px] font-medium text-[#7C9CFF] hover:text-[#F3F4F8] transition-colors">
                              {showAllDates ? "Show fewer dates" : `Show ${hiddenDates} more dates`}
                            </button>
                          )}
                        </Step>

                        <Step n={num("time")} label="Time">
                          <div className="grid grid-cols-2 gap-2">
                            {slotsForDate.map((slot) => {
                              const active = selectedSlot?.ruleId === slot.ruleId && selectedSlot?.date === slot.date;
                              return (
                                <button key={`${slot.ruleId}-${slot.date}`} type="button" aria-pressed={active} onClick={() => selectSlot(slot)}
                                  className={`${pill(active)} rounded-xl px-3 py-2.5 text-[13px]`}>
                                  {slot.startTime} - {slot.endTime}
                                </button>
                              );
                            })}
                          </div>
                        </Step>

                        <Step n={num("duration")} label="Duration">
                          {selectedSlot ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedSlot.durations.map((d) => (
                                <button key={d.minutes} type="button" aria-pressed={selectedDuration?.minutes === d.minutes} onClick={() => setSelectedDuration(d)}
                                  className={`${pill(selectedDuration?.minutes === d.minutes)} rounded-xl px-4 py-2`}>
                                  {d.minutes} min · <span >₹{d.amount}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-[#9CA1B5]">Pick a time to see the durations.</p>
                          )}
                        </Step>
                      </div>

                      <div className="border-t border-[#2A2E3D] mt-6 pt-6 space-y-3">
                        {selectedSlot && selectedDuration && (
                          <div className="rounded-xl border border-[#2A2E3D] bg-[#1E2230] p-3.5 text-sm">
                            <p className="text-[#F3F4F8] font-medium">{formatDate(selectedSlot.date)} · {selectedSlot.startTime} - {selectedSlot.endTime}</p>
                            <p className="text-[#9CA1B5] mt-0.5">
                              {[subject && capitalize(subject), language && capitalize(language), selectedDurationLabel].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button type="button" onClick={resetSelection} disabled={!hasSelection} title="Clear your selections"
                            className={`${OUTLINE_BTN} shrink-0 disabled:opacity-40`}>
                            Cancel
                          </Button>
                          <Button onClick={proceedToPay} disabled={!!missingStep} className={`${GRADIENT_BTN} flex-1`}>
                            {missingStep ?? `Book for ₹${selectedDuration?.amount}`}
                          </Button>
                        </div>

                        <p className="flex items-center justify-center gap-1.5 text-xs text-[#9CA1B5]">
                          <ShieldCheck className="w-3.5 h-3.5" />Secure payment with Razorpay
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile booking bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-between gap-4 px-4 py-3 border-t border-[#2A2E3D] bg-[#171A24]/90 backdrop-blur-xl">
        <div>
          <p className="text-xs text-[#9CA1B5]">Sessions from</p>
          <p className="text-lg font-bold text-[#F8F9FF]">{lowestPrice != null ? `₹${lowestPrice}` : "—"}</p>
        </div>
        <Button onClick={scrollToBooking} className="rounded-full px-6 py-5 bg-gradient-to-r from-[#7C9CFF] to-[#A18BFA] text-[#101321] font-semibold hover:brightness-110 transition-all">
          Book a session
        </Button>
      </div>

      <Toaster position="top-center" toastOptions={{ style: { background: "#171A24", color: "#F3F4F8", border: "1px solid #2A2E3D" } }} />
    </>
  );
};

export default TutorDetails;