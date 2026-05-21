import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";

import toast, {
  Toaster,
} from "react-hot-toast";

import { useParams } from "react-router-dom";

import { Button } from "../../components/ui/button";

import { tutorService } from "../../services/tutorService";

import { getTutorRuleForClient } from "../../services/slotService";

import {
  createOrder,
  verifyPayment,
} from "../../services/sessionService";

import { useAuthStore } from "../../store/authStore";

import { ITutor } from "../../types/ITutor";

import {
  ISchedule,
  ISlotRule,
} from "../../types/ISlotRules";

declare global {
  interface Window {
    Razorpay: any;
  }

  interface ImportMetaEnv {
    readonly VITE_RAZORPAY_KEY_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const TutorDetails: React.FC = () => {
  const { tutorId } =
    useParams();

  const { user } =
    useAuthStore();

  const [loading, setLoading] =
    useState(true);

  const [tutor, setTutor] =
    useState<ITutor | null>(
      null
    );

  const [rule, setRule] =
    useState<ISlotRule | null>(
      null
    );

  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState<ISchedule | null>(
    null
  );

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchTutor =
      async () => {
        try {
          const tutorRes =
            await tutorService.getTutorById(
              tutorId!
            );

          if (
            tutorRes.success &&
            tutorRes.data
          ) {
            setTutor(
              tutorRes.data
            );

            const slotRes =
              await getTutorRuleForClient(
                tutorRes.data
                  .tutorId?._id || ""
              );

            if (
              slotRes.success &&
              slotRes.data?.data
            ) {
              setRule(
                slotRes.data
                  .data
              );
            }
          }
        } catch {
          toast.error(
            "Failed to load tutor"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchTutor();
  }, [tutorId]);

  /* ---------------- NEXT DATE ---------------- */

  const getNextDateFromDay = (
    dayName: string
  ) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const today =
      new Date();

    const targetDay =
      days.indexOf(dayName);

    const currentDay =
      today.getDay();

    let diff =
      targetDay -
      currentDay;

    if (diff <= 0) {
      diff += 7;
    }

    const nextDate =
      new Date(today);

    nextDate.setDate(
      today.getDate() +
        diff
    );

    return nextDate
      .toISOString()
      .split("T")[0];
  };

  /* ---------------- AVAILABLE SLOTS ---------------- */

  const groupedSlots =
    useMemo(() => {
      const grouped: Record<
        string,
        ISchedule[]
      > = {};

      rule?.schedules
        ?.filter(
          (slot) =>
            !slot.isBooked
        )
        .forEach((slot) => {
          if (
            !grouped[slot.day]
          ) {
            grouped[slot.day] =
              [];
          }

          grouped[
            slot.day
          ].push(slot);
        });

      return grouped;
    }, [rule]);

  /* ---------------- BOOK SLOT ---------------- */

  const bookSlot =
    async (
      slot: ISchedule
    ) => {
      try {
        const orderRes =
          await createOrder(
            slot.amount
          );

        const order =
          orderRes.data?.data;

        if (!order?.id) {
          toast.error(
            "Order creation failed"
          );

          return;
        }

        const razorpay =
          new window.Razorpay({
            key:
              import.meta.env
                .VITE_RAZORPAY_KEY_ID,

            amount:
              order.amount,

            currency:
              order.currency,

            order_id:
              order.id,

            name:
              "TutorLink",

            description:
              "Session Booking",

            prefill: {
              name:
                user?.name ||
                "",

              email:
                user?.email ||
                "",
            },

            theme: {
              color:
                "#111827",
            },

            handler:
              async (
                response: any
              ) => {
                const verify =
                  await verifyPayment(
                    {
                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,

                      bookingDetails:
                        {
                          tutorUserId:
                            tutor
                              ?.tutorId
                              ?._id ||
                            "",

                          slotId:
                            slot.id ||
                            "",

                          day:
                            slot.day,

                          date:
                            getNextDateFromDay(
                              slot.day
                            ),

                          startTime:
                            slot.startTime,

                          endTime:
                            slot.endTime,

                          amount:
                            slot.amount,
                        },
                    }
                  );

                if (
                  !verify.success
                ) {
                  toast.error(
                    "Payment verification failed"
                  );

                  return;
                }

                toast.success(
                  "Session booked successfully"
                );

                setRule(
                  (
                    prev
                  ) => {
                    if (
                      !prev
                    )
                      return prev;

                    return {
                      ...prev,

                      schedules:
                        prev.schedules.map(
                          (
                            s
                          ) =>
                            s.id ===
                            slot.id
                              ? {
                                  ...s,
                                  isBooked:
                                    true,
                                }
                              : s
                        ),
                    };
                  }
                );

                setSelectedSlot(
                  null
                );
              },
          });

        razorpay.open();
      } catch (
        error
      ) {
        console.error(
          error
        );

        toast.error(
          "Booking failed"
        );
      }
    };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Tutor not found
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 md:px-8 py-8">

        <div className="max-w-6xl mx-auto space-y-6">

          {/* TOP */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* PROFILE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="flex flex-col items-center text-center">

                <img
                  src={
                    tutor
                      .tutorId
                      ?.profileImage ||
                    tutor.profileImage ||
                    "https://placehold.co/300x300?text=Tutor"
                  }
                  alt={
                    tutor
                      .tutorId
                      ?.name
                  }
                  className="w-32 h-32 rounded-2xl object-cover border border-slate-200"
                />

                <h1 className="text-2xl font-bold mt-4">
                  {
                    tutor
                      .tutorId
                      ?.name
                  }
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                  {
                    tutor.occupation
                  }
                </p>

                <p className="mt-5 text-sm text-slate-700 leading-relaxed">
                  {
                    tutor.description
                  }
                </p>
              </div>
            </div>

            {/* ABOUT */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">

              <h2 className="text-xl font-bold">
                About Tutor
              </h2>

              <div className="space-y-2 text-sm text-slate-700">

                <p>
                  <b>
                    Experience:
                  </b>{" "}
                  {
                    tutor.experienceLevel
                  }
                </p>

                <p>
                  <b>
                    Education:
                  </b>{" "}
                  {
                    tutor.education
                  }
                </p>

                <p>
                  <b>
                    Gender:
                  </b>{" "}
                  {
                    tutor.gender
                  }
                </p>
              </div>

              {!!tutor.skills
                ?.length && (
                <div>
                  <p className="font-semibold mb-2">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tutor.skills.map(
                      (
                        skill
                      ) => (
                        <span
                          key={
                            skill
                          }
                          className="px-3 py-1 rounded-full bg-slate-100 text-xs"
                        >
                          {
                            skill
                          }
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {!!tutor.languages
                ?.length && (
                <div>
                  <p className="font-semibold mb-2">
                    Languages
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tutor.languages.map(
                      (
                        lang
                      ) => (
                        <span
                          key={
                            lang
                          }
                          className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs"
                        >
                          {
                            lang
                          }
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SLOTS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="w-5 h-5" />

              <h2 className="text-xl font-bold">
                Available Slots
              </h2>
            </div>

            {!Object.keys(
              groupedSlots
            ).length ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No slots available
              </div>
            ) : (
              <div className="space-y-5">

                {Object.entries(
                  groupedSlots
                ).map(
                  ([
                    day,
                    slots,
                  ]) => (
                    <div
                      key={
                        day
                      }
                    >

                      <div className="flex items-center justify-between mb-3">

                        <h3 className="font-semibold text-slate-800">
                          {day}
                        </h3>

                        <span className="text-xs text-slate-400">
                          {
                            slots.length
                          }{" "}
                          slots
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        {slots.map(
                          (
                            slot
                          ) => (
                            <motion.button
                              key={
                                slot.id
                              }
                              whileTap={{
                                scale: 0.98,
                              }}
                              onClick={() =>
                                setSelectedSlot(
                                  slot
                                )
                              }
                              className={`border rounded-xl p-4 text-left transition ${
                                selectedSlot?.id ===
                                slot.id
                                  ? "border-black bg-slate-100"
                                  : "hover:border-slate-400"
                              }`}
                            >

                              <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2 text-sm font-medium">

                                  <Clock3 className="w-4 h-4" />

                                  <span>
                                    {
                                      slot.startTime
                                    }{" "}
                                    -{" "}
                                    {
                                      slot.endTime
                                    }
                                  </span>
                                </div>

                                <span className="text-sm font-bold text-emerald-600">
                                  ₹
                                  {
                                    slot.amount
                                  }
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 mt-2">
                                {
                                  slot.duration
                                }{" "}
                                {
                                  slot.durationUnit
                                }
                              </p>
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* BOOK PANEL */}
            {selectedSlot && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-6 border-t pt-5 space-y-4"
              >

                <div className="bg-slate-100 rounded-xl p-4">

                  <p className="text-sm text-slate-500">
                    Selected Slot
                  </p>

                  <h3 className="font-semibold text-lg mt-1">
                    {
                      selectedSlot.day
                    }{" "}
                    •{" "}
                    {
                      selectedSlot.startTime
                    }{" "}
                    -{" "}
                    {
                      selectedSlot.endTime
                    }
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Session Date:
                  </p>

                  <p className="font-medium">
                    {
                      getNextDateFromDay(
                        selectedSlot.day
                      )
                    }
                  </p>
                </div>

                <Button
                  onClick={() =>
                    bookSlot(
                      selectedSlot
                    )
                  }
                  className="w-full bg-black hover:bg-slate-800 text-white"
                >
                  Book for ₹
                  {
                    selectedSlot.amount
                  }
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
};

export default TutorDetails;