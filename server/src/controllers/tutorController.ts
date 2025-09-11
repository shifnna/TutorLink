import { Request, Response } from "express";
import { TutorService } from "../services/tutorService";

const tutorService = new TutorService();

export class TutorController {
  static async applyForTutor(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user._id; // extend Express req.user later
      const tutor = await tutorService.applyTutor(userId, req.body, req.files as any);
      res.status(201).json({ message: "Tutor profile created", tutor });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTutorProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const tutor = await tutorService.getTutorByUserId(userId);
      if (!tutor) {
        res.status(404).json({ error: "Tutor profile not found" });
        return;
      }
      res.status(200).json(tutor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
