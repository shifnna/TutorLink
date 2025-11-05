import { FilterQuery, QueryOptions, SortOrder, UpdateQuery } from "mongoose";
import { ISlot } from "../../models/slot";
import { ISlotRule } from "../../models/slotRule";
import { CreateSlotRuleDto } from "../../dtos/tutor/slotRuleDTO";

export interface ISlotRepository {  
  saveRules(data:CreateSlotRuleDto):Promise<ISlotRule>;
  getRuleByTutorId(arg0: string): unknown;
  createMany(data:Partial<ISlot>[]) : Promise<ISlot[]>;
  findById(id: string): Promise<ISlot | null>;
  findByIdAndDelete(id: string): Promise<void>;
  findOne(filter:FilterQuery<ISlot>): Promise<ISlot | null>;
  deleteMany(filter: FilterQuery<ISlot>): Promise<void>;
  findAll(filter: FilterQuery<ISlot>,sort?: Record<string, SortOrder>,options?: QueryOptions): Promise<ISlot[]>
}