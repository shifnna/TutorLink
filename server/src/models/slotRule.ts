import { Schema, model, Document, Types } from "mongoose";

export interface IDurationOption {
  minutes: number;
  amount: number;
}

export interface ISlotRule extends Document {
  ruleCode: string;
  tutorId: Types.ObjectId;
  weekdays: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durations: IDurationOption[];
}

const DurationOptionSchema = new Schema<IDurationOption>(
  { minutes: { type: Number, required: true }, amount: { type: Number, required: true } },
  { _id: false }
);

const SlotRuleSchema = new Schema<ISlotRule>(
  {
    ruleCode: { type: String, required: true, unique: true },
    tutorId: { type: Schema.Types.ObjectId, required: true },
    weekdays: { type: [String], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durations: { type: [DurationOptionSchema], required: true },
  },
  { timestamps: true }
);

export const SlotRuleModel = model<ISlotRule>("SlotRule", SlotRuleSchema);