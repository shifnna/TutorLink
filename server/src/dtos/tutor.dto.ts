import { ITutor } from "../models/tutor.js";
import type { Document } from "mongoose";

export interface IScheduleDto {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  durationUnit: string;
  amount: number;
  isBooked?:boolean;
}

export interface PresignedUrlRequestDTO {
  fileName: string;
  fileType: string;
}

export interface ApplyTutorRequestDTO {
  description: string;
  languages: string[];
  subjects: string[];
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
    subjects: string[];
    experienceLevel: string;
    gender: string;
    occupation: string;
    profileImage: string | null;
    certificates: string[];
  } | null;
}

export interface TutorResponseDTO
  extends Omit<
    ITutor,
    keyof Document
  > {
  startingPrice?: number;
}



export interface DurationOptionDto {
  minutes: number;
  amount: number;
}

export interface CreateSlotRuleDto {
  tutorId: string;
  weekdays: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durations: DurationOptionDto[];
}

export interface AvailableSlotDto {
  ruleId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  durations: DurationOptionDto[];
}

export interface BookedSlotResponseDto {
  sessionId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
}