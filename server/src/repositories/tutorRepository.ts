import { inject } from "inversify";
import { TutorModel, ITutor } from "../models/tutor";
import { ITutorRepository } from "./interfaces/ITutorRepository";
import { TYPES } from "../types/types";

export class TutorRepository implements ITutorRepository {
  constructor(@inject(TYPES.ITutorModel) private readonly tutorModel: typeof TutorModel) {}

  async createApplication(data: Partial<ITutor>): Promise<ITutor> {
    return this.tutorModel.create(data);
  }

  async findAllApproved(): Promise<ITutor[]> {
    return this.tutorModel.find({ adminApproved: true }).populate("tutorId", "name email").sort({ createdAt: -1 });
  }
}

