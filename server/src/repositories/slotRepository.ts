import { injectable } from "inversify";
import { ISlotRule, SlotRuleModel } from "../models/slotRule";
import { Types } from "mongoose";
import { ISlotRepository } from "./interfaces/ISlotRepository";
import { CreateSlotRuleDto } from "../dtos/tutor.dto";

@injectable()
export class SlotRepository implements ISlotRepository {

  async saveRules(ruleData: CreateSlotRuleDto): Promise<ISlotRule> {
    const existing = await SlotRuleModel.findOne({ tutorId: ruleData.tutorId });
    if (existing) {
      return await SlotRuleModel.findByIdAndUpdate(existing._id, ruleData, { new: true }) as ISlotRule;
    }
    return await SlotRuleModel.create(ruleData);
  }

  async getRuleByTutorId(tutorId: string): Promise<ISlotRule | null> {
    return await SlotRuleModel.findOne({ tutorId: new Types.ObjectId(tutorId) });
  }

}
