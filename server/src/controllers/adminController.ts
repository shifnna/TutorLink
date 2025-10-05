import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { STATUS_CODES } from "../utils/constants";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private readonly _adminService: IAdminService
  ) {}

  getAllClients = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this._adminService.getAllClients();
      res.status(STATUS_CODES.SUCCESS).json(users);
    } catch (error: any) {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: "Failed to fetch users", error: error.message });
    }
  };

  getAllTutors = async (req: Request, res: Response): Promise<void> => {
    try {
      const tutors = await this._adminService.getAllTutors();
      res.status(STATUS_CODES.SUCCESS).json(tutors);
    } catch (error: any) {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: "Failed to fetch tutors", error: error.message });
    }
  };

  getAllTutorApplications = async (req: Request,res: Response): Promise<void> => {
    try {
      const tutors = await this._adminService.getAllTutorApplications();
      res.status(STATUS_CODES.SUCCESS).json(tutors);
    } catch (error: any) {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({
          message: "Failed to fetch tutor applications",
          error: error.message,
        });
    }
  };

  toggleUserStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const updatedUser = await this._adminService.toggleUserStatus(id);
      return res.status(STATUS_CODES.SUCCESS).json(updatedUser);
    } catch (error: any) {
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  approveTutor = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;
      await this._adminService.approveTutor(userId);
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: "Tutor approved successfully" });
    } catch (error: any) {
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  rejectTutor = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;
      const { message } = req.body;
      await this._adminService.rejectTutor(userId, message);
      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: "Tutor rejected successfully" });
    } catch (error: any) {
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this._adminService.getDashboardStats();
      res.status(STATUS_CODES.SUCCESS).json(stats);
    } catch (error: any) {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({
          message: "Failed to fetch stats",
          error: error.message,
        });
    }
  };
}
