import { CreateSlotRuleDto } from "../dtos/tutor/slotRuleDTO";
import { ISlot, SlotModel } from "../models/slot";
import { ISlotRule, SlotRuleModel } from "../models/slotRule";
import { BaseRepository } from "./baseRepository";
import { ISlotRepository } from "./interfaces/ISlotRepository";

export class SlotRepository extends BaseRepository<ISlot> implements ISlotRepository {
  constructor(){
    super(SlotModel)
  }

  async saveRules(ruleData: CreateSlotRuleDto): Promise<ISlotRule> {
    const existing = await SlotRuleModel.findOne({ tutorId: ruleData.tutorId });
    if (existing) {
      return await SlotRuleModel.findByIdAndUpdate(existing._id, ruleData, { new: true }) as ISlotRule;
    }
      return await SlotRuleModel.create(ruleData);
  }

  async getRuleByTutorId(tutorId: string) {
    return await SlotRuleModel.findOne({ tutorId });
  }
}