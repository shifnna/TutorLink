import { injectable, inject } from "inversify";
import { TYPES } from "../types/types.js";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository.js";
import { ISlotService } from "./interfaces/ISlotService.js";
import { CreateSlotRuleDto, DurationOptionDto, AvailableSlotDto, BookedSlotResponseDto } from "../dtos/tutor.dto.js";
import { ISlotRule } from "../models/slotRule.js";
import { generateRuleCode, generateSessionId } from "../utils/idGenerator.js";
import { getOccurrenceDates, isPastDate, todayStr, toMinutes, toTimeStr, weekdayOf } from "../utils/dateTimes.js";

const VALID_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
type RuleInput = Omit<CreateSlotRuleDto, "tutorId">;

@injectable()
export class SlotService implements ISlotService {
  constructor(@inject(TYPES.ISlotRepository) private readonly _slotRepo: ISlotRepository) {}

  async createSlotRule(tutorId: string, payload: unknown): Promise<ISlotRule> {
    const dto = this.validateRulePayload(payload);
    const ruleCode = generateRuleCode();
    return await this._slotRepo.createRule({ ...dto, tutorId, ruleCode });
  }

  private validateRulePayload(payload: unknown): RuleInput {
    if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
    const p = payload as Record<string, unknown>;

    const weekdays = p.weekdays as string[] | undefined;
    if (!Array.isArray(weekdays) || !weekdays.length) throw new Error("Select at least one weekday");
    if (weekdays.some((d) => !VALID_DAYS.includes(d))) throw new Error("Invalid weekday");

    const startDate = p.startDate as string;
    const endDate = p.endDate as string;
    if (!startDate || !endDate) throw new Error("Start and end date are required");
    if (startDate > endDate) throw new Error("End date must be after start date");
    if (isPastDate(startDate)) throw new Error("Start date cannot be in the past");

    const startTime = p.startTime as string;
    const endTime = p.endTime as string;
    if (!startTime || !endTime || startTime >= endTime) throw new Error("End time must be after start time");

    const windowMinutes = toMinutes(endTime) - toMinutes(startTime);
    if (windowMinutes > 240) throw new Error("Daily window cannot exceed 4 hours");

    const durations = p.durations as DurationOptionDto[] | undefined;
    if (!Array.isArray(durations) || !durations.length) throw new Error("Add at least one session duration");

    for (const d of durations) {
      if (!d.minutes || d.minutes <= 0) throw new Error("Invalid duration");
      if (d.minutes > windowMinutes) throw new Error(`${d.minutes} min doesn't fit inside the selected time window`);
      if (!d.amount || d.amount <= 0) throw new Error("Every duration needs a price above 0");
    }

    return { weekdays, startDate, endDate, startTime, endTime, durations };
  }

  async getSlotRules(tutorId: string): Promise<ISlotRule[]> {
    return await this._slotRepo.getRulesByTutorId(tutorId);
  }

  async getAvailableSlots(tutorId: string, fromDate: string, toDate: string): Promise<AvailableSlotDto[]> {
    const rules = await this._slotRepo.getRulesByTutorId(tutorId);
    const today = todayStr();
    const rangeStart = fromDate && fromDate > today ? fromDate : today; // never expose the past

    const results: AvailableSlotDto[] = [];

    for (const rule of rules) {
      const effectiveFrom = rangeStart > rule.startDate ? rangeStart : rule.startDate;
      const effectiveTo = toDate && toDate < rule.endDate ? toDate : rule.endDate;
      if (effectiveFrom > effectiveTo) continue;

      const occurrences = getOccurrenceDates(effectiveFrom, effectiveTo, rule.weekdays);
      if (!occurrences.length) continue;

      const bookedInRange = await this._slotRepo.getBookedSlotsInRange(tutorId, effectiveFrom, effectiveTo);
      const bookedDates = new Set(
        bookedInRange.filter((b) => String(b.ruleId) === String(rule._id) && b.startTime === rule.startTime).map((b) => b.date)
      );

      for (const occ of occurrences) {
        if (isPastDate(occ.date) || bookedDates.has(occ.date)) continue;

        results.push({
          ruleId: String(rule._id),
          date: occ.date,
          day: occ.day,
          startTime: rule.startTime,
          endTime: rule.endTime,
          durations: rule.durations,
        });
      }
    }

    return results;
  }

  async bookSlot(payload: unknown, clientId: string): Promise<BookedSlotResponseDto> {
    if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
    const p = payload as Record<string, unknown>;

    const ruleId = p.ruleId as string;
    const date = p.date as string;
    const minutes = p.minutes as number;
    if (!ruleId || !date || !minutes) throw new Error("Missing booking details");
    if (isPastDate(date)) throw new Error("Cannot book a slot on a past date");

    const rule = await this._slotRepo.getRuleById(ruleId);
    if (!rule) throw new Error("Slot rule not found");
    if (date < rule.startDate || date > rule.endDate) throw new Error("Date is outside this rule's range");

    const day = weekdayOf(date);
    if (!rule.weekdays.includes(day)) throw new Error("This date doesn't match the rule's weekdays");

    const durationOption = rule.durations.find((d) => d.minutes === minutes);
    if (!durationOption) throw new Error("Selected duration is not offered for this slot");

    const startTime = rule.startTime;
    const endTime = toTimeStr(toMinutes(startTime) + minutes);
    const sessionId = generateSessionId(date, startTime);

    try {
      const booked = await this._slotRepo.bookSlot({
        ruleId, tutorId: String(rule.tutorId), clientId, date, day,
        startTime, endTime, minutes, amount: durationOption.amount, sessionId,
      });

      return {
        sessionId: booked.sessionId, date: booked.date, day: booked.day,
        startTime: booked.startTime, endTime: booked.endTime,
        duration: booked.duration, amount: booked.amount,
      };
    } catch {
      throw new Error("This slot is already booked");
    }
  }
}