import { TutorModel,ITutor } from "../models/tutor";
import { ITutorRepository } from "./interfaces/ITutorRepository";

export class TutorRepository implements ITutorRepository {

  async createApplication(data:Partial<ITutor>) : Promise<ITutor> {
    const tutor = new TutorModel(data);
    return await tutor.save();
  }
}
