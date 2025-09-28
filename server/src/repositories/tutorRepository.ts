import { inject } from "inversify";
import { TutorModel, ITutor } from "../models/tutor";
import { ITutorRepository } from "./interfaces/ITutorRepository";
import { TYPES } from "../types/types";
import { BaseRepository } from "./baseRepository";

export class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository {
  constructor(@inject(TYPES.ITutorModel) tutorModel: typeof TutorModel) {
    super(tutorModel);
  }

  async findAllApproved(): Promise<ITutor[]> {
    return this.model.find({ adminApproved: true }).populate("tutorId", "name email").sort({ createdAt: -1 });
  }
}