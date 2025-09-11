import { Request, Response } from "express";
import { UserModel } from "../models/user"
import { UserRepository } from "../repositories/userRepository";

const userRepo = new UserRepository();

export class AdminController {

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find()
        .select("id name email status createdAt");
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  }

  static async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepo.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const newStatus = user.isBlocked === true ? false : true;
      const updatedUser = await userRepo.updateStatus(id, newStatus);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }  
  
} 