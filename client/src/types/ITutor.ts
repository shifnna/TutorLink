import { ISlotRule } from "./ISlotRules";

export interface ITutor {
  _id: string;
  tutorId:{ _id: string; name: string; email?: string; profileImage:string } | null;
  description: string;
  languages: string[];
  education: string;
  skills: string[];
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: string;
  certificates: string[];
  adminApproved: boolean;
  slotRule?: ISlotRule;
}

export interface ITutorSearch {
  search?: string;
  experienceLevels?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}