import { Schema, Document, model, Types } from "mongoose";

export interface ISlotRule extends Document {
  tutorId: Types.ObjectId;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
}

const SlotRuleSchema = new Schema<ISlotRule>(
  {
    tutorId: { type: Schema.Types.ObjectId, required: true },
    selectedDays: { type: [String], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    durationUnit: { type: String, default: "minutes" },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const SlotRuleModel = model<ISlotRule>("SlotRule", SlotRuleSchema);
