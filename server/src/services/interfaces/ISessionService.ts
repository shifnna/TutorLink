import { Orders } from "razorpay/dist/types/orders";
import { ISession } from "../../models/session";
import { FeedbackDTO, verifyPaymentDTO } from "../../dtos/client.dto";

export interface ISessionService {
  getSessionsByUserId(userId: string): Promise<ISession[]>;
  cancelSession(sessionId: string): Promise<void>;
  bookSession(amount:number): Promise<Orders.RazorpayOrder>;
  verifyPayment(dto:verifyPaymentDTO, userId:string): Promise<ISession>;
  sentFeedback(body:FeedbackDTO):Promise<ISession>;
}