export interface ITutor {
  _id: string;
  tutorId?:{ _id: string; name: string; email?: string } | string // populated user info
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
}