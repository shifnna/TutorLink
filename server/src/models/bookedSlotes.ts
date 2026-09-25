import { Schema, model, Document, Types } from "mongoose";

export interface IBookedSlot extends Document {
  sessionId: string;
  ruleId: Types.ObjectId;
  tutorId: Types.ObjectId;
  clientId: Types.ObjectId;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
}

const BookedSlotSchema = new Schema<IBookedSlot>(
  {
    sessionId: { type: String, required: true, unique: true },
    ruleId: { type: Schema.Types.ObjectId, required: true },
    tutorId: { type: Schema.Types.ObjectId, required: true },
    clientId: { type: Schema.Types.ObjectId, required: true },
    date: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// stops the same rule+date+time being booked twice, even under a race condition
BookedSlotSchema.index({ tutorId: 1, ruleId: 1, date: 1, startTime: 1 }, { unique: true });

export const BookedSlotModel = model<IBookedSlot>("BookedSlot", BookedSlotSchema);