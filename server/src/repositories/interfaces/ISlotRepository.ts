import { CreateSlotRuleDto } from "../../dtos/tutor.dto";
import { ISlotRule } from "../../models/slotRule";

export interface ISlotRepository {  
  saveRules(data:CreateSlotRuleDto):Promise<ISlotRule>;
  getRuleByTutorId(tutorId: string):Promise<ISlotRule | null>;
}