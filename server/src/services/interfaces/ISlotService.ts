import { ISlotRule } from "../../models/slotRule";
import { ISlot } from "../../models/slot";
import { ISession } from "../../models/session";

export interface ISlotService {
  generateSlotsFromRule(rule: ISlotRule): Promise<ISlot[]>;
  bookSession(slotId: string, userId: string): Promise<ISession>;
  getSessionsByUserId(userId: string): Promise<ISession[]>;
  cancelSession(sessionId: string): Promise<void>;
}
