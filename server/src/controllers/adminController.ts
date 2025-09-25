import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private readonly adminService: IAdminService
  ) {}

  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.adminService.getAllClients();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  }

  async getAllTutors(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this.adminService.getAllTutors();
      res.status(200).json(tutors);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch tutors", error: error.message });
    }
  }

  async getAllTutorApplications(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this.adminService.getAllTutorApplications();
      res.status(200).json(tutors);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch tutor applications", error: error.message });
    }
  }

  async toggleUserStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updatedUser = await this.adminService.toggleUserStatus(id);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async approveTutor(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      await this.adminService.approveTutor(userId);
      return res.status(200).json({ message: "Tutor approved successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
  }
}
