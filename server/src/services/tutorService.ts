import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ITutorRepository } from "../repositories/interfaces/ITutorRepository";
import { ITutorService } from "./interfaces/ITutorService";
import { ITutor } from "../models/tutor";
import { IClientRepository } from "../repositories/interfaces/IClientRepository";
import { Types } from "mongoose";
import { TutorMapper } from "../mappers/tutor.mapper";
import { ApplyTutorRequestDTO } from "../dtos/tutor.dto";
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
    const mappedData = TutorMapper.toDomain(userId,dto);
    const tutor = await this._tutorRepo.create(mappedData);

    await this._userRepo.findByIdAndUpdate(userId, { 
      tutorProfile: tutor._id as Types.ObjectId, 
      tutorApplication: { status: "Pending" } 
    });
    console.log("User updated successfully");

    return tutor;
  }
     

  async getAllTutors(
  currentTutorId?: string,
  query?: ParsedQs
): Promise<ITutor[]> {

  const tutors = await this._tutorRepo.findAllApproved(
    currentTutorId,
    query
  );

  return tutors.map((tutor: ITutor) => {

    return {
      ...tutor.toObject(),

      profileImage:
        tutor.profileImage || null,

      certificates:
        tutor.certificates || [],
    };
  });
}

  async getTutorById(tutorId: string): Promise<ITutor | null> {
  const tutor = await this._tutorRepo.findById(tutorId);
  if (!tutor) return null;

  let profileImage: string | null = null;

  let certificates: string[] = [];
  return {
    ...tutor.toObject(),
    profileImage: profileImage,
    certificates,
  };
}


}
