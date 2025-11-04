import mongoose, { Schema, Document, Types, model } from "mongoose";

export interface ISession extends Document {
  tutorId: Types.ObjectId;
  userId: Types.ObjectId;
  slotId: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
}

const SessionSchema = new Schema<ISession>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

export const SessionModel = model<ISession>("Session", SessionSchema);
