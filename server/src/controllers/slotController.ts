import { inject } from "inversify";
import { ISlotController } from "./interfaces/ISlotController";
import { TYPES } from "../types/types";
import { ISlotService } from "../services/interfaces/ISlotService";
import { handleAsync } from "../utils/handleAsync";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { CreateSlotRuleDto } from "../dtos/tutor/slotRuleDTO";

export class SlotController implements ISlotController {
  constructor(
    @inject(TYPES.ISlotService) private readonly _slotService: ISlotService,
    @inject(TYPES.ISlotRepository) private readonly _slotRepo: ISlotRepository
  ) {}

  createSlotRules = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { user } = req as AuthRequest;
      if (!user) throw new Error("Tutor not authenticated");
      const ruleData : CreateSlotRuleDto = {
        tutorId: user._id as string,
        selectedDays: req.body.days,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        duration: req.body.duration,
        durationUnit: req.body.durationUnit,
        amount: req.body.amount,
      };

      const savedRule = await this._slotRepo.saveRules(ruleData);
      const slots = await this._slotService.generateSlotsFromRule(savedRule);
      return { success: true, message: "Slots generated successfully", data: slots };
    })(res, next);


  getSlotRule = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
    const { user } = req as AuthRequest;
    if (!user) throw new Error("Tutor not authenticated");

    const rule = await this._slotRepo.getRuleByTutorId(user._id as string);
    return { success: true, message: "Fetched rule", data: rule };
  })(res, next);


  getSlots = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { user } = req as AuthRequest;
      if (!user) throw { statusCode: 401, message: "Tutor not authenticated" };
      const slots = await this._slotRepo.findAll({ tutorId: user._id });
      return {message: "Fetched slots", data: slots };
    })(res, next);

    
  deleteSlot = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { user } = req as AuthRequest;
      if (!user) throw new Error("Tutor not authenticated");

      const { slotId } = req.params;
      await this._slotRepo.findByIdAndDelete(slotId);
      return { success: true, message: "Slot deleted successfully" };
    })(res, next);

  getAvailableSlots = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { tutorId } = req.params;
      const slots = await this._slotRepo.findAll({ tutorId, isBooked: false });
      return { success: true, message: "Available slots fetched", data: slots };
    })(res, next);

  bookSession = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { slotId, userId } = req.params;
      const session = await this._slotService.bookSession(slotId, userId);
      return { success: true, message: "Slot booked successfully", data: session };
    })(res, next);

  getAllSessions = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { userId } = req.params;
      const sessions = await this._slotService.getSessionsByUserId(userId);
      return { success: true, message: "Fetched user sessions", data: sessions };
    })(res, next);

  cancelSession = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { id } = req.params;
      await this._slotService.cancelSession(id);
      return { success: true, message: "Session cancelled successfully" };
    })(res, next);

}
