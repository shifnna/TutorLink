import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { ITutorService } from "./interfaces/ITutorService";
import { ITutor } from "../models/tutor";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { Types } from "mongoose";
import { ApplyTutorRequestDTO } from "../dtos/tutor/TutorRequestDTO";
import { PresignedUrlResponseDTO } from "../dtos/tutor/TutorResponseDTO";

@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly _s3Service: IS3Service,
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository
  ) {}

  async getPresignedUrl(fileName: string, fileType: string): Promise<PresignedUrlResponseDTO> {
    return this._s3Service.getPresignedUrl(fileName, fileType);
  }

       async applyForTutor(userId: string, body: ApplyTutorRequestDTO): Promise<ITutor> {

       const appData: Partial<ITutor> = {
         tutorId: userId,
         description: body.description,
         languages: body.languages.split(",").map(s => s.trim()),
         skills: body.skills.split(",").map(s => s.trim()),
         education: body.education,
         experienceLevel: body.experienceLevel,
         gender: body.gender,
         occupation: body.occupation,
         profileImage: body.profileImage || "",
         certificates: Array.isArray(body.certificates)
           ? body.certificates
           : typeof body.certificates === "string"
           ? body.certificates.split(",").map(s => s.trim())
           : [],
         accountHolder: body.accountHolder,
         accountNumber: String(body.accountNumber),
         bankName: body.bankName,
         ifsc: body.ifsc,
       };

       try {
         const tutor = await this._tutorRepo.create(appData);
         console.log("Tutor created successfully:", tutor._id);

         await this._userRepo.findByIdAndUpdate(userId, { 
           tutorProfile: tutor._id as Types.ObjectId, 
           tutorApplication: { status: "Pending" } 
         });
         console.log("User updated successfully");

         return tutor;
       } catch (err) {
         console.error("Error in applyForTutor:", err);
         throw err;  
       }
     }
     

  async getAllTutors(): Promise<ITutor[]> {
    const tutors : ITutor[] = await this._tutorRepo.findAllApproved()

    return Promise.all(
      tutors.map(async (tutor: ITutor ) => {
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
