import { Orders } from "razorpay/dist/types/orders.js";
import { ISession } from "../../models/session.js";
import { FeedbackDTO, verifyPaymentDTO } from "../../dtos/client.dto.js";

export interface ISessionService {
  getSessionsByUserId(userId: string,role:string): Promise<ISession[]>;
  cancelSession(sessionId: string): Promise<void>;
  bookSession(amount:number): Promise<Orders.RazorpayOrder>;
  verifyPayment(dto:verifyPaymentDTO, userId:string): Promise<ISession>;
  sentFeedback(body:FeedbackDTO, requesterId: string):Promise<ISession>;
  getSessionById(sessionId: string):Promise<ISession |null>;
  completeSession(sessionId: string, requesterId: string): Promise<void>;
}