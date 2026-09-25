import { Types } from "mongoose";
import { verifyPaymentDTO } from "../dtos/client.dto.js";

interface ResolvedBooking {
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
}

export class UserMapper {
  static toDomain(userId: string, dto: verifyPaymentDTO, resolved: ResolvedBooking) {
    return {
      tutorId: new Types.ObjectId(resolved.tutorId),
      userId: new Types.ObjectId(userId),
      date: new Date(resolved.date),
      startTime: resolved.startTime,
      endTime: resolved.endTime,
      amount: resolved.amount,
      payment: {
        provider: "razorpay",
        orderId: dto.razorpay_order_id,
        paymentId: dto.razorpay_payment_id,
        status: "Paid",
      },
      paymentStatus: "HOLD" as const,
      status: "Upcoming",
    };
  }
}