import { inject } from "inversify";
import { ISlotService } from "./interfaces/ISlotService";
import { TYPES } from "../types/types";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { Types } from "mongoose";
import { SessionModel } from "../models/session";

export class SlotService implements ISlotService {
  constructor(
    @inject(TYPES.ISlotRepository) private readonly _slotRepo: ISlotRepository
  ) {}

  async generateSlotsFromRule(rule: any) {
    const { tutorId, selectedDays, startTime, endTime, duration, durationUnit, amount } = rule;

    const durationInMinutes = durationUnit === "hours" ? duration * 60 : duration;
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (start >= end) throw new Error("Start time must be before end time");

    const newSlots: any[] = [];

    selectedDays.forEach((day: string) => {
      let current = new Date(start);
      while (current < end) {
        const next = new Date(current.getTime() + durationInMinutes * 60000);
        if (next > end) break;

        newSlots.push({
          tutorId : new Types.ObjectId(String(tutorId)),
          day,
          startTime: current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
          endTime: next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
          amount,
        });

        current = next;
      }
    });

    await this._slotRepo.deleteMany({tutorId,isBooked: false});
    await this._slotRepo.createMany(newSlots);

    return newSlots;
  }


  async bookSession(slotId: string, userId: string) {
    const slot = await this._slotRepo.findById(slotId);
    if (!slot) throw new Error("Slot not found");
    if (slot.isBooked) throw new Error("Slot already booked");

    const sessionDate = this.getNextDateForDay(slot.day);
    const isoDate = sessionDate.toISOString();

    slot.isBooked = true;
    await slot.save();

    const session = await SessionModel.create({
      tutorId: new Types.ObjectId(String(slot.tutorId)),
      userId: new Types.ObjectId(String(userId)),
      slotId: new Types.ObjectId(String(slot._id)),
      date: isoDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "Upcoming",
    });

    return session;
  }

  private getNextDateForDay(dayName: string): Date {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    if (targetDayIndex === -1) throw new Error(`Invalid day: ${dayName}`);

    const today = new Date();
    const currentDayIndex = today.getDay();
    let daysAhead = targetDayIndex - currentDayIndex;
    if (daysAhead <= 0) daysAhead += 7;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysAhead);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
  }

  async getSessionsByUserId(userId: string) {
    return await SessionModel.find({ userId })
      .populate("userId", "name email")
      .populate("tutorId", "name email")
      .sort({ date: 1 });
  }

  async cancelSession(sessionId: string) {
    const session = await SessionModel.findById(sessionId);
    if (!session) throw new Error("Session not found");

    session.status = "Cancelled";
    await session.save();
  }
  
}
