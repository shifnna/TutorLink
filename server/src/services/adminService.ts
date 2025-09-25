import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminService } from "./interfaces/IAdminService";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { IUser } from "../models/user";
import { ITutor } from "../models/tutor";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IClientRepository) private readonly userRepo: IClientRepository,
    @inject(TYPES.IAdminRepository) private readonly adminRepo: IAdminRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service
  ) {}

  async getAllClients(): Promise<IUser[]> {
    return this.userRepo.findClients();
  }

  async getAllTutors(): Promise<ITutor[]> {
    const users = await this.userRepo.findTutorsWithProfile();

    return Promise.all(
      users.map(async (user: any) => {
        let tutorProfileImageUrl: string | null = null;
        let tutorProfileCertificates: string[] = [];

        if (user.tutorProfile?.profileImage) {
          tutorProfileImageUrl = await this.s3Service.generatePresignedUrl(
            user.tutorProfile.profileImage
          );

          if (user.tutorProfile.certificates?.length > 0) {
            tutorProfileCertificates = await Promise.all(
              user.tutorProfile.certificates.map((key: string) =>
                this.s3Service.generatePresignedUrl(key)
              )
            );
          }
        }

        return {
          ...user.toObject(),
          profileImage: tutorProfileImageUrl,
          tutorProfile: user.tutorProfile
            ? {
                ...user.tutorProfile.toObject(),
                profileImage: tutorProfileImageUrl,
                certificates: tutorProfileCertificates,
              }
            : null,
        };
      })
    );
  }

  async getAllTutorApplications(): Promise<ITutor[]> {
    const tutors = await this.adminRepo.findPendingTutors();

    return Promise.all(
      tutors.map(async (tutor: any) => {
        const presignedCerts = await Promise.all(
          (tutor.certificates || []).map((key: string) =>
            this.s3Service.generatePresignedUrl(key)
          )
        );

        let profileImageUrl = tutor.profileImage;
        if (profileImageUrl) {
          profileImageUrl = await this.s3Service.generatePresignedUrl(profileImageUrl);
        }

        return {
          ...tutor.toObject(),
          profileImage: profileImageUrl,
          certificates: presignedCerts,
        };
      })
    );
  }

  async toggleUserStatus(userId: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const newStatus = !user.isBlocked;
    return this.userRepo.updateStatus(userId, newStatus) as Promise<IUser>;
  }

  async approveTutor(userId: string): Promise<ITutor> {
    const tutor = await this.adminRepo.findById(userId);
    if (!tutor) throw new Error("Tutor application not found");

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found in Tutor Applications");

    await this.adminRepo.updateRole(userId);
    await this.adminRepo.markApproved(userId);

    if (tutor.profileImage) {
      user.profileImage = tutor.profileImage;
      await user.save();
    }
    return tutor;
  }

  async blockUser(userId: string): Promise<IUser> {
    return this.userRepo.updateStatus(userId, true) as Promise<IUser>;
  }

  async unblockUser(userId: string): Promise<IUser> {
    return this.userRepo.updateStatus(userId, false) as Promise<IUser>;
  }

  async getDashboardStats(): Promise<{ totalUsers: number; totalTutors: number; subscriptions: number; revenue: number; pendingApplications: ITutor[] }> {
    const totalUsers = await this.userRepo.countUsers();
    const totalTutors = await this.userRepo.countTutors();
    const pendingApplications = await this.adminRepo.findPendingTutors();

    return {
      totalUsers,
      totalTutors,
      subscriptions: 0,
      revenue: 0,
      pendingApplications,
    };
  }
}
