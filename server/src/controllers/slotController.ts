import { inject } from "inversify";
import { TYPES } from "../types/types.js";
import { handleAsync } from "../utils/handleAsync.js";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { ISlotService } from "../services/interfaces/ISlotService.js";
import { ISlotController } from "./interfaces/ISlotController.js";

export class SlotController implements ISlotController {
  constructor(@inject(TYPES.ISlotService) private readonly _slotService: ISlotService) {}

  createSlotRule = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { user } = req as AuthRequest;
      if (!user) throw new Error("Tutor not authenticated");

      const result = await this._slotService.createSlotRule(String(user._id), req.body);
      return { success: true, message: "Slot rule created successfully", data: result };
    })(res, next);

  getSlotRules = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { user } = req as AuthRequest;
      if (!user) throw new Error("Tutor not authenticated");

      const result = await this._slotService.getSlotRules(String(user._id));
      return { success: true, message: "Fetched slot rules", data: result };
    })(res, next);

  getAvailableSlots = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { tutorId } = req.params;
      const { from, to } = req.query as { from?: string; to?: string };

      const result = await this._slotService.getAvailableSlots(tutorId, from ?? "", to ?? "");
      return { success: true, message: "Fetched available slots", data: result };
    })(res, next);

  bookSlot = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async () => {
      const { user } = req as AuthRequest;
      if (!user) throw new Error("Client not authenticated");

      const result = await this._slotService.bookSlot(req.body, String(user._id));
      return { success: true, message: "Slot booked successfully", data: result };
    })(res, next);
}