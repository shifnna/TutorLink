// ======================================
// BACKEND - controllers/slotController.ts
// ======================================

import { inject } from "inversify";

import { TYPES } from "../types/types";

import { handleAsync } from "../utils/handleAsync";

import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthRequest } from "../middlewares/authMiddleware";

import { ISlotService } from "../services/interfaces/ISlotService";

export class SlotController {
  constructor(
    @inject(TYPES.ISlotService)
    private readonly _slotService: ISlotService
  ) {}

  createSlotRules = (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>
    handleAsync(async () => {
      const { user } =
        req as AuthRequest;

      if (!user) {
        throw new Error(
          "Tutor not authenticated"
        );
      }

      const result =
        await this._slotService.createSlotRules(
          String(user._id),
          req.body
        );

      return {
        success: true,
        message:
          "Schedules saved successfully",
        data: result,
      };
    })(res, next);

  getSlotRule = (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>
    handleAsync(async () => {
      const { user } =
        req as AuthRequest;

      if (!user) {
        throw new Error(
          "Tutor not authenticated"
        );
      }

      const result =
        await this._slotService.getSlotRule(
          String(user._id)
        );

      return {
        success: true,
        message:
          "Fetched schedules",
        data: result,
      };
    })(res, next);

  getTutorRuleForClient = (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>
    handleAsync(async () => {
      const { tutorId } =
        req.params;

      const result =
        await this._slotService.getTutorRuleForClient(
          tutorId
        );

      return {
        success: true,
        message:
          "Fetched tutor schedules",
        data: result,
      };
    })(res, next);
}