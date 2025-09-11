import { Schema, model, Document } from "mongoose";

export interface ITutor extends Document {
  userId: Schema.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const TutorSchema = new Schema<ITutor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  },
  { timestamps: true }
);

export const TutorModel = model<ITutor>("Tutor", TutorSchema);
