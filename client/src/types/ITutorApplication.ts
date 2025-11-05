export interface ITutorApplication {
  _id: string;
  tutorId?: {
    isVerified: boolean;
    tutorApplication: any;
    _id: string;
    name: string;
    email: string;
  };
  description: string;
  languages: string | string[];
  education: string;
  skills: string | string[];
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: string ;
  certificates: string[];
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  createdAt: string;
}

export interface ITutorApplicationForm {
  description: string;
  languages:string |  string[];
  education: string;
  skills: string | string[];
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: File | null;   //// Before upload
  certificates: File[];        // //Before upload
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
}

export interface IApplicationModal {
  isOpen: boolean;
  onClose: () => void;
}

export interface IS3UploadData {
  url: string;
  key: string;
}

export interface IS3UploadResponse {
  success: boolean;
  message: string;
  data: IS3UploadData;
}
