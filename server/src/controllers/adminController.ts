import { Request, Response } from "express";
import { UserModel } from "../models/user"
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";

export class AdminController implements IAdminController {
  constructor(@inject(TYPES.IClientRepository) private readonly userRepo : IClientRepository){}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find()
        .select("id name email status createdAt");
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  }

  async toggleUserStatus(req: Request, res: Response) : Promise<Response> {
    try {
      const { id } = req.params;
      const user = await this.userRepo.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const newStatus = user.isBlocked === true ? false : true;
      const updatedUser = await this.userRepo.updateStatus(id, newStatus);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }  
  
} 