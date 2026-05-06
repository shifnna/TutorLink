import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { ISlotService } from "./interfaces/ISlotService";
import { CreateSlotRuleDto } from "../dtos/tutor.dto";
import { ISlotRule } from "../models/slotRule";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(TYPES.ISlotRepository) private readonly _slotRepo: ISlotRepository
  ) {}

  async createSlotRules(tutorId: string, payload: unknown): Promise<ISlotRule> {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload");
    }

    const p = payload as Record<string, unknown>;

    const selectedDays = Array.isArray(p.days) ? (p.days as string[]) : undefined;
    const startTime = typeof p.startTime === "string" ? p.startTime : undefined;
    const endTime = typeof p.endTime === "string" ? p.endTime : undefined;
    const duration = typeof p.duration === "number" ? p.duration : undefined;
    const durationUnit = typeof p.durationUnit === "string" ? p.durationUnit : undefined;
    const amount = typeof p.amount === "number" ? p.amount : undefined;

    if (!selectedDays || selectedDays.length === 0) throw new Error("selectedDays is required");
    if (!startTime) throw new Error("startTime is required");
    if (!endTime) throw new Error("endTime is required");
    if (duration === undefined) throw new Error("duration is required");
    if (!durationUnit) throw new Error("durationUnit is required");
    if (amount === undefined) throw new Error("amount is required");

    const dto: CreateSlotRuleDto = {
      tutorId: tutorId,
      selectedDays,
      startTime,
      endTime,
      duration,
      durationUnit,
      amount,
    };

    const saved = await this._slotRepo.saveRules(dto);
    return saved;
  }

  async getSlotRule(tutorId: string): Promise<ISlotRule | null> {
    if (!tutorId) throw new Error("Missing tutorId");
    return await this._slotRepo.getRuleByTutorId(tutorId);
  }

  async getTutorRuleForClient(tutorId: string): Promise<ISlotRule | null> {
    if (!tutorId) throw new Error("Missing tutorId");
    return await this._slotRepo.getRuleByTutorId(tutorId);
  }
}
