import { inject } from "inversify";
import { ISessionService } from "./interfaces/ISessionService";
import { injectable } from "inversify";
import { ISessionRepository } from "../repositories/interfaces/ISessionRepository";
import { TYPES } from "../types/types";
import Razorpay from "razorpay";
import crypto from "crypto";
import { UserMapper } from "../mappers/user.mapper";
import { FeedbackDTO, verifyPaymentDTO } from "../dtos/client.dto";
import { SessionModel } from "../models/session";

@injectable()
export class SessionService implements ISessionService{
    constructor(
        @inject(TYPES.ISessionRepository) private readonly _sessionRepo : ISessionRepository
    ){}

  async bookSession(amount:number) {
    if(!amount || amount<= 0) throw new Error("invalid amount");
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const payment_capture = 1;
    const currency = "INR";
    const options = {
      amount: Math.round(amount*100), //in paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture,
    }
    return await razorpay.orders.create(options);
  } 


  async verifyPayment(dto:verifyPaymentDTO, userId:string){
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(dto.razorpay_order_id + "|" + dto.razorpay_payment_id)
      .digest("hex");

    if (!dto.razorpay_order_id || !dto.razorpay_payment_id || !dto.razorpay_signature) throw new Error("Missing payment details");
    if (generatedSignature !== dto.razorpay_signature) throw new Error("Invalid signature"); 

    const mappedData = UserMapper.toDomain(userId,dto);

    const session = await this._sessionRepo.createSession(mappedData);

    await this._sessionRepo.updateAdminWallet( userId, dto.bookingDetails.amount, session._id as string,);
    return session;   
  }


  async getSessionsByUserId(userId: string) {
    return await this._sessionRepo.findSessionsByUserId(userId);
  }


  async cancelSession(sessionId: string) {
    const session = await this._sessionRepo.findById(sessionId);
    if (!session) throw new Error("Session not found");
    session.status = "Cancelled";
    await session.save();
  }

  async sentFeedback(body:FeedbackDTO){
    const session = await SessionModel.findById(body.sessionId);
      if (!session) throw new Error("Session not found");

      if (session.feedback?.message) throw new Error("feedback already submited");

      session.feedback = {
        message:body.message,
        rating:body.rating,
        unsatisfied:body.unsatisfied,
      };

      session.status = "Completed";

      return await session.save();
  }
}