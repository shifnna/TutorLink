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
import { DashboardStatsResponseDTO } from "../dtos/admin/AdminResponseDTO";
import { IUserWithTutorDTO } from "../dtos/tutor/UserWithTutor";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository,
    @inject(TYPES.IAdminRepository) private readonly _adminRepo: IAdminRepository,
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service
  ) {}

  async getAllClients(): Promise<IUserWithTutorDTO[]> {
  const users: IUser[] = await this._userRepo.findAll({ role: "client" });

  return users.map((user) => {
    const userObj = user.toObject();
    return {
      id: userObj._id.toString(), // must have id
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      isBlocked: userObj.isBlocked || false,
      isVerified: userObj.isVerified,
      createdAt: userObj.createdAt,
      profileImage: userObj.profileImage || null,
      tutorProfile: null, // clients have no tutorProfile
    };
  });
}


  async getAllTutors(): Promise<IUserWithTutorDTO[]> {
  const users: IUser[] = await this._userRepo.findTutorsWithProfile();

  return Promise.all(
  users.map(async (user: IUser) => {
    let tutorProfileImageUrl: string | null = null;
    let tutorProfileCertificates: string[] = [];
    let tutorProfileData: IUserWithTutorDTO["tutorProfile"] = null;

    // Type guard: check if tutorProfile exists and is an object (not ObjectId)
    if (user.tutorProfile && typeof user.tutorProfile !== "string" && "profileImage" in user.tutorProfile) {
      const tutorProfile = user.tutorProfile as ITutor;

      tutorProfileImageUrl = tutorProfile.profileImage
        ? await this.s3Service.generatePresignedUrl(tutorProfile.profileImage)
        : null;

      if (tutorProfile.certificates?.length) {
        tutorProfileCertificates = await Promise.all(
          tutorProfile.certificates.map((key: string) =>
            this.s3Service.generatePresignedUrl(key)
          )
        );
      }

      tutorProfileData = {
        ...("toObject" in tutorProfile ? tutorProfile.toObject() : tutorProfile),
        profileImage: tutorProfileImageUrl,
        certificates: tutorProfileCertificates,
      };
    }

    const userObj = user.toObject();

    return {
      id: userObj._id.toString(),
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      isBlocked: userObj.isBlocked,
      isVerified: userObj.isVerified,
      createdAt: userObj.createdAt,
      profileImage: tutorProfileImageUrl || userObj.profileImage || null,
      tutorProfile: tutorProfileData,
    };
  })
);

}


  async getAllTutorApplications(): Promise<ITutor[]> {
    const tutors : ITutor[] = await this._adminRepo.findPendingTutors();

    return Promise.all(
      tutors.map(async (tutor: ITutor ) => {
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
    const tutor = await this._tutorRepo.findOne({ tutorId: userId });
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
    return;
  }


  async blockUser(userId: string): Promise<IUser> {
    return this._userRepo.updateById(userId,{ isBlocked: true }) as Promise<IUser>;
  }

  async unblockUser(userId: string): Promise<IUser> {
    return this._userRepo.updateById(userId,{ isBlocked: false }) as Promise<IUser>;
  }

  async getDashboardStats(): Promise<DashboardStatsResponseDTO> {
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
