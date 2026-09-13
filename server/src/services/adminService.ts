import { inject, injectable } from "inversify";
import { TYPES } from "../types/types.js";
import { IAdminService } from "./interfaces/IAdminService.js";
import { IClientRepository } from "../repositories/interfaces/IClientRepository.js";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository.js";
import { IUser, UserModel } from "../models/user.js";
import { ITutor } from "../models/tutor.js";
import { COMMON_ERROR } from "../utils/constants.js";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository.js";
import { Types } from "mongoose";
import { INotificationService } from "./interfaces/INotificationService.js";
import { ISession, SessionModel } from "../models/session.js";
import { DashboardStatsResponseDTO, rejectTutorDTO } from "../dtos/admin.dto.js";
import { IUserWithTutorDTO } from "../dtos/tutor.dto.js";
import { AdminMapper } from "../mappers/admin.mapper.js";
import { WalletModel } from "../models/wallet.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { LoginRequestDTO } from "../dtos/auth.dto.js";
import bcrypt from "bcryptjs";
import { ClientsQueryDTO, PaginatedClientsDTO } from "../controllers/adminController.js";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository,
    @inject(TYPES.IAdminRepository) private readonly _adminRepo: IAdminRepository,
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.INotificationService) private readonly _notificationService: INotificationService,
  ) {}

  async getAllTutors(): Promise<IUserWithTutorDTO[]> {
    const users: IUser[] = await this._userRepo.findTutorsWithProfile();
    return Promise.all(
      users.map(async (user: IUser) => {
        let profileImageUrl: string | null = null;
        let certUrls: string[] = [];
        const tutorProfile = null;

        if (user.tutorProfile && typeof user.tutorProfile !== "string" && "profileImage" in user.tutorProfile) {
          const tutorProfile = user.tutorProfile;
          profileImageUrl = tutorProfile.profileImage || null;
          certUrls = tutorProfile.certificates || [];
        }

        return AdminMapper.toTutorDTO(user, tutorProfile, profileImageUrl, certUrls);
      })
    );
  }

  async getAllClients(query: ClientsQueryDTO): Promise<PaginatedClientsDTO> {
    const { search = "", status = "all", sort = "latest", page = "1", limit = "5" } = query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { role: "client" };

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (status === "blocked") filter.isBlocked = true;
    if (status === "active") filter.isBlocked = false;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "az") sortOption = { name: 1 };
    if (sort === "za") sortOption = { name: -1 };

    const { users, total } = await this._userRepo.findClientsPaginated(filter, sortOption, skip, limitNum);

    return {
      users: users.map(AdminMapper.toClientDTO),
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    };
  }

  async getAllTutorApplications(): Promise<ITutor[]> {
    const tutors: ITutor[] = await this._adminRepo.findPendingTutors();

    return tutors.map((tutor: ITutor) => {
      return {
        ...tutor.toObject(),
        profileImage: tutor.profileImage || null,
        certificates: tutor.certificates || [],
      };
    });
  }

  async toggleUserStatus(userId: string): Promise<IUser> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    const newStatus = !user.isBlocked;
    return this._userRepo.updateById(userId, { isBlocked: newStatus }) as Promise<IUser>;
  }

  async approveTutor(userId: string): Promise<ITutor> {
    const tutor = await this._tutorRepo.findOne({ tutorId: userId });
    if (!tutor) throw new Error("Tutor application not found");

    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    await this._userRepo.updateById(userId, { role: "tutor", tutorApplication: { status: "Approved" } });
    await this._tutorRepo.findOneAndUpdate({ tutorId: new Types.ObjectId(userId) }, { adminApproved: true });

    if (tutor.profileImage) {
      user.profileImage = tutor.profileImage;
      await user.save();
    }

    await this._notificationService.createAndSendNotification({
      userId,
      title: "Tutor Application Update",
      message: "Your tutor application is Approved.",
    });

    return tutor;
  }

  async rejectTutor(userId: string, dto: rejectTutorDTO): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_ERROR.USER_NOT_FOUND);

    await this._userRepo.updateById(userId, {
      tutorApplication: { status: "Rejected", adminMessage: dto.message },
    });

    // Previously this only emitted a socket event and never persisted —
    // an offline user lost the notification entirely. Now it's saved too.
    await this._notificationService.createAndSendNotification({
      userId,
      title: "Tutor Application Update",
      message: "Your tutor application is Rejected.",
    });

    return;
  }

  async blockUser(userId: string): Promise<IUser> {
    await this._notificationService.createAndSendNotification({
      userId,
      title: "User blocked",
      message: "Admin blocked You.",
    });

    return this._userRepo.updateById(userId, { isBlocked: true }) as Promise<IUser>;
  }

  async unblockUser(userId: string): Promise<IUser> {
    await this._notificationService.createAndSendNotification({
      userId,
      title: "User Unblocked",
      message: "Admin Unblocked You.",
    });

    return this._userRepo.updateById(userId, { isBlocked: false }) as Promise<IUser>;
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

    if (session.paymentStatus !== "HOLD") throw new Error("Payment is not in HOLD status");

    const tutorUserId = session.tutorId;

    const adminUser = await UserModel.findOne({ role: "admin" });
    if (!adminUser) throw new Error("Admin not found");

    const amount = session.amount;

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
      { upsert: true }
    );

    await SessionModel.findByIdAndUpdate(sessionId, { paymentStatus: "RELEASED" });

    const message = `Payment of ₹${amount} has been released to your wallet.`;
    await this._notificationService.createAndSendNotification({
      userId: tutorUserId.toString(),
      title: "Payment Released",
      message,
    });
  }

  async adminLogin(dto: LoginRequestDTO): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await this._userRepo.findByEmail(dto.email);

    if (!user) throw new Error(COMMON_ERROR.INVALID_CREDENTIALS);
    if (user.role !== "admin") throw new Error("Only admins can login here");
    if (user.isBlocked) throw new Error("Admin account blocked");

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new Error(COMMON_ERROR.INVALID_CREDENTIALS);

    return {
      user,
      accessToken: generateAccessToken({ id: user.id, role: user.role }),
      refreshToken: generateRefreshToken({ id: user.id, role: user.role }),
    };
  }
}