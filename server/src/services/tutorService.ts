import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { ITutorService } from "./interfaces/ITutorService";
import { ITutor } from "../models/tutor";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { Types } from "mongoose";

@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly _s3Service: IS3Service,
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository
  ) {}

  async getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }> {
    return this._s3Service.getPresignedUrl(fileName, fileType);
  }

  async applyForTutor(userId: string, body: any): Promise<ITutor> {
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
      certificates: Array.isArray(body.certificates)
        ? body.certificates
        : typeof body.certificates === "string"
        ? body.certificates.split(",")
        : [],
      accountHolder: body.accountHolder,
      accountNumber: String(body.accountNumber),
      bankName: body.bankName,
      ifsc: body.ifsc,
    };

    const tutor = await this._tutorRepo.create(appData);
    await this._userRepo.findByIdAndUpdate(userId, { tutorProfile: tutor._id as Types.ObjectId, tutorApplication:{status:"Pending"}}); 
    return tutor;
  }

  async getAllTutors(): Promise<ITutor[]> {
    const tutors = await this._tutorRepo.findAllApproved()

    return Promise.all(
      tutors.map(async (tutor: any) => {
        let profileImageUrl: string | null = null;
        if (tutor.profileImage) {
          profileImageUrl = await this._s3Service.generatePresignedUrl(tutor.profileImage);
        }

        let certificates: string[] = [];
        if (tutor.certificates?.length > 0) {
          certificates = await Promise.all(
            tutor.certificates.map((key: string) => this._s3Service.generatePresignedUrl(key))
          );
        }

        return {
          ...tutor.toObject(),
          profileImage: profileImageUrl,
          certificates,
        };
      })
    );
  }
}
