// src/types/tutor.ts
export interface TutorApplication {
  description: string;
  languages: string;
  education: string;
  skills: string;
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: string | null;     // S3 URL
  certificates: string[];          // S3 URLs
  accountHolder: string;
  accountNumber: number;
  bankName: string;
  ifsc: string;
}

export interface S3UploadResponse {
  url: string;        // final file URL
  key: string;        // S3 object key
}
