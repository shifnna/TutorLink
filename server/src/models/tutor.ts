import { Schema, model, Document, Types } from "mongoose";

export interface ITutor extends Document {
  minSlotAmount?: number;
  hasSlots?: boolean;
  startingPrice?: number;
  tutorId: Types.ObjectId;
  description: string;
  languages: string[];
  education: string;
  subjects: string[];
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: string;  
  certificates: string[];
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  adminApproved : boolean;
}

const TutorSchema = new Schema<ITutor>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    languages: [String],
    education: String,
    subjects: [String],
    experienceLevel: String,
    gender: String,
    occupation: String,
    profileImage: String,   
    certificates: [String],
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifsc: String,
    adminApproved: {type:Boolean , default:false}
  },
  { timestamps: true }
);

// Speeds up the tutor-listing filter queries
TutorSchema.index({ adminApproved: 1, languages: 1 });
TutorSchema.index({ adminApproved: 1, subjects: 1 });

export const TutorModel = model<ITutor>("Tutor", TutorSchema);
