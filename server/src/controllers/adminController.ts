import { Request, Response } from "express";
import { UserModel } from "../models/user"
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { IAdminController } from "./interfaces/IAdminController";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { TutorModel } from "../models/tutor";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Confing";


export class AdminController implements IAdminController {
  constructor(@inject(TYPES.IClientRepository) private readonly userRepo : IClientRepository){}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  }

  async generatePresignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiry
  return url;
  }

  async getAllTutors(req: Request, res: Response): Promise<void> {
  try {
    const tutors = await TutorModel.find()
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 });

    const tutorsWithPresigned = await Promise.all(
      tutors.map(async (tutor) => {
        // presigned URLs for certificates
        const presignedCerts = await Promise.all(
          (tutor.certificates || []).map((key) => this.generatePresignedUrl(key))
        );

        // presigned URL for profile image
        let profileImageUrl = tutor.profileImage;
        if (profileImageUrl) {
          profileImageUrl = await this.generatePresignedUrl(profileImageUrl);
        }

        return {
          ...tutor.toObject(),
          profileImage: profileImageUrl,   // ✅ replace with signed URL
          certificates: presignedCerts,    // ✅ replace with signed URLs
        };
      })
    );

    res.status(200).json(tutorsWithPresigned); // ✅ send correct array
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch tutors", error: error.message });
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
  
  async approveTutor(req: Request, res: Response) : Promise<Response>{
    try {
      const { userId } = req.params;
      const user = await this.userRepo.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      await this.userRepo.delete(userId);
      return res.status(200).json();
    } catch (error: any) {
      console.error("ApproveTutor error:", error.message); 
      return res.status(500).json({ error: error.message });
    }
  }
  
} 