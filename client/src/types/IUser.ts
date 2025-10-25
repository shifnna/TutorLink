import { ITutorApplication } from "./ITutorApplication";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean,
  joinedDate: string;
  profileImage: string | null;
  tutorApplication?: { status:"Pending" | "Rejected" | "Approved" | null , adminMessage?: string},
  createdAt?: string;
  tutorProfile?: ITutorApplication | null;
}

export interface ITutorProfile {
  description: string;
  languages: string[];
  education: string;
  skills: string[];
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: string;
  certificates: string[];
}

export interface IUserWithTutor {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  joinedDate: string;
  profileImage: string | null;
  tutorProfile?: ITutorProfile | null;
}
