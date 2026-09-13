import { CreateSlotRuleDto } from "../../dtos/tutor.dto.js";
import { ISlotRule } from "../../models/slotRule.js";

export interface ISlotRepository {  
  saveRules(data:CreateSlotRuleDto):Promise<ISlotRule>;
  getRuleByTutorId(tutorId: string):Promise<ISlotRule | null>;
}