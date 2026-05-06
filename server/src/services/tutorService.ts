import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { IS3Service } from "./interfaces/IS3Service";
import { ITutorService } from "./interfaces/ITutorService";
import { ITutor } from "../models/tutor";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { Types } from "mongoose";
import { TutorMapper } from "../mappers/tutor.mapper";
import { ApplyTutorRequestDTO, PresignedUrlRequestDTO, PresignedUrlResponseDTO } from "../dtos/tutor.dto";

@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IS3Service) private readonly _s3Service: IS3Service,
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository
  ) {}

  async getPresignedUrl(dto:PresignedUrlRequestDTO): Promise<PresignedUrlResponseDTO> {
    return this._s3Service.getPresignedUrl(dto.fileName, dto.fileType);
  }

  async getTutorProfile(userId: string): Promise<ITutor | null> {
    return await this._tutorRepo.findOne({ tutorId: userId });
  }

  async applyForTutor(userId: string, dto: ApplyTutorRequestDTO): Promise<ITutor> {
    const mappedData = TutorMapper.toDomain(userId,dto);
    const tutor = await this._tutorRepo.create(mappedData);

    await this._userRepo.findByIdAndUpdate(userId, { 
      tutorProfile: tutor._id as Types.ObjectId, 
      tutorApplication: { status: "Pending" } 
    });
    console.log("User updated successfully");

    return tutor;
  }
     

  async getAllTutors(currentTutorId?: string): Promise<ITutor[]> {
    const tutors : ITutor[] = await this._tutorRepo.findAllApproved(currentTutorId)
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

  async getTutorById(tutorId: string): Promise<ITutor | null> {
  const tutor = await this._tutorRepo.findById(tutorId);
  if (!tutor) return null;

  let profileImageUrl: string | null = null;
  if (tutor.profileImage) {
    profileImageUrl = await this._s3Service.generatePresignedUrl(
      tutor.profileImage
    );
  }

  let certificates: string[] = [];
  if (tutor.certificates?.length > 0) {
    certificates = await Promise.all(
      tutor.certificates.map((key) =>
        this._s3Service.generatePresignedUrl(key)
      )
    );
  }

  return {
    ...tutor.toObject(),
    profileImage: profileImageUrl,
    certificates,
  };
}


}
