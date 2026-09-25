import { injectable } from "inversify";
import { Types } from "mongoose";
import { ISlotRule, SlotRuleModel } from "../models/slotRule.js";
import { ISlotRepository } from "./interfaces/ISlotRepository.js";
import { CreateSlotRuleDto } from "../dtos/tutor.dto.js";
import { BookedSlotModel, IBookedSlot } from "../models/bookedSlotes.js";

@injectable()
export class SlotRepository implements ISlotRepository {
  async createRule(data: CreateSlotRuleDto & { ruleCode: string }): Promise<ISlotRule> {
    return await SlotRuleModel.create({
      ruleCode: data.ruleCode,
      tutorId: new Types.ObjectId(data.tutorId),
      weekdays: data.weekdays,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      durations: data.durations,
    });
  }

  async getRulesByTutorId(tutorId: string): Promise<ISlotRule[]> {
    return await SlotRuleModel.find({ tutorId: new Types.ObjectId(tutorId) });
  }

  async getRuleById(ruleId: string): Promise<ISlotRule | null> {
    return await SlotRuleModel.findById(ruleId);
  }

  async getBookedSlotsInRange(tutorId: string, fromDate: string, toDate: string): Promise<IBookedSlot[]> {
    return await BookedSlotModel.find({
      tutorId: new Types.ObjectId(tutorId),
      date: { $gte: fromDate, $lte: toDate },
    });
  }

  async bookSlot(data: {
    ruleId: string; tutorId: string; clientId: string; date: string; day: string;
    startTime: string; endTime: string; minutes: number; amount: number; sessionId: string;
  }): Promise<IBookedSlot> {
    return await BookedSlotModel.create({
      sessionId: data.sessionId,
      ruleId: new Types.ObjectId(data.ruleId),
      tutorId: new Types.ObjectId(data.tutorId),
      clientId: new Types.ObjectId(data.clientId),
      date: data.date,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.minutes,
      amount: data.amount,
    });
  }
}