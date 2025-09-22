import { Request, Response } from "express";
import { ITutorController } from "./interfaces/ITutorController";
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { ITutorService } from "../services/interfaces/ITutorService";
import { injectable } from "inversify";

@injectable()
export class TutorController implements ITutorController {
  constructor(@inject(TYPES.ITutorService) private readonly tutorService : ITutorService){};

  async getPresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType } = req.body;
      const presignedUrl = await this.tutorService.getPresignedUrl(fileName, fileType);
      res.status(200).json(presignedUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to get presigned URL" });
    }
  }

   async applyForTutor(req: Request, res: Response): Promise<void> {
     try {
       const userId = (req as any).user.id;  // JWT middleware
       const result = await this.tutorService.applyForTutor(userId, req.body);
       res.status(201).json({ message: "Tutor profile created", result });
     } catch (error: any) {
       console.error("Error in TutorController.applyForTutor:", error);
       res.status(500).json({ success: false, message: error.message || "Failed to submit application" });
     }
   }

}
