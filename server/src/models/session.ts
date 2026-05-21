import { Schema, Document, Types, model } from "mongoose";

export interface ISession extends Document {
  tutorId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  date: Date;
  startTime: string;
  endTime: string;
  payment:{
    provider: string,
    orderId: string,
    paymentId: string,
    status: string,
  }
  videoRoomId?: string;
  videoRoomUrl?: string;
  feedback?: { message: string, rating: number, unsatisfied:boolean };
  paymentStatus?: "HOLD" | "RELEASED" | "REFUNDED";
  status: string;
}

const SessionSchema = new Schema<ISession>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required:true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    payment: {
      provider: String,
      orderId: String,
      paymentId: String,
      status: String,
    },
    videoRoomId: { type: String, default: null },
    videoRoomUrl: { type: String, default: null },
    feedback: { message: { type: String, default: "" }, rating: { type: Number, default: null }, unsatisfied: { type: Boolean, default: false }},
    paymentStatus: { type: String, enum: ["HOLD", "RELEASED", "REFUNDED"], default: "HOLD"},
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

export const SessionModel = model<ISession>("Session", SessionSchema);
