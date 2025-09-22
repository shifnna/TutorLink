export interface ITutorApplication {
  _id: string;
  tutorId: {
    _id: string;
    name: string;
    email: string;
  };
  description: string;
  languages: string[];
  education: string;
  skills: string[];
  experienceLevel: string;
  gender: string;
  occupation: string;
  profileImage: string;
  certificates: string[];
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  createdAt: string;
}

export interface IApplicationModal {
  isOpen: boolean;
  onClose: () => void;
}

export interface IS3UploadResponse {
  url: string;    
  key: string;      
  bucket?: string; 
  expiresIn?: number;
}