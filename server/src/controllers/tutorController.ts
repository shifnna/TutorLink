import { Request, Response } from "express";
import { ITutorController } from "./interfaces/ITutorController";
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { ITutorService } from "../services/interfaces/ITutorService";
import { injectable } from "inversify";

@injectable()
export class TutorController implements ITutorController {
  constructor(@inject(TYPES.ITutorService) private readonly tutorService : ITutorService){}
  async applyForTutor(req: Request, res: Response): Promise<void> {
    try {
      const tutorId = (req as any).user._id; // extend Express req.user later
      const tutor = await this.tutorService.applyTutor(tutorId, req.body, req.files as any);
      res.status(201).json({ message: "Tutor profile created", tutor });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
