import { TutorModel,ITutor } from "../models/tutor";

export interface ITutorRepository {
  create(tutor: Partial<ITutor>): Promise<ITutor>;
  findById(id: string): Promise<ITutor | null>;
  findByUserId(userId: string): Promise<ITutor | null>;
}

export class TutorRepository implements ITutorRepository {
  async create(tutor: Partial<ITutor>): Promise<ITutor> {
    return await TutorModel.create(tutor);
  }

  async findById(id: string): Promise<ITutor | null> {
    return await TutorModel.findById(id);
  }

  async findByUserId(userId: string): Promise<ITutor | null> {
    return await TutorModel.findOne({ userId });
  }
}
