import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminService } from "./interfaces/IAdminService";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { IUser } from "../models/user";
import { ITutor } from "../models/tutor";
import { COMMON_ERROR } from "../utils/constants";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository,
    @inject(TYPES.IAdminRepository) private readonly _adminRepo: IAdminRepository,
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service
  ) {}

  async getAllClients(): Promise<IUser[]> {
    return this._userRepo.findAll({ role: "client" });
  }

  async getAllTutors(): Promise<ITutor[]> {
    const users = await this._userRepo.findTutorsWithProfile();

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
    const tutors = await this._adminRepo.findPendingTutors();

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
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    const newStatus = !user.isBlocked;
    return this._userRepo.updateById(userId,{ isBlocked: newStatus }) as Promise<IUser>;
  }

  async approveTutor(userId: string): Promise<ITutor> {
    const tutor = await this._tutorRepo.findById(userId);
    if (!tutor) throw new Error("Tutor application not found");

    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    await this._userRepo.updateById(userId,{role:"tutor",tutorApplication:{status:"Approved"}});
    await this._tutorRepo.findOneAndUpdate({ tutorId: userId },{ adminApproved: true });

    if (tutor.profileImage) {
      user.profileImage = tutor.profileImage;
      await user.save();
    }
    return tutor;
  }

  async rejectTutor(userId: string, message: string): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    await this._userRepo.updateById(userId, { tutorApplication: { status: "Rejected", adminMessage: message } });
  }


  async blockUser(userId: string): Promise<IUser> {
    return this._userRepo.updateById(userId,{ isBlocked: true }) as Promise<IUser>;
  }

  async unblockUser(userId: string): Promise<IUser> {
    return this._userRepo.updateById(userId,{ isBlocked: false }) as Promise<IUser>;
  }

  async getDashboardStats(): Promise<{ totalUsers: number; totalTutors: number; subscriptions: number; revenue: number; pendingApplications: ITutor[] }> {
    const totalUsers = await this._userRepo.count({ role: { $ne: "admin" } });
    const totalTutors = await this._userRepo.count({ role: "tutor" });
    const pendingApplications = await this._adminRepo.findPendingTutors();

    return {
      totalUsers,
      totalTutors,
      subscriptions: 0,
      revenue: 0,
      pendingApplications,
    };
  }
}
