import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { handleAsync } from "../utils/handleAsync";
import { generateLinkDTO, rejectTutorDTO } from "../dtos/admin.dto";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private readonly _adminService: IAdminService
  ) {}

  getAllClients = (req: Request, res: Response, next: NextFunction) => 
    handleAsync(()=> this._adminService.getAllClients())(res,next);

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

    
  generateLink = async (req: Request, res: Response, next: NextFunction) =>
    handleAsync(()=> this._adminService.generateLink(req.body))(res,next);
    
}
