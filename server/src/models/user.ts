import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  otpCode?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  tutorProfile?: Schema.Types.ObjectId; 
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otpCode: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, default: "client" },
  tutorProfile: { type: Schema.Types.ObjectId, ref: "Tutor" },
},{ timestamps: true } );

export const UserModel = model<IUser>("User", userSchema);
