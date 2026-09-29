import { inject, injectable } from "inversify";
import crypto from "crypto";
import Razorpay from "razorpay";

import { ISessionService } from "./interfaces/ISessionService.js";
import { ISessionRepository } from "../repositories/interfaces/ISessionRepository.js";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository.js";
import { TYPES } from "../types/types.js";
import { verifyPaymentDTO, FeedbackDTO } from "../dtos/client.dto.js";
import { SessionModel } from "../models/session.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { isPastDate, toMinutes, toTimeStr, weekdayOf } from "../utils/dateTimes.js";

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject(TYPES.ISessionRepository) private readonly _sessionRepo: ISessionRepository,
    @inject(TYPES.ISlotRepository) private readonly _slotRepo: ISlotRepository
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
    if (!dto?.razorpay_order_id || !dto?.razorpay_payment_id || !dto?.razorpay_signature) {
      throw new Error("Missing payment details");
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(dto.razorpay_order_id + "|" + dto.razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== dto.razorpay_signature) {
      throw new Error("Invalid signature");
    }

    const { ruleId, date, minutes } = dto.bookingDetails ?? {};
    if (!ruleId || !date || !minutes) {
      throw new Error("Missing slot selection details");
    }
    if (isPastDate(date)) {
      throw new Error("Cannot book a slot on a past date");
    }

    const rule = await this._slotRepo.getRuleById(ruleId);
    if (!rule) throw new Error("Slot rule not found");

    const durationOption = rule.durations.find((d) => d.minutes === minutes);
    if (!durationOption) throw new Error("Selected duration is not offered for this slot");

    const startTime = rule.startTime;
    const endTime = toTimeStr(toMinutes(startTime) + minutes);
    const day = weekdayOf(date);

    const mappedData = UserMapper.toDomain(userId, dto, {
      tutorId: String(rule.tutorId),
      date,
      startTime,
      endTime,
      amount: durationOption.amount,
    });

    const generateSessionId = (): string => {
      const date = new Date();
      const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
      const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
      return `SES-${datePart}-${randomPart}`;
    };

    const session = await this._sessionRepo.createSession({ ...mappedData, sessionId:generateSessionId()});

    const roomId = "room_" + crypto.randomBytes(16).toString("hex");
    const videoRoomUrl = `${process.env.CLIENT_URL}/session/video/${session._id}/${roomId}`;
    session.videoRoomId = roomId;
    session.videoRoomUrl = videoRoomUrl;
    await this._sessionRepo.saveSession(session);

    try {
      await this._slotRepo.bookSlot({
        ruleId,
        tutorId: String(rule.tutorId),
        clientId: userId,
        date,
        day,
        startTime,
        endTime,
        minutes,
        amount: durationOption.amount,
        sessionId: String(session._id),
      });
    } catch {
      session.status = "Cancelled";
      await session.save();
      throw new Error(
        "This slot was just booked by someone else. Please contact support if a charge appears on your end."
      );
    }

    await this._sessionRepo.updateAdminWallet(userId, durationOption.amount, session._id as string);

    return session;
  }

  async getSessionsByUserId(userId: string, role: string) {
    if (role === "tutor") {
      return await this._sessionRepo.findSessionsByTutorId(userId);
    }
    return await this._sessionRepo.findSessionsByUserId(userId);
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

  async cancelSession(sessionId: string): Promise<void> {
    const session = await this._sessionRepo.findSessionById(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    session.status = "Cancelled";
    await session.save();
  }

  async sentFeedback(body: FeedbackDTO, requesterId: string) {
    const session = await SessionModel.findById(body.sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (String(session.userId) !== requesterId) {
      throw new Error("Only the person who booked this session can leave feedback");
    }

    if (session.feedback?.message) {
      throw new Error("Feedback already submited");
    }

    session.feedback = {
      message: body.message,
      rating: body.rating,
      unsatisfied: body.unsatisfied,
    };

    return await session.save();
  }

  async completeSession(sessionId: string, requesterId: string): Promise<void> {
    const session = await this._sessionRepo.findSessionById(sessionId);
    if (!session) throw new Error("Session not found");

    const isParticipant =
      String(session.userId) === requesterId || String(session.tutorId) === requesterId;
    if (!isParticipant) throw new Error("You are not a participant in this session");

    if (session.status === "Cancelled") return;

    session.status = "Completed";
    await session.save();
  }
}