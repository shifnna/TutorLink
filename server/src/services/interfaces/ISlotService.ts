import { ISlotRule } from "../../models/slotRule.js";
import { AvailableSlotDto, BookedSlotResponseDto } from "../../dtos/tutor.dto.js";

export interface ISlotService {
  createSlotRule(tutorId: string, payload: unknown): Promise<ISlotRule>;
  getSlotRules(tutorId: string): Promise<ISlotRule[]>;
  getAvailableSlots(tutorId: string, fromDate: string, toDate: string): Promise<AvailableSlotDto[]>;
  bookSlot(payload: unknown, clientId: string): Promise<BookedSlotResponseDto>;
}