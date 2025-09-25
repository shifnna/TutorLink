import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { ITutorService } from "./interfaces/ITutorService";
import { ITutor, TutorModel } from "../models/tutor";
import { UserModel } from "../models/user";

@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly s3Service: IS3Service
  ) {}

  async getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }> {
    return this.s3Service.getPresignedUrl(fileName, fileType);
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

    const tutor = await this.tutorRepo.createApplication(appData);
    await UserModel.findByIdAndUpdate(userId, { tutorProfile: tutor._id });
    return tutor;
  }

  async getAllTutors(): Promise<ITutor[]> {
    const tutors = await TutorModel.find({ adminApproved: true })
      .sort({ createdAt: -1 })
      .populate("tutorId", "name email");

    return Promise.all(
      tutors.map(async (tutor: any) => {
        let profileImageUrl: string | null = null;
        if (tutor.profileImage) {
          profileImageUrl = await this.s3Service.generatePresignedUrl(tutor.profileImage);
        }

        let certificates: string[] = [];
        if (tutor.certificates?.length > 0) {
          certificates = await Promise.all(
            tutor.certificates.map((key: string) => this.s3Service.generatePresignedUrl(key))
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
