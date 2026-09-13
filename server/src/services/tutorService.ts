import { inject, injectable } from "inversify";
import { TYPES } from "../types/types.js";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository.js";
import { ITutorService } from "./interfaces/ITutorService.js";
import { ITutor } from "../models/tutor.js";
import { IClientRepository } from "../repositories/interfaces/IClientRepository.js";
import { Types } from "mongoose";
import { TutorMapper } from "../mappers/tutor.mapper.js";
import { ApplyTutorRequestDTO, TutorResponseDTO } from "../dtos/tutor.dto.js";
import { ParsedQs } from "qs";


@injectable()
export class TutorService implements ITutorService {
  constructor(
    @inject(TYPES.ITutorRepository) private readonly _tutorRepo: ITutorRepository,
    @inject(TYPES.IClientRepository) private readonly _userRepo: IClientRepository
  ) {}

  async getTutorProfile(userId: string): Promise<ITutor | null> {
    return await this._tutorRepo.findOne({ tutorId: userId });
  }

  async applyForTutor(userId: string, dto: ApplyTutorRequestDTO): Promise<ITutor> {
  const mappedData = TutorMapper.toDomain(userId, dto);

  const existing = await this._tutorRepo.findOne({ tutorId: userId });

  const tutor = existing
    ? await this._tutorRepo.findOneAndUpdate(
        { tutorId: userId },
        { ...mappedData, adminApproved: false }
      )
    : await this._tutorRepo.create(mappedData);

  if (!tutor) throw new Error("Failed to save tutor application");

  await this._userRepo.findByIdAndUpdate(userId, {
    tutorProfile: tutor._id as Types.ObjectId,
    tutorApplication: { status: "Pending" },
  });

  return tutor;
}
     

  async getAllTutors(
  currentTutorId?: string,
  query?: ParsedQs
): Promise<TutorResponseDTO[]> {

  const tutors = await this._tutorRepo.findAllApproved(
    currentTutorId,
    query
  );

  return tutors.map((tutor) => ({
    ...tutor,

    profileImage:
      tutor.profileImage || "",

    certificates:
      tutor.certificates || [],
  }));
}

  async getTutorById(tutorId: string): Promise<ITutor | null> {
  const tutor = await this._tutorRepo.findById(tutorId);
  if (!tutor) return null;

  const profileImage: string | null = null;

  const certificates: string[] = [];
  return {
    ...tutor.toObject(),
    profileImage: profileImage,
    certificates,
  };
}


}
