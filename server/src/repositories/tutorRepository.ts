import { TutorModel,ITutor } from "../models/tutor";
import { ITutorRepository } from "./interfaces/ITutorRepository";

export class TutorRepository implements ITutorRepository {
  async create(tutor: Partial<ITutor>): Promise<ITutor> {
    return await TutorModel.create(tutor);
  }

  async findById(id: string): Promise<ITutor | null> {
    return await TutorModel.findById(id);
  }

  async findByTutorId(tutorId: string): Promise<ITutor | null> {
    return await TutorModel.findOne({ tutorId });
  }
}
