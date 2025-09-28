import { Request, Response } from "express";
import { ITutorController } from "./interfaces/ITutorController";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorService } from "../services/interfaces/ITutorService";
import { STATUS_CODES } from "../utils/constants";

@injectable()
export class TutorController implements ITutorController {
  constructor(
    @inject(TYPES.ITutorService) private readonly _tutorService: ITutorService
  ) {}

  async getPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType } = req.body;
      const presignedUrl = await this._tutorService.getPresignedUrl(fileName, fileType);
      res.status(STATUS_CODES.SUCCESS).json(presignedUrl);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({ success: false, message: "Failed to get presigned URL" });
    }
  }

  async applyForTutor(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const result = await this._tutorService.applyForTutor(userId, req.body);
      res.status(STATUS_CODES.CREATED).json({ message: "Tutor profile created", result });
    } catch (error: any) {
      console.error("Error in TutorController.applyForTutor:", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({ success: false, message: error.message || "Failed to submit application" });
    }
  }

  async getAllTutors(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this._tutorService.getAllTutors();
      res.status(STATUS_CODES.SUCCESS).json({ success: true, tutors });
    } catch (error: any) {
      console.error(error);
      res.status(STATUS_CODES.SERVER_ERROR).json({ success: false, message: "Failed to fetch tutors", error: error.message });
    }
  }
}
