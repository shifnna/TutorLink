import { ISlotRule } from "../../models/slotRule";

export interface ISlotService {
  createSlotRules(tutorId: string, payload: unknown): Promise<ISlotRule>;
  getSlotRule(tutorId: string): Promise<ISlotRule | null>;
  getTutorRuleForClient(tutorId: string): Promise<ISlotRule | null>;
}
