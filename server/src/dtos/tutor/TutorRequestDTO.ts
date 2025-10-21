export interface PresignedUrlRequestDTO {
  fileName: string;
  fileType: string;
}

export interface ApplyTutorRequestDTO {
  description: string;
  languages: string; // comma separated
  skills: string; // comma separated
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