import { NextFunction, Request, Response } from "express";
import { ITutorController } from "./interfaces/ITutorController";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorService } from "../services/interfaces/ITutorService";
import { STATUS_CODES } from "../utils/constants";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ApplyTutorRequestDTO, PresignedUrlRequestDTO } from "../dtos/tutor/TutorRequestDTO";
import { TutorSuccessResponseDTO } from "../dtos/tutor/TutorResponseDTO";
import { handleAsync } from "../utils/handleAsync";

@injectable()
export class TutorController implements ITutorController {
  constructor(
    @inject(TYPES.ITutorService) private readonly _tutorService: ITutorService
  ) {}


  getPresignedUrl = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async()=>{
      const data : PresignedUrlRequestDTO = req.body;
      const presignedUrl = await this._tutorService.getPresignedUrl(data.fileName, data.fileType);
      res.status(STATUS_CODES.SUCCESS).json(presignedUrl);
    })(res,next);


  applyForTutor = (req: Request, res: Response, next: NextFunction) =>
    handleAsync( async()=>{
      const userId = (req as AuthRequest).user!.id;
      const data: ApplyTutorRequestDTO = req.body;
      const tutor = await this._tutorService.applyForTutor(userId, data);
      const response: TutorSuccessResponseDTO = {
        message: "Tutor profile created successfully", 
        tutor 
      };
      return response;
    })(res,next);


  getAllTutors = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async()=>{
      const tutors = await this._tutorService.getAllTutors();
      return tutors;
    })(res,next);

}