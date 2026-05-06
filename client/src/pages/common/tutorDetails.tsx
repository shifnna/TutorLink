import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tutorService } from "../../services/tutorService";
import { ITutor } from "../../types/ITutor";
import { ISlotRule } from "../../types/ISlotRules";
import { getTutorRuleForClient } from "../../services/slotService";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder, verifyPayment } from "../../services/sessionService";
import { useAuthStore } from "../../store/authStore";

declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

const TutorDetails: React.FC = () => {
  const { tutorId } = useParams();
  const { user } = useAuthStore();

  const [tutor, setTutor] = useState<ITutor | null>(null);
  const [rule, setRule] = useState<ISlotRule | null>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateObj, setSelectedDateObj] = useState<Date>();

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  useEffect(() => {
    const fetch = async () => {
      const res = await tutorService.getTutorById(tutorId!);
      if (res.success && res.data) {
        setTutor(res.data);

        const r = await getTutorRuleForClient(String(res.data.tutorId?._id));
        if (r.success && r.data?.data) setRule(r.data.data);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const openPayment = async () => {
    if (!tutor || !rule || !selectedDate) {
      toast.error("Select a valid date");
      return;
    }

    const orderRes = await createOrder(rule.amount);
    if (!orderRes.success || !orderRes.data) {
      toast.error("Payment failed");
      return;
    }

    const order = orderRes.data.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "TutorLink",
      description: "Session Booking",
      order_id: order.id,

      handler: async (response: any) => {
        const verifyRes = await verifyPayment({
          bookingDetails: {
            tutorId: tutor._id,
            selectedDate,
            startTime: rule!.startTime,
            endTime: rule!.endTime,
            amount: rule!.amount,
          },
          ...response,
        });

        if (verifyRes.success) {
          toast.success("Session booked!");
          setShowModal(false);
        } else {
          toast.error("Verification failed");
        }
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: { color: "#6366f1" },
    };

    new window.Razorpay(options).open();
  };

  if (loading)
    return <p className="text-center mt-10 text-slate-500">Loading...</p>;

  if (!tutor)
    return <p className="text-center mt-10 text-red-500">Tutor not found</p>;

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* HEADER */}
          <h1 className="text-3xl font-bold tracking-tight">
            Tutor Details
          </h1>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT CARD */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">

                <img
                  src={tutor.profileImage}
                  className="w-32 h-32 rounded-xl object-cover border border-slate-200"
                />

                <h2 className="text-2xl font-semibold mt-4">
                  {tutor.tutorId?.name}
                </h2>

                <p className="text-sm text-slate-500">
                  {tutor.occupation}
                </p>

                <p className="mt-4 text-lg text-black">
                  {tutor.description}
                </p>

                <p className="text-indigo-600 font-semibold text-lg mt-4">
                  ₹{rule?.amount} / session
                </p>

                <Button
                  className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={() => setShowModal(true)}
                >
                  Book Session
                </Button>
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">

              <h3 className="text-lg font-semibold">About</h3>

              <p><b>Experience:</b> {tutor.experienceLevel}</p>
              <p><b>Gender:</b> {tutor.gender}</p>
              <p><b>Education:</b> {tutor.education}</p>

              {tutor.skills?.length > 0 && (
                <div>
                  <b>Skills:</b>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tutor.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tutor.languages?.length > 0 && (
                <div>
                  <b>Languages:</b>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tutor.languages.map((l) => (
                      <span
                        key={l}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rule?.selectedDays && (
                <div>
                  <b>Available Days:</b>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rule.selectedDays.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <h3 className="text-lg font-semibold text-center mb-4">
                Select Date
              </h3>

              <DayPicker
                mode="single"
                selected={selectedDateObj}
                onSelect={(d) => {
                  if (!d) return;

                  const dayName = d.toLocaleDateString("en-US", { weekday: "long" });

                  if (!rule?.selectedDays?.includes(dayName)) {
                    toast.error("Not available on this day");
                    return;
                  }

                  setSelectedDateObj(d);
                  setSelectedDate(formatDate(d));
                }}
              />

              {selectedDate && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p><b>Date:</b> {selectedDate}</p>
                  <p><b>Time:</b> {rule?.startTime} - {rule?.endTime}</p>

                  <Button
                    className="mt-4 w-full bg-slate-900 text-white"
                    onClick={openPayment}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-center" />
    </>
  );
};

export default TutorDetails;