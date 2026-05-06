import { Types } from "mongoose";
import { ITutor } from "../models/tutor";

export interface CreateSlotRuleDto {
  tutorId: Types.ObjectId | string;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
}

export interface PresignedUrlRequestDTO {
  fileName: string;
  fileType: string;
}

export interface ApplyTutorRequestDTO {
  description: string;
  languages: string; // comma separated
  skills: string;
  education: string;
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage?: string;
  certificates?: string | string[];
  accountHolder: string;
  accountNumber: string | number;
  bankName: string;
  ifsc: string;
}


export interface PresignedUrlResponseDTO {
  url: string;
  key: string;
}

export interface TutorSuccessResponseDTO {
  message?: string;
  tutor?: ITutor | null;
  tutors?: ITutor[];
  success?: boolean;
}

export interface IUserWithTutorDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt?: Date;
  profileImage: string | null;
  tutorProfile: {
    _id: string;
    description: string;
    languages: string[];
    education: string;
    skills: string[];
    experienceLevel: string;
    gender: string;
    occupation: string;
    profileImage: string | null;
    certificates: string[];
  } | null;
}

