import { Types } from "mongoose";
import { verifyPaymentDTO } from "../dtos/client.dto";

export class UserMapper {
    static toDomain(userId:string, dto:verifyPaymentDTO) {
      return {
        tutorId: dto.bookingDetails.tutorUserId,
        userId :new Types.ObjectId(userId),
        date: dto.bookingDetails.selectedDate,
        startTime: dto.bookingDetails.startTime,
        endTime: dto.bookingDetails.endTime,
        amount: dto.bookingDetails.amount,
        payment: {
          provider: "razorpay",
          orderId: dto.razorpay_order_id,
          paymentId: dto.razorpay_payment_id,
          status: "Paid"
        },
        paymentStatus: "HOLD" as const,
        status: "Upcoming",
      }
    }
}