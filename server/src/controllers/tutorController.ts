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
  handleAsync(async () => {
    const data: PresignedUrlRequestDTO = req.body;
    const presignedUrl = await this._tutorService.getPresignedUrl(data.fileName, data.fileType);

    return {
      success: true,
      message: "Presigned URL generated successfully",
      data: presignedUrl,
    };
  })(res, next);



  applyForTutor = (req: Request, res: Response, next: NextFunction) => {
  return handleAsync(async () => {
    const userId = (req as AuthRequest).user!.id;
    const data: ApplyTutorRequestDTO = req.body;
    const tutor = await this._tutorService.applyForTutor(userId, data);
    const response: TutorSuccessResponseDTO = {
      message: "Tutor profile created successfully",
      tutor,
    };
    return response;
  })(res, next);
};


 getTutorProfile = (req: Request, res: Response, next: NextFunction) =>
  handleAsync(async () => {
    const userId = (req as AuthRequest).user!.id;
    const tutor = await this._tutorService.getTutorProfile(userId);

    if (!tutor) {
      return { success: false, message: "Tutor profile not found", data: null };
    }

    return {
      success: true,
      message: "Tutor profile fetched successfully",
      data: tutor,
    };
  })(res, next);

  getAllTutors = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async()=>{
      const authReq = req as AuthRequest;
      const tutors = await this._tutorService.getAllTutors(authReq.user?._id as string);
      return tutors;
    })(res,next);

}