import { ITutor } from "../../models/tutor";

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
