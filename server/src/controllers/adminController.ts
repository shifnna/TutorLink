import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { handleAsync } from "../utils/handleAsync";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private readonly _adminService: IAdminService
  ) {}

  getAllClients = (req: Request, res: Response) => 
    handleAsync(()=> this._adminService.getAllClients())(res);

  getAllTutors = (req: Request, res: Response) =>
    handleAsync(() => this._adminService.getAllTutors())(res);


  getAllTutorApplications = (req: Request,res: Response) => 
    handleAsync(()=> this._adminService.getAllTutorApplications())(res);


  toggleUserStatus = async (req: Request, res: Response) =>
    handleAsync(()=> this._adminService.toggleUserStatus(req.params.id))(res);


  approveTutor = (req: Request, res: Response) =>
      handleAsync(() => this._adminService.approveTutor(req.params.userId))(res);


  rejectTutor = async (req: Request, res: Response) =>
    handleAsync(()=> this._adminService.rejectTutor(req.params.userId, req.body.message))(res);

 
  getDashboardStats = async (req: Request, res: Response) =>
    handleAsync(()=> this._adminService.getDashboardStats())(res);
}
