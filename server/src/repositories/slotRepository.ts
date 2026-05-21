// ======================================
// BACKEND - repositories/slotRepository.ts
// ======================================

import { injectable } from "inversify";

import {
  ISlotRule,
  SlotRuleModel,
} from "../models/slotRule";

import { Types } from "mongoose";

import { ISlotRepository } from "./interfaces/ISlotRepository";

import { CreateSlotRuleDto } from "../dtos/tutor.dto";

@injectable()
export class SlotRepository
  implements ISlotRepository
{
  async saveRules(
    data: CreateSlotRuleDto
  ): Promise<ISlotRule> {
    const existing =
      await SlotRuleModel.findOne({
        tutorId: data.tutorId,
      });

    if (existing) {
      existing.schedules = data.schedules;

      return await existing.save();
    }

    return await SlotRuleModel.create({
      tutorId: data.tutorId,
      schedules: data.schedules,
    });
  }

  async getRuleByTutorId(
    tutorId: string
  ): Promise<ISlotRule | null> {
    return await SlotRuleModel.findOne({
      tutorId: new Types.ObjectId(
        tutorId
      ),
    });
  }
}