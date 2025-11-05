import { Types } from "mongoose";

export interface CreateSlotRuleDto {
  tutorId: Types.ObjectId | string;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
}
