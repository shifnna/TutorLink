import { Types } from "mongoose";
import { ISession, SessionModel } from "../models/session.js";
import { UserModel } from "../models/user.js";
import { WalletModel } from "../models/wallet.js";
import { BaseRepository } from "./baseRepository.js";
import { ISessionRepository } from "./interfaces/ISessionRepository.js";

export class SessionRepository extends BaseRepository<ISession> implements ISessionRepository{

  async createSession(session: Partial<ISession>): Promise<ISession> { 
    return await SessionModel.create(session);
  }

  async findSessionById(id: string): Promise<ISession | null> {
    return await SessionModel.findById(id);
  }

  async getSessionsForUser(userId: string): Promise<ISession[]> {
    return await SessionModel.find({ userId })
      .populate("userId", "name email")
      .populate("tutorId", "name email")
      .sort({ date: 1 });
  }

  async saveSession(session: ISession): Promise<ISession> {
    return await session.save();
  }

  async updateAdminWallet(userId: string, amount: number, sessionId: string) {
    const admin = await UserModel.findOne({ role: "admin" });
    if (!admin) throw new Error("Admin missing");

    let wallet = await WalletModel.findOne({ userId: admin._id });

    if (!wallet) {
      wallet = await WalletModel.create({
        userId: admin._id,
        balance: 0,
        holdBalance: 0,
        transactions: [],
      });
    }
     wallet.transactions.push({
      senderId: new Types.ObjectId(userId),
      receiverId: new Types.ObjectId(admin._id as string),
      amount,
      description: "Session payment",
      provider: "Razorpay",
      sessionId: new Types.ObjectId(sessionId),
    });

    (wallet.holdBalance as number) += amount;
    await wallet.save();
   }

  async findSessionsByUserId(
  userId: string
): Promise<ISession[]> {

  return await SessionModel.find({ userId })
    .populate(
      "userId",
      "name email profileImage"
    )
    .populate(
      "tutorId",
      "name email profileImage"
    )
    .sort({ date: -1 });
}

async findSessionsByTutorId( tutorId: string ): Promise<ISession[]> {
  return await SessionModel.find({
    $or: [
      { tutorId },
      { userId: tutorId }
    ]
  })
    .populate("userId","name email profileImage")
    .populate("tutorId","name email profileImage")
    .sort({ date: -1 });
}

async getAverageRatingsForTutors(tutorUserIds: string[]): Promise<Record<string, number>> {
    const results = await SessionModel.aggregate([
      {
        $match: {
          tutorId: { $in: tutorUserIds.map((id) => new Types.ObjectId(id)) },
          "feedback.rating": { $ne: null },
        },
      },
      { $group: { _id: "$tutorId", avgRating: { $avg: "$feedback.rating" } } },
    ]);

    const map: Record<string, number> = {};
    results.forEach((r) => { map[r._id.toString()] = r.avgRating; });
    return map;
  }

  async getAverageRatingForTutor(tutorUserId: string): Promise<number | null> {
    const result = await SessionModel.aggregate([
      { $match: { tutorId: new Types.ObjectId(tutorUserId), "feedback.rating": { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$feedback.rating" } } },
    ]);
    return result.length ? result[0].avgRating : null;
  }
}