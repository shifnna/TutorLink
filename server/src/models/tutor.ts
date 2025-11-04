import { Schema, model, Document, ObjectId, Types } from "mongoose";

export interface ITutor extends Document {
  tutorId: Types.ObjectId;
  description: string;
  languages: string[];
  education: string;
  skills: string[];
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
    skills: [String],
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

export const TutorModel = model<ITutor>("Tutor", TutorSchema);
