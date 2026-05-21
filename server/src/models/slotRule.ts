import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

export interface ISchedule {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
  isBooked: Boolean;
}

export interface ISlotRule extends Document {
  tutorId: Types.ObjectId;
  schedules: ISchedule[];
}

const ScheduleSchema = new Schema<ISchedule>({
  id: { type: String },

  day: {
    type: String,
    required: true,
  },

  startTime: {
    type: String,
    required: true,
  },

  endTime: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  durationUnit: {
    type: String,
    default: "minutes",
  },

  amount: {
    type: Number,
    required: true,
  },

  isBooked: {
    type: Boolean,
    default: false,
  },
});

const SlotRuleSchema =
  new Schema<ISlotRule>(
    {
      tutorId: {
        type: Schema.Types.ObjectId,
        required: true,
      },

      schedules: {
        type: [ScheduleSchema],
        default: [],
      },
    },
    { timestamps: true }
  );

export const SlotRuleModel =
  model<ISlotRule>(
    "SlotRule",
    SlotRuleSchema
  );