import { Schema, Document, model, Types } from "mongoose";

export interface ISlot extends Document {
  tutorId: Types.ObjectId;
  day: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  amount?: number;
}

const SlotSchema = new Schema<ISlot>(
  {
    tutorId: { type: Schema.Types.ObjectId, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SlotModel = model<ISlot>("Slot", SlotSchema);
