// services/tutorService.ts
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { injectable } from "inversify";
import { ITutor } from "../models/tutor";
import { ITutorService } from "./interfaces/ITutorService";
import { IS3Service } from "./interfaces/IS3Service";
import { UserModel } from "../models/user";

@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly tutorRepo : ITutorRepository,
    @inject(TYPES.IS3Service) private readonly s3Service : IS3Service,
  ){}
  
  async getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }> {
    const presigned = await this.s3Service.getPresignedUrl(fileName, fileType);
    return presigned;
  }

  async applyForTutor(userId: string, body: any): Promise<ITutor | null> {
  try {
    const appData: Partial<ITutor> = {
      tutorId: userId,
      description: body.description,
      languages: body.languages.split(","),
      skills: body.skills.split(","),
      education: body.education,
      experienceLevel: body.experienceLevel,
      gender: body.gender,
      occupation: body.occupation,
      profileImage: body.profileImage || "",
      certificates:  Array.isArray(body.certificates) ? body.certificates : typeof body.certificates === "string" ? body.certificates.split(",") : [],
      accountHolder: body.accountHolder,
      accountNumber: String(body.accountNumber),
      bankName: body.bankName,
      ifsc: body.ifsc,
    };

    const tutor = await this.tutorRepo.createApplication(appData);
    await UserModel.findByIdAndUpdate(userId, { tutorProfile: tutor._id });

    return tutor;
  } catch (error) {
    console.error("Error in applyForTutor service:", error);
    throw error;
  }
}

}   
