import { NextFunction, Request, Response } from "express";
import { ITutorController } from "./interfaces/ITutorController";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorService } from "../services/interfaces/ITutorService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { handleAsync } from "../utils/handleAsync";

@injectable()
export class TutorController implements ITutorController {
  constructor(
    @inject(TYPES.ITutorService) private readonly _tutorService: ITutorService
  ) {}

  getPresignedUrl = (req: Request, res: Response, next: NextFunction) =>
  handleAsync(async () => {
    const presignedUrl = await this._tutorService.getPresignedUrl(req.body);

    return {
      success: true,
      message: "Presigned URL generated successfully",
      data: presignedUrl,
    };
  })(res, next);



  applyForTutor = (req: Request, res: Response, next: NextFunction) => {
    return handleAsync(async () => {
    const userId = (req as AuthRequest).user!.id;
    const tutor = await this._tutorService.applyForTutor(userId, req.body);

    return { message: "Tutor profile created successfully", tutor};
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
      return await this._tutorService.getAllTutors(authReq.user?._id as string);
    })(res,next);

  getTutorById = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(async()=>{
      const {tutorId} = req.params;
      return await this._tutorService.getTutorById(tutorId);
    })(res,next);

}