import { inject, injectable } from "inversify";
import crypto from "crypto";
import Razorpay from "razorpay";

import { ISessionService } from "./interfaces/ISessionService.js";
import { ISessionRepository } from "../repositories/interfaces/ISessionRepository.js";
import { TYPES } from "../types/types.js";
import { verifyPaymentDTO, FeedbackDTO } from "../dtos/client.dto.js";
import { SlotRuleModel } from "../models/slotRule.js";
import { SessionModel } from "../models/session.js";
import { UserMapper } from "../mappers/user.mapper.js";

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private readonly _sessionRepo: ISessionRepository
  ) {}

  async bookSession(amount: number) {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    return await razorpay.orders.create(options);
  }

  async verifyPayment(dto: verifyPaymentDTO, userId: string) {
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        dto.razorpay_order_id +
          "|" +
          dto.razorpay_payment_id
      )
      .digest("hex");

    console.log("Verify DTO:", dto);

    if (
      !dto?.razorpay_order_id ||
      !dto?.razorpay_payment_id ||
      !dto?.razorpay_signature
    ) {
      throw new Error("Missing payment details");
    }

    if (generatedSignature !== dto.razorpay_signature) {
      throw new Error("Invalid signature");
    }

    /*
     * Create the session
     */
    const mappedData = UserMapper.toDomain(userId, dto);

    mappedData.date = new Date(
      dto.bookingDetails.date
    );

    const session = await this._sessionRepo.createSession(
      mappedData
    );

    const roomId =
      "room_" +
      crypto.randomBytes(16).toString("hex");

    const videoRoomUrl =
      `${process.env.CLIENT_URL}/session/video/${session._id}/${roomId}`;

    session.videoRoomId = roomId;
    session.videoRoomUrl = videoRoomUrl;

    await this._sessionRepo.saveSession(session);

    await SlotRuleModel.updateOne(
      {
        tutorId: dto.bookingDetails.tutorUserId,
        "schedules.id": dto.bookingDetails.slotId,
      },
      {
        $set: {
          "schedules.$.isBooked": true,
        },
      }
    );

    await this._sessionRepo.updateAdminWallet(
      userId,
      dto.bookingDetails.amount,
      session._id as string
    );

    return session;
  }

  async getSessionsByUserId(
    userId: string,
    role: string
  ) {
    if (role === "tutor") {
      return await this._sessionRepo.findSessionsByTutorId(
        userId
      );
    }

    return await this._sessionRepo.findSessionsByUserId(
      userId
    );
  }

  async getSessionById(sessionId: string) {
  const session = await SessionModel.findById(sessionId)
    .populate("tutorId", "_id name")
    .populate("userId", "_id name");

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
}

  async cancelSession(
    sessionId: string
  ): Promise<void> {
    const session = await this._sessionRepo.findSessionById(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    session.status = "Cancelled";

    await session.save();
  }

  async sentFeedback(body: FeedbackDTO) {
    const session =
      await SessionModel.findById(body.sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.feedback?.message) {
      throw new Error(
        "feedback already submited"
      );
    }

    session.feedback = {
      message: body.message,
      rating: body.rating,
      unsatisfied: body.unsatisfied,
    };

    session.status = "Completed";

    return await session.save();
  }

  // async getSessionCount(){
  //    const completed = await SessionModel.find({status : "Completed"});
  //    const upcoming = await SessionModel.find({status : "Upcoming"});
  //    const cancelled = await SessionModel.find({status : "Cancelled"});

  //    return {
  //      completed,
  //      upcoming,
  //      cancelled
  //    }
  // }
}