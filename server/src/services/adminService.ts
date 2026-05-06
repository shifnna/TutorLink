import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminService } from "./interfaces/IAdminService";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { IUser } from "../models/user";
import { ITutor, TutorModel } from "../models/tutor";
import { COMMON_ERROR } from "../utils/constants";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { Types } from "mongoose";
import { NotificationModel } from "../models/notifications";
import { io } from "../server";
import { ISession, SessionModel } from "../models/session";
import crypto from "crypto";
import { DashboardStatsResponseDTO, generateLinkDTO, rejectTutorDTO } from "../dtos/admin.dto";
import { IUserWithTutorDTO } from "../dtos/tutor.dto";
import { AdminMapper } from "../mappers/admin.mapper";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository,
    @inject(TYPES.IAdminRepository) private readonly _adminRepo: IAdminRepository,
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service
  ) {}

 
  async getAllTutors(): Promise<IUserWithTutorDTO[]> {
    const users: IUser[] = await this._userRepo.findTutorsWithProfile();
    return Promise.all(
    users.map(async (user: IUser) => {
      let profileImageUrl: string | null = null;
      let certUrls: string[] = [];
      let tutorProfile = null;

    if (user.tutorProfile && typeof user.tutorProfile !== "string" && "profileImage" in user.tutorProfile) {
      const tutorProfile = user.tutorProfile;

      profileImageUrl = tutorProfile.profileImage
        ? await this.s3Service.generatePresignedUrl(tutorProfile.profileImage)
        : null;

      certUrls = await Promise.all(
          (tutorProfile.certificates ?? []).map((key) =>
            this.s3Service.generatePresignedUrl(key)
      ));
    }

    return AdminMapper.toTutorDTO(user, tutorProfile, profileImageUrl, certUrls);
    })
  )}


  async getAllClients(): Promise<IUserWithTutorDTO[]> {
    const users = await this._userRepo.findAll({ role: "client" });
    return users.map(AdminMapper.toClientDTO);
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
    await this._tutorRepo.findOneAndUpdate({ tutorId: new Types.ObjectId(userId) },{ adminApproved: true });

    if (tutor.profileImage) {
      user.profileImage = tutor.profileImage;
      await user.save();
    }

    await NotificationModel.create({
      userId,
      title: "Tutor Application Update",
      message: `Your tutor application is Approved.`,
    });
    
    io.to(userId.toString()).emit("new-notification", {
      title: "Tutor Application Update",
      message: `Your tutor application is Approved.`,
    });

    return tutor;
  }

  async rejectTutor(userId: string, dto: rejectTutorDTO): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    await this._userRepo.updateById(userId, { tutorApplication: { status: "Rejected", adminMessage: dto.message } });

    io.to(userId.toString()).emit("new-notification", {
      title: "Tutor Application Update",
      message: `Your tutor application is Rejected.`,
    });
    
    return;
  }


  async blockUser(userId: string): Promise<IUser> {
    await NotificationModel.create({
      userId,
      title: "User blocked",
      message: `Admin blocked You.`,
    });

    io.to(userId.toString()).emit("new-notification", {
      title: "User blocked",
      message:" Admin blocked You.",
    });

    return this._userRepo.updateById(userId,{ isBlocked: true }) as Promise<IUser>;
  }

  async unblockUser(userId: string): Promise<IUser> {
    await NotificationModel.create({
      userId,
      title: "User Unblocked",
      message: `Admin Unblocked You.`,
    });

    io.to(userId.toString()).emit("new-notification", {
      title: "User Unblocked",
      message:" Admin Unblocked You.",
    });

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

  async getAllSessions(): Promise<ISession[]> {
    return this._adminRepo.getAllSession();
  }

  async generateLink(dto : generateLinkDTO ): Promise<string>{
      const session = await SessionModel.findById(dto.sessionId);
      if (!session) throw new Error("Session not found");

  
      const roomId = "room_" + crypto.randomBytes(16).toString("hex");
      const url = `${process.env.CLIENT_URL}/session/video/${dto.sessionId}/${roomId}`;

      await SessionModel.findByIdAndUpdate(dto.sessionId, { videoRoomId: roomId,videoRoomUrl: url});

    //// SEND NOTIFICATIONS
    const tutorProfile = await TutorModel.findById(session.tutorId);
    if (!tutorProfile) throw new Error("Tutor not found");

    const tutorUserId = tutorProfile.tutorId.toString();
    const userId = session.userId.toString();

    const title = "Video Call Link Ready";
    const message = "Your tutoring session video link is now available. Click to join.";

    const tutorNoti = await NotificationModel.create({
      userId: tutorUserId,
      title,
      message,
      link: url,
    });

    const userNoti = await NotificationModel.create({
      userId: userId,
      title,
      message,
      link: url,
    });

    //// emit socket events
    io.to(tutorUserId).emit("new-notification", tutorNoti);
    io.to(userId).emit("new-notification", userNoti);

    return url;
  }
}
