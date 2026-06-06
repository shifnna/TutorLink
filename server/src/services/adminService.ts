import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAdminService } from "./interfaces/IAdminService";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IUser, UserModel } from "../models/user";
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
import { WalletModel } from "../models/wallet";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { LoginRequestDTO } from "../dtos/auth.dto";
import bcrypt from "bcryptjs";
import { ClientsQueryDTO, PaginatedClientsDTO } from "../controllers/adminController";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository,
    @inject(TYPES.IAdminRepository) private readonly _adminRepo: IAdminRepository,
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
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

      profileImageUrl = tutorProfile.profileImage || null;

      certUrls = tutorProfile.certificates || [];
    }

    return AdminMapper.toTutorDTO(user, tutorProfile, profileImageUrl, certUrls);
    })
  )}


  async getAllClients(query: ClientsQueryDTO): Promise<PaginatedClientsDTO> {
  const {
    search = "",
    status = "all",
    sort = "latest",
    page = "1",
    limit = "5",
  } = query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  // Build MongoDB filter
  const filter: Record<string, unknown> = { role: "client" };

  if (search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (status === "blocked") filter.isBlocked = true;
  if (status === "active") filter.isBlocked = false;

  // Build sort
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // latest
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "az") sortOption = { name: 1 };
  if (sort === "za") sortOption = { name: -1 };

  const { users, total } = await this._userRepo.findClientsPaginated(
    filter,
    sortOption,
    skip,
    limitNum
  );

  return {
    users: users.map(AdminMapper.toClientDTO),
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  };
};


  async getAllTutorApplications(): Promise<ITutor[]> {
  const tutors: ITutor[] =
    await this._adminRepo.findPendingTutors();

  return tutors.map((tutor: ITutor) => {
    return {
      ...tutor.toObject(),

      // Already public Cloudinary URLs
      profileImage: tutor.profileImage || null,
      certificates: tutor.certificates || [],
    };
  });
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

  async releasePayment(sessionId: string): Promise<void> {
  const session = await SessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found");

  if (session.paymentStatus !== "HOLD")
    throw new Error("Payment is not in HOLD status");

  // session.tutorId is already the User's ObjectId (ref: "User")
  // so NO need to go through TutorModel at all
  const tutorUserId = session.tutorId; // ← directly use this

  const adminUser = await UserModel.findOne({ role: "admin" });
  if (!adminUser) throw new Error("Admin not found");

  const amount = session.amount;

  // Deduct from admin holdBalance
  await WalletModel.findOneAndUpdate(
    { userId: adminUser._id },
    {
      $inc: { holdBalance: -amount },
      $push: {
        transactions: {
          senderId: adminUser._id,
          receiverId: tutorUserId,
          amount,
          description: "Session payment released to tutor",
          sessionId: session._id,
        },
      },
    }
  );

  // Add to tutor's wallet
  await WalletModel.findOneAndUpdate(
    { userId: tutorUserId },
    {
      $inc: { balance: amount },
      $push: {
        transactions: {
          senderId: adminUser._id,
          receiverId: tutorUserId,
          amount,
          description: "Session payment received",
          sessionId: session._id,
        },
      },
    },
    { upsert: true } // creates wallet if tutor has none
  );

  // Update session
  await SessionModel.findByIdAndUpdate(sessionId, {
    paymentStatus: "RELEASED",
  });

  // Notify tutor
  const message = `Payment of ₹${amount} has been released to your wallet.`;
  await NotificationModel.create({ userId: tutorUserId, title: "Payment Released", message });
  io.to(tutorUserId.toString()).emit("new-notification", { title: "Payment Released", message });
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

  async adminLogin(
  dto: LoginRequestDTO
): Promise<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}> {

  const user =
    await this._userRepo.findByEmail(
      dto.email
    );

  if (!user) {
    throw new Error(
      COMMON_ERROR.INVALID_CREDENTIALS
    );
  }

  if (user.role !== "admin") {
    throw new Error(
      "Only admins can login here"
    );
  }

  if (user.isBlocked) {
    throw new Error(
      "Admin account blocked"
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      dto.password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error(
      COMMON_ERROR.INVALID_CREDENTIALS
    );
  }

  return {
    user,

    accessToken:
      generateAccessToken({
        id: user.id,
        role: user.role,
      }),

    refreshToken:
      generateRefreshToken({
        id: user.id,
        role: user.role,
      }),
  };
}
}
