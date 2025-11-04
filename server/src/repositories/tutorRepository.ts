import { inject } from "inversify";
import { TutorModel, ITutor } from "../models/tutor";
import { ITutorRepository } from "./interfaces/ITutorRepository";
import { TYPES } from "../types/types";
import { BaseRepository } from "./baseRepository";
import { FilterQuery } from "mongoose";

export class TutorRepository extends BaseRepository<ITutor> implements ITutorRepository {
  constructor(@inject(TYPES.ITutorModel) tutorModel: typeof TutorModel) {
    super(tutorModel);
  }

  async findAllApproved(excludeTutorId?: string): Promise<ITutor[]> {
    const query: FilterQuery<ITutor> = { adminApproved: true };
    if (excludeTutorId) {
    query.tutorId = { $ne: excludeTutorId };
    }
    return this.model
      .find(query)
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 });
  }

}
