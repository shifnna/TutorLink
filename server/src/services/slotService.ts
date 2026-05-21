// ======================================
// BACKEND - services/slotService.ts
// ======================================

import {
  injectable,
  inject,
} from "inversify";

import { TYPES } from "../types/types";

import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";

import { ISlotService } from "./interfaces/ISlotService";

import {
  CreateSlotRuleDto,
  IScheduleDto,
} from "../dtos/tutor.dto";

import { ISlotRule } from "../models/slotRule";

@injectable()
export class SlotService
  implements ISlotService
{
  constructor(
    @inject(TYPES.ISlotRepository)
    private readonly _slotRepo: ISlotRepository
  ) {}

  async createSlotRules(
    tutorId: string,
    payload: unknown
  ): Promise<ISlotRule> {
    if (
      !payload ||
      typeof payload !== "object"
    ) {
      throw new Error(
        "Invalid payload"
      );
    }

    const p =
      payload as Record<
        string,
        unknown
      >;

    const schedules =
      p.schedules as
        | IScheduleDto[]
        | undefined;

    if (
      !Array.isArray(schedules) ||
      !schedules.length
    ) {
      throw new Error(
        "Schedules required"
      );
    }

    for (const slot of schedules) {
      if (!slot.day)
        throw new Error(
          "Day required"
        );

      if (!slot.startTime)
        throw new Error(
          "Start time required"
        );

      if (!slot.endTime)
        throw new Error(
          "End time required"
        );

      if (
        slot.duration <= 0
      ) {
        throw new Error(
          "Invalid duration"
        );
      }

      if (
        slot.amount <= 0
      ) {
        throw new Error(
          "Invalid amount"
        );
      }
    }

    const dto: CreateSlotRuleDto =
      {
        tutorId,
        schedules,
      };

    return await this._slotRepo.saveRules(
      dto
    );
  }

  async getSlotRule(
    tutorId: string
  ): Promise<ISlotRule | null> {
    return await this._slotRepo.getRuleByTutorId(
      tutorId
    );
  }

  async getTutorRuleForClient(
    tutorId: string
  ): Promise<ISlotRule | null> {
    return await this._slotRepo.getRuleByTutorId(
      tutorId
    );
  }
}