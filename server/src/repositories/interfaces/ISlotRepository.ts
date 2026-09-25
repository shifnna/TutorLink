import { ISlotRule } from "../../models/slotRule.js";
import { CreateSlotRuleDto } from "../../dtos/tutor.dto.js";
import { IBookedSlot } from "../../models/bookedSlotes.js";

export interface ISlotRepository {
  createRule(data: CreateSlotRuleDto & { ruleCode: string }): Promise<ISlotRule>;
  getRulesByTutorId(tutorId: string): Promise<ISlotRule[]>;
  getRuleById(ruleId: string): Promise<ISlotRule | null>;
  getBookedSlotsInRange(tutorId: string, fromDate: string, toDate: string): Promise<IBookedSlot[]>;
  bookSlot(data: {
    ruleId: string; tutorId: string; clientId: string; date: string; day: string;
    startTime: string; endTime: string; minutes: number; amount: number; sessionId: string;
  }): Promise<IBookedSlot>;
}