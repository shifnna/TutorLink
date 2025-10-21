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
