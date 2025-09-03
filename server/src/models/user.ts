import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  otpCode?: string;
  otpExpiry?: Date;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otpCode: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
});

export const UserModel = model<IUser>("User", userSchema);
