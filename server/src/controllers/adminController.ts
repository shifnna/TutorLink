import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { handleAsync } from "../utils/handleAsync";
import { IUserWithTutorDTO } from "../dtos/tutor.dto";
export interface ClientsQueryDTO {
  search?: string;
  status?: string;   // "all" | "active" | "blocked"
  sort?: string;     // "latest" | "oldest" | "az" | "za"
  page?: string;     // comes as string from req.query
  limit?: string;
}

export interface PaginatedClientsDTO {
  users: IUserWithTutorDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
}

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private readonly _adminService: IAdminService
  ) {}

 getAllClients = (req: Request, res: Response, next: NextFunction) =>
  handleAsync(() =>
    this._adminService.getAllClients(req.query as ClientsQueryDTO)
  )(res, next);

  getAllTutors = (req: Request, res: Response, next: NextFunction) =>
    handleAsync(() => this._adminService.getAllTutors())(res,next);


  getAllTutorApplications = (req: Request,res: Response, next: NextFunction) => 
    handleAsync(()=> this._adminService.getAllTutorApplications())(res,next);


  toggleUserStatus = async (req: Request, res: Response, next: NextFunction) =>
    handleAsync(()=> this._adminService.toggleUserStatus(req.params.id))(res,next);


  approveTutor = (req: Request, res: Response, next: NextFunction) =>
      handleAsync(() => this._adminService.approveTutor(req.params.userId))(res,next);


  rejectTutor = async (req: Request, res: Response, next: NextFunction) =>
    handleAsync(()=> this._adminService.rejectTutor(req.params.userId, req.body))(res,next);

 
  getDashboardStats = async (req: Request, res: Response, next: NextFunction) =>
    handleAsync(()=> this._adminService.getDashboardStats())(res,next);

  getAllSessions = async (req: Request, res: Response, next: NextFunction) =>
    handleAsync(()=> this._adminService.getAllSessions())(res,next);

  releasePayment = async (req: Request, res: Response, next: NextFunction) =>
  handleAsync(() => this._adminService.releasePayment(req.body.sessionId))(res, next);

  generateLink = async (req: Request, res: Response, next: NextFunction) =>
    handleAsync(()=> this._adminService.generateLink(req.body))(res,next);
    
  adminLogin = async (req: Request,res: Response,next: NextFunction): Promise<void> => {

  const result = await this._adminService.adminLogin(req.body);

  res.cookie(
    "accessToken",
    result.accessToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      maxAge: parseInt(
        process.env.ACCESS_TOKEN_MAX_AGE ||
        "900000",
        10
      ),
    }
  );

  res.cookie(
    "refreshToken",
    result.refreshToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      maxAge: parseInt(
        process.env.REFRESH_TOKEN_MAX_AGE ||
        "604800000",
        10
      ),
    }
  );

  handleAsync(async () => result.user)(res, next);
};
}
